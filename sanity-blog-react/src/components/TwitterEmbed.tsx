import { useEffect, useState } from 'react'
import { Twitter, ExternalLink, AlertCircle } from 'lucide-react'

interface TwitterEmbedProps {
  username: string
  limit?: number
  theme?: 'light' | 'dark'
  height?: number
}

export default function TwitterEmbed({ 
  username = 'hiros0921', 
  theme = 'dark',
  height = 600 
}: TwitterEmbedProps) {
  // 埋め込みが失敗した場合のフォールバック
  const [embedFailed, setEmbedFailed] = useState(false)
  useEffect(() => {
    // Twitter埋め込みスクリプトを読み込む
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'
    document.body.appendChild(script)

    // スクリプトロード後にウィジェットを再初期化
    script.onload = () => {
      if ((window as any).twttr) {
        (window as any).twttr.widgets.load()
      }
    }
    
    // エラーハンドリング
    script.onerror = () => {
      setEmbedFailed(true)
    }
    
    // タイムアウト設定（5秒後に埋め込み失敗と判定）
    const timeout = setTimeout(() => {
      if (!document.querySelector('.twitter-timeline-rendered')) {
        setEmbedFailed(true)
      }
    }, 5000)

    return () => {
      // クリーンアップ
      clearTimeout(timeout)
      const twitterScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
      if (twitterScript) {
        document.body.removeChild(twitterScript)
      }
    }
  }, [])

  if (embedFailed) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h4 className="text-lg font-semibold text-white">X (Twitter) フィード</h4>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          セキュリティ上の制限により、ブラウザから直接Twitter APIにアクセスできません。
        </p>
        <div className="space-y-3">
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors group"
          >
            <Twitter className="w-8 h-8 text-blue-400" />
            <div className="flex-1">
              <p className="text-white font-medium">@{username}</p>
              <p className="text-gray-400 text-sm">最新のツイートを見る</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://twitter.com/intent/follow?screen_name=hiros0921"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Twitter className="w-4 h-4" />
              フォローする
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=@hiros0921"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Twitter className="w-4 h-4" />
              ツイートする
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="twitter-embed-container">
      {/* シンプルな埋め込みタイムライン */}
      <a 
        className="twitter-timeline"
        data-lang="ja"
        data-theme={theme}
        data-height={height}
        href={`https://twitter.com/${username}`}
      >
        @{username}のツイート
      </a>
    </div>
  )
}