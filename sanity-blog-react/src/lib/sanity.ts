import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'ynritlpd',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: false, // CDNを無効化してCORSエラーを回避
  apiVersion: '2024-01-01',
  token: undefined, // 公開データのみアクセス
})

console.log('Sanity config:', {
  projectId: client.config().projectId,
  dataset: client.config().dataset,
})

export const urlFor = (source: any) => {
  // モックデータのURL処理
  if (source?.asset?.url) {
    return source.asset.url
  }
  
  // Sanity画像の処理
  if (!source?.asset?._ref) {
    return 'https://via.placeholder.com/800x600' // デフォルト画像
  }
  
  return `https://cdn.sanity.io/images/${client.config().projectId}/${client.config().dataset}/${source.asset._ref
    .replace('image-', '')
    .replace('-jpg', '.jpg')
    .replace('-png', '.png')
    .replace('-webp', '.webp')}`
}