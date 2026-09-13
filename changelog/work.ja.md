# PNG ストア画像の統合を修正

**機能ブランチ:** work

## 新しいアイコンとバナーを正しく公開

`assets/icon.png` と `assets/banner.png` をモジュールのストアアイコンとバナーとして使用し、削除済みスクリーンショットへの古い参照を取り除きます。

## アセットメタデータを保護

Manifest で宣言されたすべてのアセットがリポジトリ相対の通常ファイルであることを検証し、存在しない、または安全でない画像パスをパッケージ検査で検出します。

## コミット

- [df8b775](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/df8b77597cfefdd3dcfa94e0366f6808b8b0ec6b)
