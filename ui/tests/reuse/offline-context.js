export function createOfflineHost() {
    const values = new Map();
    const receipts = new Map();
    return {
        policy: { update: (id, status) => receipts.set(id, status) },
        state: { isOffline: () => false },
        receipts,
        storage: {
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
            removeItem: (key) => values.delete(key),
        },
    };
}
