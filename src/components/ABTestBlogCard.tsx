import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Clock, ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useABTest } from '../lib/abTesting'
import OptimizedImage from './OptimizedImage'

interface BlogPost {
  _id: string
  title: string
  slug: string
  summary: string
  publishedAt: string
  mainImage?: {
    url: string
    alt?: string
  }
  categories?: Array<{ title: string }>
  estimatedReadingTime?: number
}

interface LayoutVariant {
  layout: 'grid' | 'list'
  showImage: boolean
  showSummary: boolean
  showReadTime: boolean
  showCategories: boolean
  ctaStyle: 'text' | 'button' | 'arrow'
  hoverEffect: 'scale' | 'shadow' | 'border'
}

interface ABTestBlogCardProps {
  post: BlogPost
  index: number
}

export default function ABTestBlogCard({ post, index }: ABTestBlogCardProps) {
  const { value: layoutVariant, recordConversion } = useABTest<LayoutVariant>({
    id: 'blog_card_layout',
    name: 'ブログカードレイアウト',
    description: 'カードのレイアウトとコンテンツ表示を最適化',
    variants: {
      A: {
        layout: 'grid',
        showImage: true,
        showSummary: true,
        showReadTime: true,
        showCategories: true,
        ctaStyle: 'text',
        hoverEffect: 'scale'
      },
      B: {
        layout: 'list',
        showImage: true,
        showSummary: false,
        showReadTime: true,
        showCategories: false,
        ctaStyle: 'arrow',
        hoverEffect: 'shadow'
      }
    },
    goal: 'click'
  })

  const handleClick = () => {
    recordConversion()
  }

  const hoverEffects = {
    scale: { scale: 1.02 },
    shadow: { boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    border: { borderColor: 'rgb(59, 130, 246)' }
  }

  if (layoutVariant.layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={hoverEffects[layoutVariant.hoverEffect]}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <Link
          to={`/post/${post.slug}`}
          onClick={handleClick}
          className="flex gap-6 p-6"
        >
          {layoutVariant.showImage && post.mainImage && (
            <div className="flex-shrink-0 w-32 h-32">
              <OptimizedImage
                src={post.mainImage.url}
                alt={post.mainImage.alt || post.title}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            {layoutVariant.showSummary && (
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {post.summary}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
              <time className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: ja })}
              </time>
              
              {layoutVariant.showReadTime && post.estimatedReadingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.estimatedReadingTime}分
                </span>
              )}
              
              {layoutVariant.ctaStyle === 'arrow' && (
                <ArrowRight className="w-5 h-5 ml-auto text-blue-500" />
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Grid layout (variant A)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={hoverEffects[layoutVariant.hoverEffect]}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link
        to={`/post/${post.slug}`}
        onClick={handleClick}
        className="block"
      >
        {layoutVariant.showImage && post.mainImage && (
          <div className="aspect-w-16 aspect-h-9">
            <OptimizedImage
              src={post.mainImage.url}
              alt={post.mainImage.alt || post.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          {layoutVariant.showCategories && post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((category, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {post.title}
          </h3>
          
          {layoutVariant.showSummary && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
              {post.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time>{format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: ja })}</time>
              
              {layoutVariant.showReadTime && post.estimatedReadingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.estimatedReadingTime}分
                </span>
              )}
            </div>
            
            {layoutVariant.ctaStyle === 'text' && (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                続きを読む →
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}