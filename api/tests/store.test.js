import assert from "node:assert/strict";
import test from "node:test";
import { DOCUMENTS, LegalDocumentStore } from "../store.js";

test("store uses a module-owned schema and parameterized slug lookup", async () => {
    const calls = [];
    const database = {
        async ensureTable(definition) {
            calls.push(definition);
        },
        async executeCommand(command) {
            calls.push(command);
            return {
                rows: [
                    {
                        slug: "privacy-policy",
                        markdown: "# Privacy",
                        updated_at: "2026-09-08",
                    },
                ],
            };
        },
    };
    const store = new LegalDocumentStore(database);
    await store.ensureSchema();
    const document = await store.get("privacy-policy");
    assert.equal(calls[0].name, "terms_of_service_documents");
    assert.deepEqual(calls[1].where, [
        { column: "slug", value: "privacy-policy" },
    ]);
    assert.equal(document.path, DOCUMENTS["privacy-policy"]);
});

test("store publishes documents with an upsert", async () => {
    const commands = [];
    const database = {
        async executeCommand(command) {
            commands.push(command);
            if (command.option === "SELECT") return { rows: [] };
            return { rows: [] };
        },
    };
    const store = new LegalDocumentStore(database);
    await store.save("eula", "# EULA", "admin-1");
    assert.equal(commands[0].option, "UPSERT");
    assert.equal(commands[0].values.updated_by, "admin-1");
    assert.deepEqual(commands[0].conflictColumns, ["slug"]);
});
