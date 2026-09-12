# 利用規約モジュール

**機能ブランチ:** `feature-add-terms-of-service-module-to-cognis`

## 法的文書の管理

Cognis の Markdown 作成コントラクトを使用して利用規約、プライバシーポリシー、EULA を作成・公開できる「法務」セクションを管理画面に追加します。

## 公開法務ページ

サニタイズ済み Markdown 表示、モジュール所有の永続ストレージ、認可、ローカライズ、ライフサイクルクリーンアップを備えた3つの固定公開ルートを提供します。

## 既存のブラウザー再利用コントラクト

隣接モジュールと同様に `cognis.uiCtx` と `ui:reuse.importModule()` を使用し、既存の Core Markdown レンダラーを直接インポートして、新しい Core Capability を必要とせず既存の管理 Sub-Composer エクスポートを実装します。

## コミット

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — 法的文書公開モジュールを実装。
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — 既存の Host UI 再利用コントラクトを使用。
