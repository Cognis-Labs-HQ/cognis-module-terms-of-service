# Cognis 利用規約モジュール

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis の管理画面に **法務** セクションを追加し、利用規約、プライバシーポリシー、EULA を `/terms-of-service`、`/privacy-policy`、`/eula` で公開します。

## Cognis Core のサポート

Markdown または管理画面登録のための Core 変更は不要です。隣接モジュールと同様に、ブラウザーコードは `globalThis[Symbol.for("cognis.uiCtx")]` を読み取り、`uiCtx.capabilities.get("ui:reuse")` で `ui:reuse` を取得して `markdown-renderer.js` をインポートします。モジュール所有の作成・プレビュー切り替えは、既存のサニタイズ済み `renderMarkdown()` 実装を使用します。Toast とエラーダイアログは既存の `uiCtx` Capability から取得します。`createAdminSection({ i18n, apiFetch })` エクスポートが既存の管理 Sub-Composer コントラクトを提供します。

## セキュリティとライフサイクル

文書を管理できるのは管理者だけです。公開利用者が取得できるのは固定された3文書のみです。無効化しても内容は保持され、`deleteContent` を指定したアンインストール時だけ削除されます。
