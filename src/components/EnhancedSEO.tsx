import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'

interface EnhancedSEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  canonicalUrl?: string
  noindex?: boolean
}

export default function EnhancedSEO({
  title,
  description,
  keywords = ['web開発', 'プログラミング', 'React', 'TypeScript', 'JavaScript', 'HiroSuwa'],
  image = 'https://bejewelled-sprinkles-b0d0d7.netlify.app/og-image.jpg',
  type = 'website',
  author = 'HiroSuwa',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  canonicalUrl,
  noindex = false
}: EnhancedSEOProps) {
  const location = useLocation()
  const siteUrl = 'https://bejewelled-sprinkles-b0d0d7.netlify.app'
  const currentUrl = `${siteUrl}${location.pathname}`
  const finalCanonicalUrl = canonicalUrl || currentUrl

  // 構造化データ（Schema.org）
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
      name: author,
      url: `${siteUrl}/profile`
    },
    publisher: {
      '@type': 'Organization',
      name: 'HiroSuwa',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': finalCanonicalUrl
    },
    ...(section && { articleSection: section }),
    ...(tags.length > 0 && { keywords: tags.join(', ') })
  }

  // LLMO対策用の追加構造化データ
  const llmoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'HiroSuwa',
    url: siteUrl,
    sameAs: [
      'https://x.com/hiros0921',
      'https://www.youtube.com/@HiroSuwa',
      'https://note.com/ready_bison5376',
      'https://github.com/hiros0921'
    ],
    jobTitle: 'Web Developer & Content Creator',
    worksFor: {
      '@type': 'Organization',
      name: 'フリーランス'
    },
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Node.js'
    ]
  }

  return (
    <Helmet>
      {/* 基本的なメタタグ */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* ロボット制御 */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="HiroSuwa - Premium Content Platform" />
      <meta property="og:locale" content="ja_JP" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hiros0921" />
      <meta name="twitter:creator" content="@hiros0921" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* 構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* LLMO対策の構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify(llmoStructuredData)}
      </script>
      
      {/* 追加のLLMO対策 */}
      <meta name="subject" content="Web開発とプログラミング学習" />
      <meta name="topic" content="プログラミング, Web開発, React, TypeScript" />
      <meta name="summary" content={description} />
      <meta name="abstract" content={description} />
      <meta name="category" content="Technology, Programming, Web Development" />
      
      {/* モバイル最適化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* その他のSEO強化 */}
      <meta name="language" content="Japanese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
    </Helmet>
  )
}