const CACHE_KEY = "module.terms-of-service.offline";
const cacheStates = new WeakMap();

/** Cache only successful server snapshots; accepting terms always requires the server. */
export function createOfflineConsent({
    policy,
    storage = localStorage,
    account = () => storage.getItem("cognis_account") ?? "",
    log,
}) {
    function cacheState() {
        let owner;
        try {
            owner = account();
        } catch (error) {
            log?.("error", "Legal cache account could not be read.", {
                component: "terms-of-service",
                operation: "readOfflineConsentAccount",
                errorName: error.name,
            });
            return { account: null, failed: true, status: null };
        }
        let state = cacheStates.get(storage);
        if (!state || state.account !== owner) {
            state = { account: owner, failed: false, status: null };
            cacheStates.set(storage, state);
        }
        return state;
    }
    function load() {
        if (cacheState().failed) return null;
        try {
            const cached = JSON.parse(storage.getItem(CACHE_KEY) ?? "null");
            return cached?.account === account() ? cached.status : null;
        } catch (error) {
            log?.("error", "Cached legal documents could not be read.", {
                component: "terms-of-service",
                operation: "readOfflineConsent",
                errorName: error.name,
            });
            return null;
        }
    }
    function accepted(status) {
        return (
            status?.required === false &&
            Array.isArray(status.documents) &&
            status.documents.every(
                (document) =>
                    typeof document.version === "string" &&
                    document.version.length > 0 &&
                    document.accepted === true &&
                    document.consentedVersion === document.version,
            )
        );
    }
    function publish(status) {
        policy.update("terms-of-service", {
            allowed: accepted(status),
            revision: JSON.stringify(
                (status?.documents ?? []).map(({ slug, version }) => [
                    slug,
                    version,
                ]),
            ),
        });
    }
    function revoke() {
        cacheState().failed = true;
        try {
            storage.removeItem(CACHE_KEY);
        } catch (error) {
            log?.("error", "Cached legal documents could not be removed.", {
                component: "terms-of-service",
                operation: "removeOfflineConsent",
                errorName: error.name,
            });
        } finally {
            publish(null);
        }
    }
    return {
        load,
        restore() {
            const status = load();
            publish(status);
            return status;
        },
        record(status) {
            if (
                !status ||
                !Array.isArray(status.documents) ||
                typeof status.required !== "boolean"
            ) {
                cacheState().status = null;
                revoke();
                throw new Error("invalid_consent_snapshot");
            }
            const current = load() ?? cacheState().status;
            const documents = status.documents.map((document) => {
                const previous = current?.documents?.find(
                    (candidate) => candidate.slug === document.slug,
                );
                return previous &&
                    Date.parse(previous.publishedAt) >
                        Date.parse(document.publishedAt)
                    ? { ...previous, accepted: false }
                    : document;
            });
            const returnedSlugs = new Set(documents.map(({ slug }) => slug));
            documents.push(
                ...(current?.documents ?? []).filter(
                    ({ slug }) => !returnedSlugs.has(slug),
                ),
            );
            status = { ...status, documents };
            if (documents.some((document) => !document.accepted))
                status = { ...status, required: true, accepted: false };
            cacheState().status = status;
            try {
                const owner = cacheState().account;
                if (owner === null)
                    throw new Error("offline_consent_account_unavailable");
                const snapshot = JSON.stringify({ account: owner, status });
                if (snapshot.length * 2 > 1_000_000)
                    throw new Error("offline_consent_cache_full");
                storage.setItem(CACHE_KEY, snapshot);
                cacheState().failed = false;
            } catch (error) {
                revoke();
                log?.(
                    "error",
                    "Legal snapshot caching failed; online enforcement continues.",
                    {
                        component: "terms-of-service",
                        operation: "writeOfflineConsent",
                        errorName: error.name,
                    },
                );
                return status;
            }
            publish(status);
            return status;
        },
        observe(document) {
            if (
                !document ||
                typeof document.slug !== "string" ||
                typeof document.version !== "string"
            )
                throw new Error("invalid_legal_document");
            const current = load() ?? cacheState().status;
            const previous = current?.documents.find(
                (candidate) => candidate.slug === document.slug,
            );
            if (previous?.version === document.version) {
                this.record({
                    ...current,
                    documents: current.documents.map((candidate) =>
                        candidate.slug === document.slug
                            ? {
                                  ...candidate,
                                  ...document,
                                  accepted: candidate.accepted,
                                  consentedVersion: candidate.consentedVersion,
                              }
                            : candidate,
                    ),
                });
                return;
            }
            const documents = [
                ...(current?.documents ?? []).filter(
                    (candidate) => candidate.slug !== document.slug,
                ),
                {
                    ...document,
                    accepted: false,
                    consentedVersion: previous?.consentedVersion ?? null,
                },
            ];
            this.record({
                ...current,
                documents,
                accepted: false,
                required: true,
            });
        },
        allowed: () => accepted(load()),
    };
}
