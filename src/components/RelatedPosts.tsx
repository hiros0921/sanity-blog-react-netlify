import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { recommendationEngine } from '../lib/recommendationEngine';
import { urlFor } from '../lib/sanity';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  variant?: 'sidebar' | 'bottom' | 'grid';
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  currentPost, 
  allPosts, 
  variant = 'bottom' 
}) => {
  const [recommendations, setRecommendations] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const posts = await recommendationEngine.getRecommendations(
          currentPost,
          allPosts,
          {
            maxRecommendations: variant === 'sidebar' ? 3 : 6,
            includeReasons: true,
            diversityFactor: 0.4,
            personalizedWeight: 0.8
          }
        );
        setRecommendations(posts);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentPost, allPosts, variant]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (variant === 'sidebar') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-xl font-bold">おすすめの記事</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((post) => (
            <motion.article
              key={post._id}
              variants={itemVariants}
              className="group"
            >
              <Link to={`/post/${post.slug.current}`}>
                <div className="flex gap-4">
                  {post.mainImage && (
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={urlFor(post.mainImage).width(160).height(160).url()}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <time>
                        {format(new Date(post._createdAt), 'M月d日', { locale: ja })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`my-16 ${variant === 'grid' ? 'max-w-7xl mx-auto px-4' : ''}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold">
            あなたへのおすすめ
          </h2>
        </div>
        <Link
          to="/blog"
          className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
        >
          すべて見る
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className={`grid gap-6 ${
        variant === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {recommendations.map((post) => (
          <motion.article
            key={post._id}
            variants={itemVariants}
            className="group cursor-pointer"
          >
            <Link to={`/blog/${post.slug.current}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {post.mainImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.categories?.map((category) => (
                      <span
                        key={category._id}
                        className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt || '記事の内容をチェック'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <time>
                        {format(new Date(post._createdAt), 'yyyy年M月d日', { locale: ja })}
                      </time>
                    </div>
                    
                    <div className="flex items-center text-purple-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs">人気</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* AI推薦の説明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
          AIがあなたの興味に基づいて記事を推薦しています
        </p>
      </motion.div>
    </motion.section>
  );
};

export default RelatedPosts;