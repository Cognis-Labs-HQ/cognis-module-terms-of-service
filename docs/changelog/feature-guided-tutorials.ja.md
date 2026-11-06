# ガイド付きチュートリアル

**Feature Branch:** feature-guided-tutorials

## 技術仕様

同意やその変更を行わず、法的文書とナビゲーションを紹介します。認証済みのオンラインセッションが必要です。

モジュールは ctx 経由で手順と翻訳済みテキストを登録します。ホストが一覧、説明、矢印、強調表示、キーとポインターの制御、アクセス確認付き SPA ナビゲーション、アクセシビリティを担当します。閉じる操作、手順外への移動、権限の喪失、モジュールの無効化でセッションを終了します。プロバイダーのマウント失敗時は登録を取り消します。

プロバイダーテストでは公開契約、4 言語の翻訳、利用条件、失敗時の後処理、未対応ホストバージョンの拒否を確認します。

## ページ連動の初回ガイド

ホストは説明、矢印、強調表示、アクセシビリティ、共通のフローティング操作メニューを担当します。初回は常に「次へ」を表示し、中止とスキップは表示しません。再生時の中止には `btn-cancel` を使います。完了はブラウザー内でアカウント別に保存します。移動、アクセス喪失、プロバイダー解除でセッションを終了し、マウント失敗では登録を取り消します。

## ページのガイド

法的文書のガイドは利用規約、プライバシーポリシー、EULA に対応し、利用者が開いた文書に留まります。

## 法的文書の管理ガイド

表示中の法的文書の管理セクションで、管理者限定のガイドがバージョン付き公開と同意状況の一覧を説明します。文書の変更や同意の代行は行いません。

## 操作に役立つ説明

各ステップではページの操作項目と作業を説明し、権限やガイドが実行しない操作についての不要な説明を省きます。

## ステップごとに次へ進む強調を指定

各ステップで `highlightNext` を明示します。「次へ」や「完了」が必要な説明では有効にし、操作や待機条件で進む練習では無効にします。動きを減らす設定では静的な枠を表示します。

すべての UI コンポーネントにチュートリアルを用意します。開発ガイドラインでは、利用者の目的に沿う操作説明と、機能や UI 動作の変更に伴う既存チュートリアルの見直しを求めます。

## 具体的な対象と分岐の再開始

文書の案内では文書の見出しを強調し、同意の案内では公開済み文書の利用可能な同意レポートの検索欄を強調します。チュートリアルのセクション内で利用可能な最初の対象を選び、対象がない場合はステップを飛ばします。

## コミット

- [5c18cc7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5c18cc77ee2ea8a0629214557234304abab94ab8)
- [16412de](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/16412de6ffeaa1dbf3f5fc759e3b5dba57affa0f)
- [76a5028](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/76a5028bf65622ee5102df8ae30e241e7e059ec5)
- [c61b252](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c61b2522ce21c069eff5106a637926da90567d55)
- [8831fd7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8831fd774be8df97f89e50e30f27cd9b04757f73)
- [50559bd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/50559bde9f2021065a433e64f87563e18d35edee)
- [65032ae](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/65032aee78c1abd7007732ec97fee081a436aa14)
