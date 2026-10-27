export function createOfflineHost() {
    const values = new Map();
    const receipts = new Map();
    let offline = false;
    return {
        policy: { update: (id, status) => receipts.set(id, status) },
        state: { isOffline: () => offline },
        setOffline: (value) => {
            offline = value;
        },
        receipts,
        storage: {
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
            removeItem: (key) => values.delete(key),
        },
    };
}
