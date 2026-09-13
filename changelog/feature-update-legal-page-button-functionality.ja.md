# 法的文書編集を刷新

**機能ブランチ:** feature-update-legal-page-button-functionality

## 文書操作を簡潔化

各作成操作を文書見出しの横へ移動し、エディターが開いている間は破壊的な削除操作へ切り替えます。エディターの削除には明示的な確認が必要になりました。

## Cognis 編集ユーティリティを統合

保存と破棄に Cognis の変更追跡を使用し、保存時に変更を公開して成功トーストを表示します。また、法務タイトル横の情報ツールチップで Markdown 対応を案内します。

## 作成レイアウトを改善

サイズ変更できない全幅エディターと、その編集領域の下に連結された同じ幅の作成・プレビュー操作を提供します。

## 管理ルートの Mount エラーを防止

ページの直接 Mount を3つの公開法的文書ルートに限定し、`/administration` で Contribution を読み込んだ際に未対応ルートエラーが発生しないようにします。

## コミット

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
