import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export default function SEO({ 
  title, 
  description = 'A blog powered by Sanity CMS', 
  image,
  url,
  type = 'website'
}: SEOProps) {
  const siteTitle = 'My Blog'
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="sHrnW0KAn2Chc-sW13Tx8pMClAbMKAN2e3_qldg6wog" />
    </Helmet>
  )
}