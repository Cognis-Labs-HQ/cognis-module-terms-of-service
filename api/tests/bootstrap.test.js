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
        },
        getCapability(name) {
            if (name === "auth:requireAuth") return async () => {};
            if (name === "db:executor") return database;
            if (name === "ui:reuse") {
                return { has: (entry) => entry === "markdown:composer" };
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
        log() {},
    };
}

test("registers the Legal administration section and public pages", () => {
    const registrations = { admin: [], api: [], pages: [] };
    bootstrapModule(context(registrations));

    assert.equal(registrations.admin[0].group, "legal");
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
});

test("fails safely when core does not expose the Markdown composer", () => {
    const ctx = context({ admin: [], api: [], pages: [] });
    const original = ctx.getCapability;
    ctx.getCapability = (name) =>
        name === "ui:reuse" ? { has: () => false } : original(name);
    assert.throws(() => bootstrapModule(ctx), /markdown:composer/);
});

test("uninstall deletes content only when requested", async () => {
    const commands = [];
    const ctx = {
        getCapability() {
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
    assert.equal(commands[0].table, "terms_of_service_documents");
    assert.equal(commands[1].option, "DELETE");
});
