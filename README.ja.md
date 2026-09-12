# Cognis 利用規約モジュール

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis の管理画面に **法務** セクションを追加し、利用規約、プライバシーポリシー、EULA を `/terms-of-service`、`/privacy-policy`、`/eula` で公開します。

## Cognis Core に必要な対応

Core は `ctx` で `ui:reuse` を公開し、`bind(options)` と `render(element, markdown)` を持つブラウザー部品 `markdown:composer`、およびライフサイクル管理された `ctx.registerAdminSection(options)` を提供する必要があります。Host は router、i18n、toast、エラーダイアログ、focus、reuse の各クライアントを `mount(root, host)` に渡します。レンダラーとプレビューにはメッセージ作成画面と同じサニタイズ済み Markdown 実装を使用します。

## セキュリティとライフサイクル

文書を管理できるのは管理者だけです。公開利用者が取得できるのは固定された3文書のみです。無効化しても内容は保持され、`deleteContent` を指定したアンインストール時だけ削除されます。
