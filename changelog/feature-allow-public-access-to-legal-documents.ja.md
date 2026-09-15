# ログイン Shell のない公開法的文書

**機能ブランチ:** feature-allow-public-access-to-legal-documents

## ログインせずに法的文書を閲覧可能

すべての法的ルートは引き続き Cognis ページ Composer を使用します。ログインセッションのない訪問者には Composer のフラグでアカウント依存のグローバル Shell 操作部を非表示にしつつ、文書フレーム、ローカライズ済みページコンテキスト、セクションツールバーを維持します。各法的 SPA ルートを Host の `public: true` ルート Capability で明示的に登録し、保護されたルートを弱めることなく Cognis が匿名で配信およびルーティングできるようにします。ログインページと登録ページは専用の認証 Footer Plugin を読み込み、各公開文書を個別に確認して、公開済みの場合にのみローカライズ済み法的ルートリンクを提供します。1件の確認失敗が他のリンクを妨げることはありません。認証済みユーザーには、従来の完全な Shell 付き文書表示と変更比較が引き続き提供されます。

## 未承認ステータスを赤色で明示

未承認の同意ステータスは Core の赤い無効状態 Pill を再び使用し、承認済みステータスと明確に区別できるようになりました。

## 認証 Footer と公開レイアウト

認証 Footer は Host の License リンクを維持し、認証済みユーザー専用の Changelog リンクを削除して、3つの法的リンクを表示します。公開法的ページは端から端までの表示ではなく、構成済み文書レイアウトを維持するようになりました。

## コミット

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
- [f81a194](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f81a194a3d10e8663d31367aa1c9017094f476db)
- [0e7944f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0e7944f94387695520604e30696097c06f192676)
