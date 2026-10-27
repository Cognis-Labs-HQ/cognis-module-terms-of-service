# Cognis 利用規約モジュール

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis の管理画面に **法務** セクションを追加し、利用規約、プライバシーポリシー、EULA を `/terms-of-service`、`/privacy-policy`、`/eula` で公開します。

## Cognis Core に必要な対応

Markdown、フィードバック、ナビゲーション、管理画面には既存のブラウザーコントラクトで十分です。Core は追加で、Docs と Changelog の追記専用アーカイブを `docs:versionStore` Capability として公開し、`createStore({ namespace, database, documents })` から `ensureSchema()`、`getLatest(slug)`、`publish({ slug, content, actorId })`、`deleteAll()` を提供する必要があります。`publish` は必ず暗号学的識別子を持つ不変バージョンを新規作成します。また、Core 所有の `construct-registration-ui` Flow に `compose-form` Stage を設け、`/register` で統合を読み込み、フィールドを検証し、認証済みセッション確立後に `completeRegistration({ apiFetch })` を実行する必要があります。既存アカウントの強制には既存の `authenticate-session`、Popup、Logout、Router、`uiCtx` コントラクトを使用します。

## セキュリティとライフサイクル

文書を管理できるのは管理者だけです。公開利用者が取得できるのは固定された3文書のみです。無効化しても内容は保持され、`deleteContent` を指定したアンインストール時だけ削除されます。

## オフラインの定期確認の制限

オフラインモードでは、同意確認と通常の接続復旧の定期確認を停止します。ブラウザーのオンラインイベントが繰り返されても、軽量のサーバーヘルスチェックだけを十五分ごとに実行します。オンラインでの接続確認の失敗時は最大十五分まで間隔を延ばします。同意確認は失敗時に最大五分まで間隔を延ばし、オフラインでは完全に停止して再接続後に再開します。必要な文書へのキャッシュ済みの同意は引き続きオフラインアクセスの条件です。
