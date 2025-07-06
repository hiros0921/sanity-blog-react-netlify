import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { recommendationEngine } from '../lib/recommendationEngine';
import { userBehaviorTracker } from '../lib/userBehavior';
import { urlFor } from '../lib/sanity';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PersonalizedFeedProps {
  allPosts: BlogPost[];
  limit?: number;
}

const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({ 
  allPosts, 
  limit = 10 
}) => {
  const [personalizedPosts, setPersonalizedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadPersonalizedFeed = async () => {
      setLoading(true);
      try {
        const feed = await recommendationEngine.getPersonalizedFeed(allPosts, limit);
        setPersonalizedPosts(feed);
      } catch (error) {
        console.error('Failed to load personalized feed:', error);
        // フォールバック: 最新の記事を表示
        setPersonalizedPosts(allPosts.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    loadPersonalizedFeed();
  }, [allPosts, limit, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const userProfile = userBehaviorTracker.getUserProfile();
  const topInterests = userBehaviorTracker.getTopInterests(3);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold">
                あなたのためのフィード
              </h2>
            </div>
            {topInterests.length > 0 && (
              <p className="text-gray-600 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                興味のあるトピック: {topInterests.map(([topic]) => topic).join('、')}
              </p>
            )}
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw className="w-4 h-4" />
            更新
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalizedPosts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <Link to={`/blog/${post.slug.current}`}>
                <div className="flex h-full">
                  {post.mainImage && (
                    <div className="w-1/3 overflow-hidden">
                      <img
                        src={urlFor(post.mainImage).width(300).height(200).url()}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {post.categories?.slice(0, 2).map((category) => (
                        <span
                          key={category._id}
                          className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full"
                        >
                          {category.title}
                        </span>
                      ))}
                      {index < 3 && (
                        <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          おすすめ
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.excerpt || '記事の内容をチェック'}
                    </p>

                    <div className="flex items-center text-xs text-gray-500">
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

        {/* エンゲージメントスコアの表示 */}
        {userProfile.engagementScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-white rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">あなたのエンゲージメント</h3>
                <p className="text-sm text-gray-600">
                  {userProfile.readingHistory.length}件の記事を読み、
                  {userProfile.bookmarks.length}件をブックマークしました
                </p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(userProfile.engagementScore)}%
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${userProfile.engagementScore}%` }}
              />
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            すべての記事を見る
            <TrendingUp className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedFeed;