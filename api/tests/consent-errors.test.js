import assert from "node:assert/strict";
import test from "node:test";
import { consentFailure } from "../index.js";

test("consent failures distinguish malformed, oversized, and stale input", () => {
    assert.equal(consentFailure(new Error("invalid_json")).status, 400);
    assert.equal(consentFailure(new Error("request_too_large")).status, 413);
    assert.equal(
        consentFailure(new Error("stale_document_versions")).status,
        409,
    );
    assert.equal(consentFailure(new Error("database_failed")).status, 500);
});
