import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { urlForOptimized, generateSanitySrcSet, getSanityPlaceholder } from '../lib/sanity-image'

interface SanityOptimizedImageProps {
  source: any // Sanity画像ソース
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  aspectRatio?: string
  onLoad?: () => void
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy'
}

export default function SanityOptimizedImage({
  source,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  objectFit = 'cover',
  aspectRatio,
  onLoad,
  crop = 'center'
}: SanityOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
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
      { rootMargin: '100px' }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [priority])

  // 画像URLを最適化
  const optimizedSrc = urlForOptimized(source, {
    width,
    height,
    quality,
    format: 'auto',
    fit: 'crop',
    crop,
    dpr: window.devicePixelRatio || 1
  })

  // プレースホルダー画像
  const placeholderSrc = getSanityPlaceholder(source)

  // srcSetとsizesを生成
  const { srcSet, sizes } = generateSanitySrcSet(source, {
    quality,
    format: 'auto',
    crop
  })

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // アスペクト比に基づくスタイル
  const containerStyle: React.CSSProperties = {
    ...(aspectRatio && {
      position: 'relative' as const,
      paddingBottom: `${(1 / eval(aspectRatio)) * 100}%`,
      height: 0,
      overflow: 'hidden'
    })
  }

  const imageStyle: React.CSSProperties = {
    objectFit,
    ...(aspectRatio && {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    })
  }

  if (!source) {
    return (
      <div className={`bg-gray-200 ${className}`} style={containerStyle}>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">No image</span>
        </div>
      </div>
    )
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
            className="w-full h-full object-cover"
            style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          />
          <div className="absolute inset-0 bg-gray-200/30 animate-pulse" />
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
          className={`${aspectRatio ? '' : 'w-full h-full'} ${className}`}
          style={imageStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  )
}

// Pictureタグを使用した高度な画像コンポーネント
interface SanityPictureProps extends SanityOptimizedImageProps {
  mobileOptions?: { width?: number; height?: number; crop?: any }
  tabletOptions?: { width?: number; height?: number; crop?: any }
  desktopOptions?: { width?: number; height?: number; crop?: any }
}

export function SanityPicture({
  source,
  alt,
  className = '',
  priority = false,
  quality = 85,
  mobileOptions,
  tabletOptions,
  desktopOptions,
  ...props
}: SanityPictureProps) {
  const sources = []

  if (mobileOptions) {
    sources.push({
      media: '(max-width: 640px)',
      srcSet: urlForOptimized(source, {
        ...mobileOptions,
        quality,
        format: 'webp'
      })
    })
  }

  if (tabletOptions) {
    sources.push({
      media: '(max-width: 1024px)',
      srcSet: urlForOptimized(source, {
        ...tabletOptions,
        quality,
        format: 'webp'
      })
    })
  }

  if (desktopOptions) {
    sources.push({
      media: '(min-width: 1025px)',
      srcSet: urlForOptimized(source, {
        ...desktopOptions,
        quality,
        format: 'webp'
      })
    })
  }

  return (
    <picture className={className}>
      {sources.map((source, index) => (
        <source
          key={index}
          media={source.media}
          srcSet={source.srcSet}
          type="image/webp"
        />
      ))}
      <SanityOptimizedImage
        source={source}
        alt={alt}
        priority={priority}
        quality={quality}
        {...props}
      />
    </picture>
  )
}