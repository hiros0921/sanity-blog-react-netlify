# Localhost接続問題の解決方法

現在、localhostへの接続がブロックされています。以下の方法で解決できます：

## 1. システム設定の確認

### プライバシーとセキュリティ

- システム設定 → プライバシーとセキュリティ → 詳細...
- 「ローカルネットワーク」でターミナルとブラウザが許可されているか確認

### ネットワーク設定
- システム設定 → ネットワーク
- 使用中のネットワークの「詳細...」をクリック
- プロキシ設定を確認（すべてオフになっているか）

## 2. ブラウザの設定

### Chrome
- chrome://settings/security
- 「安全でないコンテンツ」でlocalhostを許可

### Firefox
- about:preferences#privacy
- 「強化型トラッキング防止機能」の例外にlocalhost追加

### Safari
- 環境設定 → プライバシー
- 「Webサイトによるトラッキング」を確認

## 3. 代替方法

### A. Vercelへデプロイ
```bash
vercel
```

### B. Netlifyへデプロイ
1. https://app.netlify.com にアクセス
2. distフォルダをドラッグ&ドロップ

### C. GitHub Pagesへデプロイ
```bash
npm run build
git add dist
git commit -m "Deploy"
git push
```

## 4. トラブルシューティングコマンド

```bash
# DNSキャッシュをクリア
sudo dscacheutil -flushcache

# mDNSResponderを再起動
sudo killall -HUP mDNSResponder

# ネットワーク設定をリセット
sudo ifconfig lo0 down
sudo ifconfig lo0 up
```

## 5. 最終手段

コンピューターを再起動してください。多くの場合、これで問題が解決します。