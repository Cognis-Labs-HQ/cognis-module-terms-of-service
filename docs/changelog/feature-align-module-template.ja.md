# モジュールを開発者テンプレートに統一

**機能ブランチ:** feature-align-module-template

## 中断時に読み込み状態を解放

1.5.47 — 直接ページを中断すると、翻訳、プロバイダー、コンポーザーの初期化が保留中でも共通の読み込みトークンを直ちに解放します。リソースのクリーンアップは同じホストシグナルに結び付けます。

## パッケージの参照先と開発者向けガイド

リリース 1.5.46 — パッケージ検証では、エントリーポイント、アイコン、バナー、スクリーンショットが、解決済みのパスを含めチェックアウト内の通常ファイルであることを確認します。ドキュメントは公開契約を説明し、リリースのメタデータにはマニフェストを参照します。変更履歴にはリリースの来歴を保持します。 公開の法的文書ページはホストの直接エントリーのライフサイクルシグナルを使用します。翻訳や文書の読み込みが中断された場合、古いUIを公開せず、コンポーザーを破棄します。遅延した初期化は移動先のフッターを更新しません。読み込みトークンは完了、失敗、中断のいずれでも解放します。

## 標準構成と所有範囲を守る統合

テンプレートの指針、ドメイン別ルート、翻訳された統合文書、実行可能な構成チェック、最終パッケージハッシュを同期します。公開URLとモジュール識別子は維持します。ブラウザーの提供機能は担当ホストのライフサイクル契約に従います。

## バナー全体を表示範囲に収める

Terms of Service バナーを再構成し、Marketplace の切り抜き後もロゴ、タイトル、文書、盾の全体を表示します。既存の文書アイコンは維持します。

## Marketplace の説明を統一する

Marketplace のメタデータに短い操作概要と具体的な機能説明を使用し、翻訳の意味を揃えます。

## コミット

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)

- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
