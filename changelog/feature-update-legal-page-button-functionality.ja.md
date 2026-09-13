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

## モジュール再起動中も Navigation を維持

読み込み済みの同意 Hook がモジュールの更新または再起動中に Endpoint 不在の応答を受けた場合、Authentication Flow を拒否して Navigation を妨げる代わりに、Lifecycle Fallback を記録し、以降の確認を停止して処理を継続するようにしました。

## 管理画面の編集操作に統一

すべての法的文書を、折りたたみ可能な SVG 見出しと行内の追加・削除ボタンを備えた全幅の連続セクションにまとめます。Markdown Tooltip は法務見出しへ直接追加され、編集には Host のフローティング変更追跡を使用し、作成・プレビューは Messages の操作に合わせ、保存失敗時には内容のあるローカライズ済みエラーを表示します。

## コミット

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
- [a3ea3cd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3ea3cd458906443f8316daa0304e48a0da5eb27)
- [1f11f9b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f11f9b4e568e0f53dfeaa5900b333cc354a2e62)
