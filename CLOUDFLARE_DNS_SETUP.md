# CloudflareでのDNS設定手順

## 現在の問題
- hirosuwa.com がCloudflareのネームサーバーを使用している
- NetlifyでもDNSゾーンが作成されているため、競合している
- steady-chebakia-9c5055.netlify.app では正常に動作している

## 解決方法

### ステップ1: NetlifyでDNSゾーンを削除
1. Netlifyの管理画面にログイン
2. Domains → hirosuwa.com を選択
3. 「Delete DNS zone」をクリック（スクリーンショットの通り）
4. 確認して削除

### ステップ2: Cloudflareでネームサーバーを変更

以下の2つのオプションから選択：

#### オプション1: APOを有効化（推奨）
APO（Automatic Platform Optimization）を使用すると、CloudflareのCDNを活用しながらNetlifyにトラフィックを転送できます。

1. Cloudflareのダッシュボードにログイン
2. hirosuwa.com のDNSページに移動
3. 既存のレコードを全て削除
4. 以下のレコードを追加：

```
タイプ: CNAME
名前: @（またはhirosuwa.com）
コンテンツ: steady-chebakia-9c5055.netlify.app
プロキシ状態: オレンジ色の雲（プロキシ有効）
```

```
タイプ: CNAME
名前: www
コンテンツ: steady-chebakia-9c5055.netlify.app
プロキシ状態: オレンジ色の雲（プロキシ有効）
```

#### オプション2: 直接接続（シンプル）
Cloudflareのプロキシを通さずに直接Netlifyに接続します。

1. Cloudflareのダッシュボードにログイン
2. hirosuwa.com のDNSページに移動
3. 既存のレコードを全て削除
4. 以下のレコードを追加：

```
タイプ: CNAME
名前: @（またはhirosuwa.com）
コンテンツ: steady-chebakia-9c5055.netlify.app
プロキシ状態: グレーの雲（DNSのみ）
```

```
タイプ: CNAME
名前: www
コンテンツ: steady-chebakia-9c5055.netlify.app
プロキシ状態: グレーの雲（DNSのみ）
```

### ステップ3: 完了を待つ
- DNS反映に1-24時間かかる場合があります
- NetlifyでSSL証明書が自動的に発行されます

### ステップ4: 確認
1. https://hirosuwa.com にアクセス
2. ブログ記事が表示されることを確認
3. https://hirosuwa.com/post/third-blog にアクセスして個別記事も確認

## 注意事項
- 現在お名前.comでネームサーバーを変更しているようですが、CloudflareのDNS設定画面で直接行うのが正しい方法です
- Netlifyで自動的にSSL証明書が発行されるまで、一時的にHTTPSエラーが出る可能性があります