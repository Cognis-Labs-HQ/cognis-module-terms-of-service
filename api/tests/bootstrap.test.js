import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapModule, uninstallModule } from "../../bootstrap.js";

function context(registrations) {
    const database = {
        async ensureTable() {},
        async executeCommand() {
            return { rows: [] };
        },
    };
    return {
        moduleRoot: process.cwd(),
        router: {
            get(path) {
                registrations.api.push(path);
            },
            put(path) {
                registrations.api.push(path);
            },
            post(path) {
                registrations.api.push(path);
            },
        },
        getCapability(name) {
            if (name === "auth:requireAuth") return async () => {};
            if (name === "db:executor") return database;
            if (name === "docs:versionStore") {
                return {
                    createStore: () => ({
                        async ensureSchema() {},
                        async getLatest() {
                            return null;
                        },
                        async publish() {},
                        async deleteAll() {},
                    }),
                };
            }
            assert.fail(`Unexpected capability: ${name}`);
        },
        registerStaticDir() {},
        registerSpaRoute(route) {
            registrations.pages.push(route.base);
        },
        registerAdminSection(section) {
            registrations.admin.push(section);
        },
        registerNavbarPlugin(plugin) {
            registrations.plugins.push(plugin);
        },
        flow: {
            exists() {
                return false;
            },
        },
        log() {},
    };
}

test("registers the Legal administration section and public pages", () => {
    const registrations = { admin: [], api: [], pages: [], plugins: [] };
    bootstrapModule(context(registrations));

    assert.equal(
        registrations.admin[0].label,
        "module.terms_of_service.admin.title",
    );
    assert.equal(registrations.admin[0].access.minRole, "admin");
    assert.deepEqual(registrations.pages, [
        "/terms-of-service",
        "/privacy-policy",
        "/eula",
    ]);
    assert.ok(
        registrations.api.includes(
            "/api/v1/modules/terms-of-service/documents/:slug",
        ),
    );
    assert.match(registrations.plugins[0].scriptUrl, /consent-enforcement/);
});

test("uninstall deletes content only when requested", async () => {
    const commands = [];
    const ctx = {
        getCapability(name) {
            if (name === "docs:versionStore") {
                return {
                    createStore: () => ({
                        async ensureSchema() {
                            commands.push({
                                option: "ENSURE",
                                table: "core_document_versions",
                            });
                        },
                        async deleteAll() {
                            commands.push({
                                option: "DELETE",
                                table: "core_document_versions",
                            });
                        },
                    }),
                };
            }
            return {
                async ensureTable(definition) {
                    commands.push({ option: "ENSURE", table: definition.name });
                },
                async executeCommand(command) {
                    commands.push(command);
                    return { rows: [] };
                },
            };
        },
        log() {},
    };
    await uninstallModule(ctx, { deleteContent: false });
    assert.deepEqual(commands, []);
    await uninstallModule(ctx, { deleteContent: true });
    assert.equal(commands[0].table, "core_document_versions");
    assert.equal(commands[1].table, "terms_of_service_consents");
    assert.equal(commands[2].table, "terms_of_service_consents");
    assert.equal(commands[3].table, "core_document_versions");
});
