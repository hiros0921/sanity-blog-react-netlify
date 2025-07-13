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
    userId: '', // 後で自動取得
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
    maxResults: 10,
    // Twitter APIを使用するには、開発者アカウントとBearer Tokenが必要
  }
}

// RSS フィードを取得する関数
export async function fetchNoteArticles() {
  // 一時的に無効化 - CORSエラーを回避
  return []
  
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
  // 一時的に無効化 - APIエラーを回避
  return []
  
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

// Twitter API v2でツイートを取得する関数
export async function fetchTwitterTweets() {
  try {
    // 常にNetlify Functionsを使用（ローカルでも動作）
    console.log('Using Netlify Functions for Twitter API');
    
    try {
      
      // ユーザー情報を取得
      const userResponse = await fetch(
        `/.netlify/functions/twitter?endpoint=users/by/username/${socialMediaConfig.twitter.username}`
      );
      
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user: ${userResponse.status}`);
      }
      
      const userData = await userResponse.json();
      const userId = userData.data?.id;
      
      if (!userId) {
        throw new Error('User not found');
      }
      
      // ツイートを取得
      const tweetsResponse = await fetch(
        `/.netlify/functions/twitter?endpoint=users/${userId}/tweets?max_results=${socialMediaConfig.twitter.maxResults}&tweet.fields=created_at,public_metrics,text`
      );
      
      if (!tweetsResponse.ok) {
        throw new Error(`Failed to fetch tweets: ${tweetsResponse.status}`);
      }
      
      const tweetsData = await tweetsResponse.json();
      
      if (tweetsData.data && tweetsData.data.length > 0) {
        return tweetsData.data.map((tweet: any) => ({
          id: tweet.id,
          text: tweet.text,
          createdAt: tweet.created_at,
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          url: `https://twitter.com/${socialMediaConfig.twitter.username}/status/${tweet.id}`
        }));
      }
    } catch (error) {
      console.error('Failed to fetch from Netlify Functions:', error);
      throw error;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch Twitter tweets:', error);
    return [];
  }
}

// 将来的な実装のためのプロキシURL例
// const PROXY_URL = 'https://your-backend-server.com/api/twitter'
// このようなバックエンドサーバーを構築することで、Twitter APIを使用できます

// 自動更新の設定（分単位）
export const updateIntervals = {
  note: 60,      // 1時間ごと
  youtube: 120,  // 2時間ごと
  twitter: 30    // 30分ごと
}