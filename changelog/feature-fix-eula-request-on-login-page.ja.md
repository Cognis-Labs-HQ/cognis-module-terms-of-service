# 公開状態を認識する認証 Footer

**機能ブランチ:** feature-fix-eula-request-on-login-page

## 未公開の法務文書へのリクエストを回避

認証 Footer は公開 Index を一度だけ読み込み、そこに掲載された文書のリンクだけを作成するようになりました。各法務文書 Endpoint を確認しないため、未公開の EULA がログインページから想定内の 404 リクエストを発生させることはありません。

## コミット

- [271120b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/271120b069085e88096ef06ca91ef01557c18b58)
