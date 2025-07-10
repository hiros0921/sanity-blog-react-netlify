// Web Vitals監視
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric)
    // ここでGoogle Analyticsやその他の分析ツールに送信
  }
}

// パフォーマンス測定ユーティリティ
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()

  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string) {
    const startTime = this.marks.get(startMark)
    if (startTime) {
      const duration = performance.now() - startTime
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      return duration
    }
    return 0
  }

  // 画像の最適化されたURLを生成
  static getOptimizedImageUrl(url: string, width?: number, quality = 80): string {
    // Cloudinary, imgix, または他の画像CDNを使用する場合はここで変換
    if (width) {
      // 簡易的な実装例
      return `${url}?w=${width}&q=${quality}`
    }
    return url
  }
}

// リソースヒントの追加
export function addResourceHints() {
  const head = document.head

  // DNS プリフェッチ
  const dnsPrefetch = [
    'https://cdn.sanity.io',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]

  dnsPrefetch.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = url
    head.appendChild(link)
  })

  // プリコネクト
  const preconnect = [
    'https://cdn.sanity.io',
    'https://fonts.googleapis.com',
  ]

  preconnect.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = url
    link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })
}