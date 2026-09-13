import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "../..");
const LANGUAGES = ["de", "en", "id", "ja"];
const BRANCH = "feature-add-terms-of-service-module-to-cognis";

function headingLevels(path) {
    return readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.match(/^#+/)[0].length);
}

test("localized standards and documentation templates stay synchronized", () => {
    const standardLevels = headingLevels(resolve(ROOT, "docs/standard.en.md"));
    const templateLevels = headingLevels(
        resolve(ROOT, ".github/DOCUMENTATION_TEMPLATE.en.md"),
    );
    for (const language of LANGUAGES) {
        assert.deepEqual(
            headingLevels(resolve(ROOT, `docs/standard.${language}.md`)),
            standardLevels,
        );
        assert.deepEqual(
            headingLevels(
                resolve(ROOT, `.github/DOCUMENTATION_TEMPLATE.${language}.md`),
            ),
            templateLevels,
        );
    }
});

test("localized changelogs follow the shared release-note contract", () => {
    const commitUrl =
        "https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/";
    for (const language of LANGUAGES) {
        const path = resolve(ROOT, `changelog/${BRANCH}.${language}.md`);
        assert.ok(statSync(path).isFile());
        const markdown = readFileSync(path, "utf8");
        assert.match(markdown, /^# [^#]/);
        assert.match(
            markdown,
            new RegExp("^\\*\\*.+:\\*\\* `" + BRANCH + "`$", "m"),
        );
        assert.ok((markdown.match(/^## /gm) ?? []).length >= 2);
        assert.ok(markdown.includes(commitUrl));
    }
    assert.deepEqual(
        readdirSync(resolve(ROOT, "changelog")).filter((name) =>
            name.startsWith(BRANCH),
        ).length,
        LANGUAGES.length,
    );
});
