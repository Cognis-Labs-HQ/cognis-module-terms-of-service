# 利用規約モジュール

**機能ブランチ:** `feature-add-terms-of-service-module-to-cognis`

## 法的文書の管理

Cognis の Markdown 作成コントラクトを使用して利用規約、プライバシーポリシー、EULA を作成・公開できる「法務」セクションを管理画面に追加します。

## 公開法務ページ

サニタイズ済み Markdown 表示、モジュール所有の永続ストレージ、認可、ローカライズ、ライフサイクルクリーンアップを備えた3つの固定公開ルートを提供します。

## 既存のブラウザー再利用コントラクト

隣接モジュールと同様に `cognis.uiCtx` と `ui:reuse.importModule()` を使用し、既存の Core Markdown レンダラーを直接インポートして、新しい Core Capability を必要とせず既存の管理 Sub-Composer エクスポートを実装します。

## 不変の法的文書バージョンと必須同意

公開するたびに Core の文書バージョン Capability を通じて不変バージョンを作成します。登録時には最新の利用条件とプライバシーポリシーへの明示的な同意を記録し、既存アカウントにはいずれかの文書が変更されるたびに回避できない同意画面を表示します。拒否するとログアウトします。

## 外部モジュール構造とコントリビューター規則

リポジトリを保守中の Jitsi Meet および Nextcloud Whiteboard モジュール規約に合わせます。ルートの共有 Changelog ディレクトリ、同期されたモジュール固有 AI 指示、復元した CLI 統合、簡潔な現行仕様、独立実行可能な文書・構造コントラクトテストを整備しました。

## コミット

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — 法的文書公開モジュールを実装。
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — 既存の Host UI 再利用コントラクトを使用。
- [27b6605](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/27b66054102cba443e7b9d74213da0099697f695) — 不変バージョンとアカウント単位の法的同意強制を追加。
- [361dac2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/361dac2396c03224fc407f79d400bb6c163c61ec) — 外部モジュール構造とコントリビューター規則を整合。
