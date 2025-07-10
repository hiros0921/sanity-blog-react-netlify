# Sanityブログサイト セットアップガイド

## 🚀 クイックスタート（テストデータで確認）

現在、Sanityの公開テストプロジェクトを使用するように設定されています。すぐに動作確認ができます。

```bash
# 1. 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## 📝 独自のSanityプロジェクトを作成する場合

### ステップ1: Sanityアカウントの作成
1. https://www.sanity.io にアクセス
2. 「Get started」をクリックしてアカウントを作成

### ステップ2: Sanity Studioプロジェクトの作成

```bash
# 新しいディレクトリでSanity Studioを作成
mkdir sanity-blog-studio
cd sanity-blog-studio

# Sanity CLIをインストール
npm install -g @sanity/cli

# Sanityプロジェクトを初期化
sanity init
```

初期化時の選択肢：
- **Create new project** を選択
- プロジェクト名を入力（例：my-blog）
- デフォルトのデータセット名は **production** のまま
- テンプレートは **Blog (schema)** を選択

### ステップ3: スキーマの確認と調整

`sanity-blog-studio/schemas` ディレクトリに以下のスキーマが作成されます：
- `post.js` - ブログ記事
- `author.js` - 著者情報  
- `category.js` - カテゴリ

### ステップ4: Sanity Studioの起動

```bash
# Sanity Studioを起動
sanity start
```

http://localhost:3333 でSanity Studioが開きます。

### ステップ5: テストデータの作成

Sanity Studioで：
1. **Author** を作成
   - Name: 任意の名前
   - Imageをアップロード（任意）
   - Bio: 自己紹介文

2. **Category** を作成
   - Title: Tech, Design, Lifeなど
   - Slug: tech, design, lifeなど

3. **Post** を作成
   - Title: 記事タイトル
   - Slug: URLスラッグ（例：first-post）
   - Author: 作成した著者を選択
   - Main image: アイキャッチ画像をアップロード
   - Categories: カテゴリを選択
   - Published at: 公開日時
   - Body: 本文を入力
   - Excerpt: 抜粋（任意）

### ステップ6: プロジェクトIDとデータセットの確認

```bash
# sanity-blog-studioディレクトリで実行
sanity manage
```

ブラウザでプロジェクト管理画面が開きます。
- Project IDをコピー

### ステップ7: Reactアプリの設定

`.env`ファイルを更新：
```
VITE_SANITY_PROJECT_ID=あなたのプロジェクトID
VITE_SANITY_DATASET=production
```

### ステップ8: CORSの設定

Sanity管理画面で：
1. Settings → API → CORS originsへ移動
2. 「Add CORS origin」をクリック
3. 以下を追加：
   - http://localhost:5173
   - http://localhost:3000
   - 本番環境のURL（デプロイ時）

## 🔧 トラブルシューティング

### データが表示されない場合
1. `.env`ファイルのプロジェクトIDが正しいか確認
2. Sanity Studioでデータが公開されているか確認
3. CORSの設定を確認
4. ブラウザのコンソールでエラーを確認

### 画像が表示されない場合
- Sanity Studioで画像がアップロードされているか確認
- 画像URLの生成が正しいか確認

## 📚 参考リンク
- [Sanity公式ドキュメント](https://www.sanity.io/docs)
- [Sanity Studio](https://www.sanity.io/studio)
- [GROQ クエリ言語](https://www.sanity.io/docs/groq)