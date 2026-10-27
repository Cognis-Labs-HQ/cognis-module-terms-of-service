# Queued Delivery and Consent

**Feature Branch:** feature-offline-delivery

## Consent Cache Safety

Consent snapshots retain previously observed documents omitted by an older response. Newly published, unaccepted documents continue blocking offline access and replay until their current versions are accepted by the server. Cache size limits and storage failures revoke offline permission without discarding the fresh online status: mandatory consent, online acceptance and public legal rendering continue. Shared, account-scoped in-memory state preserves observed versions during a cache failure and prevents stale stored permission from being restored by another client in the same page. Offline permission returns only after a complete accepted snapshot is successfully cached.

## Queued Delivery and Consent

Recovery refreshes providers and runs `authenticate-session` before the final `afterSession` stage can replay activity. Required providers declare `offlineAccessGuard` in the server catalog. Unknown requirements or missing consent fail closed. Terms of Service caches the latest fetched document versions and server-confirmed acceptance per account. A new unaccepted version immediately blocks offline reads, navigation and queued writes, and prevents replay until online consent succeeds. Offline acceptance is unavailable. Private content snapshots remain tab-local; only the bounded operation queue and legal snapshots survive reload.

The host exposes `offline:outbox`, `offline:state` and `offline:accessPolicy` through ctx. Components register delivery handlers for their provider lifetime and submit stable operation IDs through `offline:enqueue`; `offline:flush` authorizes and delivers. The durable account-bound queue holds at most 1,000 records and 1 MB for seven days, without tokens. It preserves original IDs and timestamps, retries transient failures and removes acknowledged or permanently rejected records. A localized warning reports rejected records. Logout clears the account queue; changing accounts never replays another account’s data. Disabling Offline Mode stops new queued writes. Pending writes may still deliver online.

## Offline polling limits

Offline Mode stops consent polling and ordinary recovery polling. Only one lightweight server health probe runs every fifteen minutes, even after repeated browser online events. Online connection-recovery failures back off to fifteen minutes. Consent polling backs off after failures to five minutes, stops entirely offline, and resumes after reconnection. Required cached legal acceptance still gates offline access.

## Commits

- [2dba1c6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2dba1c61ea1ba7b219e06c09036408d89503571b)
- [2492ad3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2492ad306ac7458b8d8e27083116420f298bebc1)
- [3b245ac](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3b245ac3c4fd6d4c03551ec02a90deda5fd5549f)
- [2a56415](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2a5641575b9f766b74436fa036ee34b17a5e79c9)
