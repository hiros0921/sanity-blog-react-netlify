import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, Star, TrendingUp } from 'lucide-react';
import { affiliateAdsService } from '../lib/affiliateAds';
import type { AffiliateAd } from '../types/advertising';

interface AffiliateAdCardProps {
  ad: AffiliateAd;
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
}

const AffiliateAdCard: React.FC<AffiliateAdCardProps> = ({ 
  ad, 
  variant = 'default',
  showStats = false 
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
              affiliateAdsService.trackImpression(ad.id);
              setHasTrackedImpression(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`affiliate-${ad.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ad.id, hasTrackedImpression]);

  const handleClick = () => {
    affiliateAdsService.trackClick(ad.id);
    window.open(ad.trackingUrl, '_blank', 'noopener,noreferrer');
  };

  const getProgramBadge = () => {
    switch (ad.program) {
      case 'amazon':
        return (
          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
            Amazon
          </span>
        );
      case 'rakuten':
        return (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
            楽天
          </span>
        );
      case 'yahoo':
        return (
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
            Yahoo!
          </span>
        );
      default:
        return null;
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        id={`affiliate-${ad.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        {ad.productImage && (
          <img
            src={ad.productImage}
            alt={ad.productName}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {getProgramBadge()}
          </div>
          <h4 className="font-medium text-gray-900 line-clamp-1">{ad.productName}</h4>
          {ad.price && (
            <p className="text-lg font-bold text-purple-600">¥{ad.price.toLocaleString()}</p>
          )}
        </div>
        <ExternalLink className="w-5 h-5 text-gray-400" />
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
    const conversionRate = ad.clicks > 0 ? (ad.conversions / ad.clicks) * 100 : 0;

    return (
      <motion.div
        id={`affiliate-${ad.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">アフィリエイト商品</h3>
            {getProgramBadge()}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-4">
            {ad.productImage && (
              <img
                src={ad.productImage}
                alt={ad.productName}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-xl text-gray-900 mb-2">{ad.productName}</h4>
              <p className="text-sm text-gray-600 mb-3">カテゴリー: {ad.category}</p>
              
              {ad.price && (
                <div className="mb-4">
                  <p className="text-3xl font-bold text-purple-600">
                    ¥{ad.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    コミッション: {ad.commission}%
                  </p>
                </div>
              )}

              <button
                onClick={handleClick}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                商品を見る
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {showStats && (
            <div className="mt-6 pt-6 border-t">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                パフォーマンス統計
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">表示回数</p>
                  <p className="text-xl font-bold">{ad.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">クリック数</p>
                  <p className="text-xl font-bold">{ad.clicks}</p>
                  <p className="text-xs text-gray-500">CTR: {ctr.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">成約数</p>
                  <p className="text-xl font-bold">{ad.conversions}</p>
                  <p className="text-xs text-gray-500">CVR: {conversionRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">収益</p>
                  <p className="text-xl font-bold text-green-600">
                    ¥{ad.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // デフォルトバリアント
  return (
    <motion.div
      id={`affiliate-${ad.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative">
        {ad.productImage && (
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={ad.productImage}
              alt={ad.productName}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getProgramBadge()}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {ad.productName}
        </h4>
        
        <div className="flex items-center justify-between mb-3">
          {ad.price && (
            <p className="text-2xl font-bold text-purple-600">
              ¥{ad.price.toLocaleString()}
            </p>
          )}
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4" />
          </div>
        </div>

        <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
          詳細を見る
          <ExternalLink className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

// アフィリエイト広告グリッド
export const AffiliateAdGrid: React.FC<{
  ads: AffiliateAd[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'detailed';
}> = ({ ads, columns = 3, variant = 'default' }) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {ads.map((ad) => (
        <AffiliateAdCard key={ad.id} ad={ad} variant={variant} />
      ))}
    </div>
  );
};

export default AffiliateAdCard;