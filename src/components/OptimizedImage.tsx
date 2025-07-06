import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { getOptimizedExternalUrl } from '../lib/cloudinary'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number | 'auto'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  aspectRatio?: string
  onLoad?: () => void
  style?: CSSProperties
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 'auto',
  objectFit = 'cover',
  aspectRatio,
  onLoad,
  style
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observerで遅延読み込み
  useEffect(() => {
    if (priority || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [priority])

  // 画像URLを最適化
  const optimizedSrc = src.startsWith('http') 
    ? getOptimizedExternalUrl(src, { width, height, quality })
    : src

  // プレースホルダー画像
  const placeholderSrc = src.startsWith('http')
    ? getOptimizedExternalUrl(src, { width: 20, quality: 10 })
    : src

  // srcSetとsizesを生成
  const { srcSet, sizes } = src.startsWith('http') && width
    ? {
        srcSet: [320, 640, 768, 1024, 1280, 1920]
          .filter(w => !width || w <= width * 2)
          .map(w => `${getOptimizedExternalUrl(src, { width: w, quality })} ${w}w`)
          .join(', '),
        sizes: '(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1280px'
      }
    : { srcSet: undefined, sizes: undefined }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    // フォールバック画像を使用
    if (imgRef.current) {
      imgRef.current.src = src // 元の画像にフォールバック
    }
  }

  // アスペクト比に基づくスタイル
  const containerStyle: CSSProperties = {
    ...style,
    ...(aspectRatio && {
      position: 'relative',
      paddingBottom: `${(1 / parseFloat(aspectRatio)) * 100}%`,
      height: 0,
      overflow: 'hidden'
    })
  }

  const imageStyle: CSSProperties = {
    objectFit,
    ...(aspectRatio && {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    })
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* プレースホルダー */}
      {!isLoaded && (
        <div className="absolute inset-0">
          <img
            src={placeholderSrc}
            alt=""
            className="w-full h-full object-cover filter blur-xl"
            style={{ filter: 'blur(20px)' }}
          />
          <div className="absolute inset-0 bg-gray-200/50 animate-pulse" />
        </div>
      )}

      {/* メイン画像 */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`${aspectRatio ? '' : 'w-full h-full'} ${className}`}
          style={imageStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* エラー時のフォールバック */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">画像を読み込めませんでした</span>
        </div>
      )}
    </div>
  )
}

// Pictureタグを使用した高度な画像コンポーネント
interface OptimizedPictureProps extends OptimizedImageProps {
  sources?: Array<{
    media: string
    srcSet: string
    type?: string
  }>
}

export function OptimizedPicture({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 'auto',
  sources = [],
  ...props
}: OptimizedPictureProps) {

  // デフォルトのソースを生成（AVIF、WebP、フォールバック）
  const defaultSources = src.startsWith('http') ? [
    {
      type: 'image/avif',
      srcSet: getOptimizedExternalUrl(src, { width, height, quality, format: 'avif' })
    },
    {
      type: 'image/webp',
      srcSet: getOptimizedExternalUrl(src, { width, height, quality, format: 'webp' })
    }
  ] : []

  const allSources = [...sources, ...defaultSources]

  return (
    <picture className={className}>
      {allSources.map((source, index) => (
        <source
          key={index}
          media={'media' in source ? source.media : undefined}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        onLoad={() => {}}
        {...props}
      />
    </picture>
  )
}