import assert from "node:assert/strict";
import test from "node:test";
import { registerCommands } from "../index.js";

test("CLI commands consume the public module API", async () => {
    const commands = new Map();
    registerCommands({
        register(name, handler) {
            commands.set(name, handler);
        },
        async apiGet(base, path, token) {
            return { base, path, token };
        },
    });
    const context = {
        apiBaseUrl: "https://cognis.example",
        async getApiToken() {
            return "token";
        },
    };
    assert.equal(commands.size, 2);
    assert.deepEqual(
        await commands.get("terms-of-service:documents")(context),
        {
            base: "https://cognis.example",
            path: "/api/v1/modules/terms-of-service/documents",
            token: "token",
        },
    );
});
