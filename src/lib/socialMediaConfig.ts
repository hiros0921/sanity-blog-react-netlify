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
    channelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'YOUR_CHANNEL_ID',
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
    maxResults: 10,
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
    console.log('Fetching note articles from:', socialMediaConfig.note.rssFeedUrl)
    
    // AllOriginsを使用してCORSを回避
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(socialMediaConfig.note.rssFeedUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.contents) {
      // XMLをパース
      const parser = new DOMParser()
      const xml = parser.parseFromString(data.contents, 'text/xml')
      const items = xml.querySelectorAll('item')
      
      const articles = Array.from(items).slice(0, 10).map((item) => {
        const title = item.querySelector('title')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        
        return {
          id: link,
          title: title,
          url: link,
          publishedAt: pubDate,
          excerpt: description
            .replace(/<[^>]*>/g, '') // HTMLタグを除去
            .replace(/&nbsp;/g, ' ') // &nbsp;をスペースに変換
            .trim()
            .substring(0, 150) + '...'
        }
      })
      
      // 日付で降順ソート（最新が最初）
      articles.sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
      
      console.log('Fetched articles:', articles.length, 'Latest:', articles[0]?.title)
      
      return articles
    } else {
      console.warn('No RSS content received')
      return []
    }
  } catch (error) {
    console.error('Failed to fetch note articles:', error)
    // エラーの場合も空配列を返す（モックデータは表示される）
    return []
  }
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