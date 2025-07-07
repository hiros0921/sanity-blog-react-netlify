import { useEffect } from 'react'

interface TwitterEmbedProps {
  username: string
  limit?: number
  theme?: 'light' | 'dark'
  height?: number
}

export default function TwitterEmbed({ 
  username = 'hiros0921', 
  limit = 5,
  theme = 'dark',
  height = 600 
}: TwitterEmbedProps) {
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

    return () => {
      // クリーンアップ
      const twitterScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
      if (twitterScript) {
        document.body.removeChild(twitterScript)
      }
    }
  }, [])

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