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

## 同意の表示と保存を安定化

認証済み Navbar 統合とともに同意用 Stylesheet を読み込み、更新時と SPA ナビゲーション時の表示を一致させます。コアの Pill をコンパクトに保ち、文書リンクを改行し、公開済みの完全なバージョンセットを保存して、同意を閉じる前に保存済み状態を検証します。

## 公開法務文書ページを統一

公開法務ルートから重複する Popup を削除し、各文書をホストの Page Composer で描画します。完全な Shell を備えたページは自然な文書スクロールを使用し、描画された Markdown セクション見出しからサイドナビゲーションを構築します。

## 同意コントロールと保存を修正

Cognis の再利用可能な Choice Checkbox と State Pill のスタイルを使用し、文書リンクを必ず別行に配置し、同意を開く前にこれらのスタイルの読み込みを待機します。同意は構造化データベースの INSERT 競合更新契約を使用して保存結果を検証するため、承認済みバージョンがナビゲーション中に再要求されません。

## 同意レポートと完全なページ Shell

各法務文書に、すべて、承認済み、未承認のフィルターを備えた検索可能な10行単位のユーザー同意表を追加します。公開ページは読み込みと認証セッションについて Jitsi のページ初期化順序に従い、固定 Editor 面によりサイズ変更とレイアウトの跳ねを防ぎます。

## ホストのページングと独立した同意を採用

モジュール独自のレポートページングを共有 `ui:pagination` 機能に置き換えます。1つの公開済み文書を承認するとき、未公開のプライバシーまたは EULA 文書に Null を書き込まないため、同意確認の独立性と既存の非 Null データベース列との互換性が保たれます。

## Footer Link の所有を冪等化

公開ページから Footer 登録を削除し、同意強制だけが法務 Link を所有するようにします。追加前に Host Registry も確認し、ページ読み込み時や古い Script からの切り替え時に ID が重複することを防ぎます。

## コミット

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
- [b9c93cc](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b9c93cc2de5693f69cdf63bb0d1d9419ef5c7ceb)
- [1adbdf7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1adbdf77939aa53f70f2fef75b93bce9841bd746)
- [0c9207e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0c9207e9a3c872266558207cc5a8d61f4c63ca12)

- [f193e16](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f193e1610daf5abc76d07510115605d396edf5f2)

- [f500db9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f500db9c46919a4e9bf2911751340eb515b3213e)

- [2c96447](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2c9644756b1f693cd711695eb9cf1083fe5c36d9)

- [1c0203a](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1c0203adde325888d4c31a628453f941b9a1ddab)

- [97517b6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/97517b67ae09218a9179879151547a582008e83c)

- [bd907c3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bd907c37acc039a80e9128712d3ae89ec0f92fb4)

- [c8b8fa2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c8b8fa29f2a92ebf584669be39eb3c1ee76af0da)

- [0f3c337](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0f3c3375d1376ec0deb5309f401be3070b1fe556)

- [aca7aed](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/aca7aedb050d29fcafc1e1204d6cd0ec4649dda0)

- [51b169b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/51b169b61a9aba1c49b50d66a8444c16964b5348)

- [232a8c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/232a8c08a256f5f5cef3dca2200b3436cde4a6ea)

- [21e6522](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/21e652276d8b297ad9ddb617a78acad9f8157bc8)

- [4fd26a8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4fd26a801ce84802d77fd20e7ebdcffe13666e3d)

- [b65f77e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b65f77e1261e7785a2d04b60ae43d4a87c886529)
