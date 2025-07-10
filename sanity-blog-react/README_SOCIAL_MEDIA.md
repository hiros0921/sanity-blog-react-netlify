# ソーシャルメディア連携ガイド

このサイトは、note、YouTube、X (Twitter) と自動連携できるように設計されています。

## 機能

- **note記事の自動取得**: RSSフィードを使用して最新記事を表示
- **YouTube動画の自動取得**: YouTube Data APIを使用して最新動画を表示
- **X (Twitter) フィードの表示**: Twitter APIを使用して最新ツイートを表示

## セットアップ

### 1. noteの連携

noteはRSSフィードを提供しているため、特別な設定は不要です。
デフォルトで `https://note.com/ready_bison5376/rss` からフィードを取得します。

### 2. YouTubeの連携

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. YouTube Data API v3を有効化
4. APIキーを作成
5. `.env` ファイルに追加:
   ```
   VITE_YOUTUBE_API_KEY=your_api_key_here
   ```

### 3. X (Twitter) の連携（オプション）

1. [Twitter Developer Portal](https://developer.twitter.com/)にアクセス
2. アプリを作成
3. Bearer Tokenを取得
4. `.env` ファイルに追加:
   ```
   VITE_TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

## 自動更新

各プラットフォームのコンテンツは以下の間隔で自動更新されます：

- note: 1時間ごと
- YouTube: 2時間ごと
- Twitter: 30分ごと

## カスタマイズ

`src/lib/socialMediaConfig.ts` ファイルで更新間隔やその他の設定を変更できます。

## 注意事項

- APIキーは必ず環境変数で管理してください
- 本番環境では、CORSの問題を避けるためにバックエンドサーバーの実装を推奨します
- API使用量の制限に注意してください