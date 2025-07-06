// ソーシャルメディアAPI設定
// 注意: 実際のAPIキーは環境変数で管理してください

export const socialMediaConfig = {
  // note RSS フィード
  note: {
    rssFeedUrl: 'https://note.com/ready_bison5376/rss',
    profileUrl: 'https://note.com/ready_bison5376',
    // noteはRSSフィードを提供しているので、fetch APIで取得可能
  },
  
  // YouTube Data API v3
  youtube: {
    channelId: 'YOUR_CHANNEL_ID', // チャンネルIDを取得する必要があります
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
    maxResults: 5,
    // YouTube Data APIを使用するには、Google Cloud ConsoleでAPIキーを取得
  },
  
  // X (Twitter) API v2
  twitter: {
    username: 'hiros0921',
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
    maxResults: 5,
    // Twitter APIを使用するには、開発者アカウントとBearer Tokenが必要
  }
}

// RSS フィードを取得する関数
export async function fetchNoteArticles() {
  try {
    // CORSの問題を回避するため、サーバーサイドでの実装が推奨されます
    // または、RSS-to-JSON APIサービスを使用
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(socialMediaConfig.note.rssFeedUrl)}`
    )
    const data = await response.json()
    
    if (data.status === 'ok') {
      return data.items.slice(0, 5).map((item: any) => ({
        id: item.guid,
        title: item.title,
        url: item.link,
        publishedAt: item.pubDate,
        excerpt: item.description.substring(0, 100) + '...'
      }))
    }
  } catch (error) {
    console.error('Failed to fetch note articles:', error)
  }
  return []
}

// YouTube動画を取得する関数
export async function fetchYouTubeVideos() {
  if (!socialMediaConfig.youtube.apiKey) {
    console.warn('YouTube API key not configured')
    return []
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${socialMediaConfig.youtube.channelId}&maxResults=${socialMediaConfig.youtube.maxResults}&order=date&type=video&key=${socialMediaConfig.youtube.apiKey}`
    )
    const data = await response.json()
    
    if (data.items) {
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt
      }))
    }
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error)
  }
  return []
}

// 自動更新の設定（分単位）
export const updateIntervals = {
  note: 60,      // 1時間ごと
  youtube: 120,  // 2時間ごと
  twitter: 30    // 30分ごと
}