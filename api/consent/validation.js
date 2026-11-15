import { DOCUMENTS } from "../store.js";

export function consentVersions(body) {
    const versions = body?.versions;
    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Object.keys(body).some(
            (key) => key !== "accepted" && key !== "versions",
        ) ||
        !versions ||
        typeof versions !== "object" ||
        Array.isArray(versions) ||
        Object.keys(versions).some(
            (slug) =>
                !Object.hasOwn(DOCUMENTS, slug) ||
                typeof versions[slug] !== "string" ||
                !versions[slug],
        ) ||
        body.accepted !== true
    ) {
        throw new Error("invalid_consent_versions");
    }
    return { ...versions };
}
