import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

interface SanityImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy'
  blur?: number
  sharpen?: number
  invert?: boolean
  rect?: { left: number; top: number; width: number; height: number }
  dpr?: number
}

// Sanity画像の最適化URL生成
export function urlForOptimized(source: any, options: SanityImageOptions = {}) {
  if (!source) {
    return 'https://via.placeholder.com/800x600'
  }

  let imageBuilder = builder.image(source)

  // 基本的な変換
  if (options.width) imageBuilder = imageBuilder.width(options.width)
  if (options.height) imageBuilder = imageBuilder.height(options.height)
  if (options.quality) imageBuilder = imageBuilder.quality(options.quality)
  if (options.format && options.format !== 'auto') {
    imageBuilder = imageBuilder.format(options.format as 'webp' | 'jpg' | 'png')
  }
  if (options.fit) imageBuilder = imageBuilder.fit(options.fit)
  if (options.crop) imageBuilder = imageBuilder.crop(options.crop)
  if (options.dpr) imageBuilder = imageBuilder.dpr(options.dpr)

  // エフェクト
  if (options.blur) imageBuilder = imageBuilder.blur(options.blur)
  if (options.sharpen) imageBuilder = imageBuilder.sharpen(options.sharpen)
  if (options.invert) imageBuilder = imageBuilder.invert(true)

  // 矩形クロップ
  if (options.rect) {
    imageBuilder = imageBuilder.rect(
      options.rect.left,
      options.rect.top,
      options.rect.width,
      options.rect.height
    )
  }

  // 自動フォーマット選択
  if (options.format === 'auto') {
    imageBuilder = imageBuilder.auto('format')
  }

  return imageBuilder.url()
}

// レスポンシブ画像のソースセット生成
export function generateSanitySrcSet(source: any, options: SanityImageOptions = {}) {
  const widths = [320, 640, 768, 1024, 1280, 1536, 1920, 2560]
  const maxWidth = options.width || 2560

  const srcSetEntries = widths
    .filter(w => w <= maxWidth)
    .map(width => {
      const url = urlForOptimized(source, { ...options, width })
      return `${url} ${width}w`
    })

  const sizes = '(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1280px'

  return {
    srcSet: srcSetEntries.join(', '),
    sizes
  }
}

// プレースホルダー画像の生成（ブラー効果付き）
export function getSanityPlaceholder(source: any): string {
  return urlForOptimized(source, {
    width: 20,
    quality: 20,
    blur: 50,
    format: 'webp'
  })
}

// アートディレクション用のピクチャーソース生成
export function generateSanityPictureSources(source: any, options: {
  mobile?: SanityImageOptions
  tablet?: SanityImageOptions
  desktop?: SanityImageOptions
} = {}) {
  const sources: Array<{
    media: string
    srcSet: string
    type?: string
  }> = []

  // モバイル向け
  if (options.mobile) {
    sources.push({
      media: '(max-width: 640px)',
      srcSet: urlForOptimized(source, { ...options.mobile, format: 'webp' }),
      type: 'image/webp'
    })
  }

  // タブレット向け
  if (options.tablet) {
    sources.push({
      media: '(max-width: 1024px)',
      srcSet: urlForOptimized(source, { ...options.tablet, format: 'webp' }),
      type: 'image/webp'
    })
  }

  // デスクトップ向け
  if (options.desktop) {
    sources.push({
      media: '(min-width: 1025px)',
      srcSet: urlForOptimized(source, { ...options.desktop, format: 'webp' }),
      type: 'image/webp'
    })
  }

  return sources
}

// 画像の最適なサイズを計算
export function calculateOptimalSize(containerWidth: number, dpr: number = 1): number {
  // デバイスピクセル比を考慮
  const actualWidth = containerWidth * dpr
  
  // 最も近い標準的な幅を選択
  const standardWidths = [320, 640, 768, 1024, 1280, 1536, 1920, 2560]
  return standardWidths.find(w => w >= actualWidth) || standardWidths[standardWidths.length - 1]
}