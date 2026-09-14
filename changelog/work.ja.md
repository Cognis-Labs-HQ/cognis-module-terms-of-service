# ログイン Shell のない公開法的文書

**機能ブランチ:** work

## ログインせずに法的文書を閲覧可能

すべての法的ルートは引き続き Cognis ページ Composer を使用します。ログインセッションのない訪問者には Composer のフラグでトップバー、ナビゲーション、テーマ切り替え、Footer、ページコンテキスト、ツールバー、レイアウト保存、アカウント拡張を非表示にし、公開済みの Markdown 描画文書のみを表示します。各法的 SPA ルートを Host の `public: true` ルート Capability で明示的に登録し、保護されたルートを弱めることなく Cognis が匿名で配信およびルーティングできるようにします。認証済みユーザーには、従来の完全な Shell 付き文書表示と変更比較が引き続き提供されます。

## コミット

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
