// Cloudinary設定と画像最適化ユーティリティ
interface CloudinaryConfig {
  cloudName: string
  apiKey?: string
  apiSecret?: string
}

// Cloudinary設定（publicアクセスのみ必要）
const config: CloudinaryConfig = {
  cloudName: 'hirosuwa', // 実際のCloudinary cloud nameに置き換えてください
}

interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'crop'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  aspectRatio?: string
  dpr?: number | 'auto'
  flags?: string[]
  effects?: string[]
}

// Cloudinary URL生成
export function getCloudinaryUrl(publicId: string, options: ImageTransformOptions = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    aspectRatio,
    dpr = 'auto',
    flags = ['progressive'],
    effects = []
  } = options

  const transformations: string[] = []

  // 基本的な変換
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (aspectRatio) transformations.push(`ar_${aspectRatio}`)
  transformations.push(`c_${crop}`)
  transformations.push(`g_${gravity}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  transformations.push(`dpr_${dpr}`)

  // フラグ
  if (flags.length > 0) {
    transformations.push(`fl_${flags.join('.')}`)
  }

  // エフェクト
  effects.forEach(effect => {
    transformations.push(effect)
  })

  const transformation = transformations.join(',')
  
  return `https://res.cloudinary.com/${config.cloudName}/image/upload/${transformation}/${publicId}`
}

// 外部URLからCloudinary経由で最適化
export function getOptimizedExternalUrl(url: string, options: ImageTransformOptions = {}): string {
  const encodedUrl = encodeURIComponent(url)
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    dpr = 'auto',
    flags = ['progressive']
  } = options

  const transformations: string[] = []
  
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`c_${crop}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  transformations.push(`dpr_${dpr}`)
  
  if (flags.length > 0) {
    transformations.push(`fl_${flags.join('.')}`)
  }

  const transformation = transformations.join(',')
  
  return `https://res.cloudinary.com/${config.cloudName}/image/fetch/${transformation}/${encodedUrl}`
}

// レスポンシブ画像のソースセット生成
export function generateSrcSet(publicId: string, options: ImageTransformOptions = {}): {
  srcSet: string
  sizes: string
} {
  const baseOptions = { ...options, format: 'auto' as const }
  const widths = [320, 640, 768, 1024, 1280, 1536, 1920]
  
  const srcSetEntries = widths.map(width => {
    const url = getCloudinaryUrl(publicId, { ...baseOptions, width })
    return `${url} ${width}w`
  })

  const sizes = '(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1280px'

  return {
    srcSet: srcSetEntries.join(', '),
    sizes
  }
}

// 画像の遅延読み込み用のプレースホルダー生成
export function getPlaceholderUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 10,
    quality: 10,
    effects: ['blur:1000']
  })
}

// アートディレクション用のピクチャーソース生成
export interface PictureSource {
  media: string
  srcSet: string
  type?: string
}

export function generatePictureSources(publicId: string, options: {
  mobile?: ImageTransformOptions
  tablet?: ImageTransformOptions
  desktop?: ImageTransformOptions
} = {}): PictureSource[] {
  const sources: PictureSource[] = []

  // AVIF形式（最も効率的）
  if (options.mobile) {
    sources.push({
      media: '(max-width: 640px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.mobile, format: 'avif' }),
      type: 'image/avif'
    })
  }

  if (options.tablet) {
    sources.push({
      media: '(max-width: 1024px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.tablet, format: 'avif' }),
      type: 'image/avif'
    })
  }

  if (options.desktop) {
    sources.push({
      media: '(min-width: 1025px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.desktop, format: 'avif' }),
      type: 'image/avif'
    })
  }

  // WebP形式（幅広いサポート）
  if (options.mobile) {
    sources.push({
      media: '(max-width: 640px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.mobile, format: 'webp' }),
      type: 'image/webp'
    })
  }

  if (options.tablet) {
    sources.push({
      media: '(max-width: 1024px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.tablet, format: 'webp' }),
      type: 'image/webp'
    })
  }

  if (options.desktop) {
    sources.push({
      media: '(min-width: 1025px)',
      srcSet: getCloudinaryUrl(publicId, { ...options.desktop, format: 'webp' }),
      type: 'image/webp'
    })
  }

  return sources
}