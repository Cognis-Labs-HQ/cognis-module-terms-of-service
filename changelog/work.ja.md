# 法的文書の保存とレイアウトを復旧

**機能ブランチ:** work

## 保存済み文書の内容を復旧

コアのバージョンストアが返す `markdown` フィールドをモジュールの文書レスポンスに対応付け、新しく公開した文書が正しく返され、変更追跡の保存操作が正常に完了するようにしました。

## 法的文書エディターのレイアウトを改善

3つの文書をコンパクトな個別カードとして表示し、過剰だった入力欄の高さを抑え、全幅 Composer の既定グリッドサイズをより実用的にしました。

## ホスト連携契約を修正

`auth:requireAuth` が返す認証済みクレームを文書公開の実行者として使用し、保存時に空の実行者IDが送信されないようにしました。「法的情報」見出しでは Markdown ツールチップを内容と同時に描画し、文書操作を見出しのすぐ横に配置しました。重複した開閉矢印を削除し、明示的な非表示スタイルによってエディターの閉鎖と作成・プレビューペインの切り替えを確実にします。

## 固定文書ルートを登録

Cognis の外部モジュールルーターはパスを完全一致で照合するため、固定された法的文書ごとに正確な PUT ルートと公開 GET ルートを登録しました。破棄すると未公開エディターを閉じて操作を追加に戻し、エディターとモードペインはブラウザーでサイズ変更されることなく利用可能な幅全体を明示的に使用します。

## 公開済みエディターと同意更新を復旧

管理画面を更新すると、保存済み文書が保持された Markdown と削除操作を伴って開いた状態で表示されます。表示中の認証済みセッションは5秒ごとに同意を再確認し、重複するポップアップを防ぐため確認を直列化し、ページのアンロード時またはモジュールエンドポイントの消失時に更新タイマーを停止します。

## ホストの折りたたみセクションを採用

法的文書ディスクリプターをホストの折りたたみセクション Composer で描画し、サニタイズ済みのローカライズタイトル、行内の追加/削除と作成/プレビュー操作、エディター内容を提供します。モジュールはセクション切断時に失敗することなくホスト管理画面のフローティングスロットへ接続し、ローカライズされた移動警告を渡し、アンマウント時に変更追跡を破棄します。

## 保存済みエディター状態と作成レイアウトを修正

バージョンストアの実際のレスポンスフィールドから保存済み Markdown を読み取り、更新後のエディターに `undefined` が表示されないようにしました。追加/削除の状態は保存済みバージョンの有無だけで決まります。「法的情報」のツールチップを見出し内にまとめ、中立な作成/プレビュー操作を全幅でサイズ変更不可のエディター下部に同幅で配置しました。

## 文書ごとの同意強制を追加

公開済みの利用条件、プライバシー、EULA の各バージョンに対する承認を個別に追跡します。永続的な同意要求には新規または更新された文書だけがチェックボックスカードとして表示され、正確なバージョンの送信、ログアウト、アカウント設定の操作を提供します。エディター面は固定モード高さ、全幅でサイズ変更不可の入力欄、下部に余白を持つ中立コントロールを備えます。

## 必須同意と法的ナビゲーションを統合

単一の必須同意 Popup、コア形式のチェックボックス、行内の新規/更新版 Pill、拒否 Tooltip とホストのログアウト Flow、認証済みアカウントライフサイクル削除 Endpoint を使用します。公開文書 Route は実際に公開され、Markdown を全画面サイズの Popup で描画し、公開済み文書は `ui:footerLinks` を介して右寄せ Footer Link を提供します。

## コミット

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
- [b9c93cc](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b9c93cc2de5693f69cdf63bb0d1d9419ef5c7ceb)
- [1adbdf7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1adbdf77939aa53f70f2fef75b93bce9841bd746)
