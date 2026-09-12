const uiCtx = globalThis[Symbol.for("cognis.uiCtx")];

if (!uiCtx?.capabilities || typeof uiCtx.capabilities.get !== "function") {
    throw new Error("Required UI context unavailable: cognis.uiCtx");
}

const reuse = uiCtx.capabilities.get("ui:reuse");

if (!reuse || typeof reuse.importModule !== "function") {
    throw new Error("Required UI capability unavailable: ui:reuse");
}

export { uiCtx };
export const importReuseModule = (path) => reuse.importModule(path);
