import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { sponsoredContentService } from '../lib/sponsoredContent';
import type { SponsoredPost } from '../types/advertising';

interface SponsoredPostCardProps {
  post: SponsoredPost;
  variant?: 'default' | 'compact' | 'featured';
  onView?: () => void;
  onClick?: () => void;
}

const SponsoredPostCard: React.FC<SponsoredPostCardProps> = ({ 
  post, 
  variant = 'default',
  onView,
  onClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Intersection Observerでビューポート内に入ったかを検出
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            // インプレッショントラッキング
            if (!hasTrackedImpression) {
              sponsoredContentService.trackImpression(post.id);
              setHasTrackedImpression(true);
              onView?.();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`sponsored-${post.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [post.id, hasTrackedImpression, onView]);

  const handleClick = () => {
    sponsoredContentService.trackClick(post.id);
    onClick?.();
    
    if (post.cta?.url) {
      window.open(post.cta.url, '_blank', 'noopener,noreferrer');
    }
  };

  const ctr = sponsoredContentService.calculateCTR(post);

  if (variant === 'compact') {
    return (
      <motion.div
        id={`sponsored-${post.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                PR
              </span>
              <span className="ml-2 text-xs text-gray-600">
                提供: {post.sponsor.name}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {post.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-purple-600 ml-4 flex-shrink-0" />
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        id={`sponsored-${post.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-1 shadow-xl"
      >
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
                スポンサード
              </span>
              {post.sponsor.logo && (
                <img
                  src={post.sponsor.logo}
                  alt={post.sponsor.name}
                  className="h-8 ml-3"
                />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.impressions.toLocaleString()}
              </span>
              <span className="flex items-center">
                <MousePointer className="w-4 h-4 mr-1" />
                {ctr.toFixed(1)}%
              </span>
            </div>
          </div>

          {post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{post.content}</p>

          {post.cta && (
            <button
              onClick={handleClick}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            >
              {post.cta.text}
              <ExternalLink className="w-5 h-5 ml-2" />
            </button>
          )}

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-xs text-gray-500">
              提供: {post.sponsor.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // デフォルトバリアント
  return (
    <motion.div
      id={`sponsored-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        {post.imageUrl && (
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <span className="absolute top-4 left-4 text-xs font-bold text-white bg-purple-600 px-3 py-1 rounded-full shadow-lg">
          スポンサード
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-3">
          {post.sponsor.logo ? (
            <img
              src={post.sponsor.logo}
              alt={post.sponsor.name}
              className="h-6 mr-2"
            />
          ) : (
            <span className="text-sm text-gray-600">提供: {post.sponsor.name}</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {post.cta && (
            <span className="text-purple-600 font-medium text-sm flex items-center">
              {post.cta.text}
              <ExternalLink className="w-4 h-4 ml-1" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SponsoredPostCard;