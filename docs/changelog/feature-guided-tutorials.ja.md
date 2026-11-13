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

## 表示されるチュートリアル対象

強調する領域と「次へ」の強調を明示します。

## 共通のフローティングメニュー待ち行列

メニューはホスト共通の待ち行列とコンポーネントの寿命に従います。

## 復旧操作の説明

対象がない画面では「次へ」と最初からやり直す操作を提供し、再実行では中止も選べます。

## 目的の明確なガイド

表示順に沿って異なる可視操作を説明します。共通指針は画面状態の検出、安定した例、空の状態、条件付き分岐、ライフサイクルの後処理を扱います。再実行操作と動きを減らす設定の文書をホストと一致させます。

## 翻訳カタログの統一

モジュールのメタデータとチュートリアルの翻訳キーは、小文字の単語をピリオドで区切ります。カタログの翻訳内容は維持し、周囲の XML と字下げを揃えます。厳格な名前空間検証により、翻訳キーのハイフンとアンダースコアを拒否します。モジュール ID、UUID、ケイパビリティ、チュートリアル完了の識別子は変更しません。

## 法的文書チュートリアルの修正

公開ページのガイドは現在の文書内の見出しについて説明し、セクション見出しがない場合はナビゲーションを省きます。管理者ガイドは一つの文書を選んでエディターを開き、実際の編集後にプレビュー分岐へ進み、下書きのプレビューが表示されてから公開操作を説明します。「次へ」で未実行の編集分岐を飛ばせます。存在しない同意レポートは対象外とし、内容を自動的に公開・破棄しません。保存キー `module.terms-of-service.offline` を維持し、更新後もサーバー確認済みの同意記録でオフラインアクセスできるようにします。

## 文書の下書きと同意状況

一つの法的文書から始めます。新規文書では「追加」をクリックし、公開済み文書では既存のエディターを使います。Markdown を入力・修正して「プレビュー」で読者向けの表示を確認します。チュートリアルの操作で下書きを公開することはありません。ガイド終了後、待機中の変更メニューで保存・破棄できます。同意状況の分岐は下書きとは別に公開済み文書を選び、一覧を開いてアカウント検索、同意済み・未同意・すべてのフィルター、同意済みの版と最新版の列を説明します。検索結果が空の場合や未公開の環境でも同意記録を作りません。

## コミット

- [5c18cc7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5c18cc77ee2ea8a0629214557234304abab94ab8)
- [16412de](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/16412de6ffeaa1dbf3f5fc759e3b5dba57affa0f)
- [76a5028](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/76a5028bf65622ee5102df8ae30e241e7e059ec5)
- [c61b252](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c61b2522ce21c069eff5106a637926da90567d55)
- [8831fd7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8831fd774be8df97f89e50e30f27cd9b04757f73)
- [50559bd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/50559bde9f2021065a433e64f87563e18d35edee)
- [65032ae](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/65032aee78c1abd7007732ec97fee081a436aa14)
- [5613809](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/56138097d74e38bd34f0c05c024d9770d59adedf)
- [1a75db1](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1a75db178c7c3550aa4e5aea74089df66c8acfb0)
- [5fe49707c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5fe49707c9638dbdd173fd74046188312f13945e)
- [46186da39](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/46186da399d77530c3349fb0bd9c711315bcc719)
- [feaf0ce](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/feaf0ceecf088f06aa8d80891e0413086bec6ddd)
- [36c7624](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/36c7624b856601b60a80083761bf331cc8b4f6d5)
- [6ce92c2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/6ce92c2a4d87346d0fe42a57d57b476a3db382f7)
