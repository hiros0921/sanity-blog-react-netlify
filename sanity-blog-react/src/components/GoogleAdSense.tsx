import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import type { AdSenseAd } from '../types/advertising';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdSenseProps {
  ad: AdSenseAd;
  className?: string;
  fallbackContent?: React.ReactNode;
}

const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({ ad, className = '', fallbackContent }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    // AdBlock検出
    const detectAdBlock = async () => {
      try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-9999px';
        document.body.appendChild(testAd);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (testAd.offsetHeight === 0) {
          setIsAdBlocked(true);
        }
        
        document.body.removeChild(testAd);
      } catch (error) {
        console.error('AdBlock detection error:', error);
      }
    };

    detectAdBlock();
  }, []);

  useEffect(() => {
    if (!ad.isActive || isAdBlocked || hasError) return;

    const loadAd = () => {
      try {
        // Google AdSenseスクリプトの読み込み
        if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
          const script = document.createElement('script');
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          script.async = true;
          script.crossOrigin = 'anonymous';
          
          if (ad.testMode) {
            script.setAttribute('data-ad-client', ad.adClient);
            script.setAttribute('data-ad-test', 'on');
          }
          
          document.head.appendChild(script);
        }

        // 広告の初期化
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('AdSense loading error:', error);
        setHasError(true);
      }
    };

    // 遅延読み込み
    const timer = setTimeout(loadAd, 1000);
    return () => clearTimeout(timer);
  }, [ad, isAdBlocked, hasError]);

  // サイズのレスポンシブ対応
  const getAdStyle = () => {
    if (ad.size === 'responsive') {
      return { display: 'block' };
    }
    
    const [width, height] = ad.size.split('x').map(Number);
    return {
      display: 'inline-block',
      width: `${width}px`,
      height: `${height}px`
    };
  };

  // AdBlockメッセージ
  if (isAdBlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center ${className}`}
      >
        <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
        <h3 className="font-semibold text-yellow-800 mb-2">広告ブロッカーが検出されました</h3>
        <p className="text-sm text-yellow-700">
          このサイトは広告収入で運営されています。
          広告ブロッカーを無効にしていただけると幸いです。
        </p>
      </motion.div>
    );
  }

  // エラー時のフォールバック
  if (hasError && fallbackContent) {
    return <>{fallbackContent}</>;
  }

  // テストモードの表示
  if (ad.testMode) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
          style={getAdStyle()}
        >
          <div className="text-center">
            <p className="font-semibold">AdSense広告スペース</p>
            <p className="text-sm">{ad.size}</p>
            <p className="text-xs mt-2">テストモード</p>
          </div>
        </div>
        <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
          TEST
        </span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={adRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`ad-container ${className}`}
        style={getAdStyle()}
      >
        <ins
          className="adsbygoogle"
          style={getAdStyle()}
          data-ad-client={ad.adClient}
          data-ad-slot={ad.adSlot}
          data-ad-format={ad.size === 'responsive' ? 'auto' : undefined}
          data-full-width-responsive={ad.size === 'responsive' ? 'true' : undefined}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// 広告配置ラッパーコンポーネント
export const AdPlacementWrapper: React.FC<{
  position: 'header' | 'sidebar' | 'in-content' | 'footer' | 'floating';
  children: React.ReactNode;
}> = ({ position, children }) => {
  const [isVisible, setIsVisible] = useState(position !== 'floating');

  useEffect(() => {
    if (position !== 'floating') return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position]);

  const getPositionStyles = () => {
    switch (position) {
      case 'floating':
        return 'fixed bottom-4 right-4 z-40';
      case 'header':
        return 'mb-4';
      case 'sidebar':
        return 'sticky top-24';
      case 'footer':
        return 'mt-8';
      default:
        return '';
    }
  };

  if (position === 'floating') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={getPositionStyles()}
          >
            <div className="relative bg-white rounded-lg shadow-lg p-2">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return <div className={getPositionStyles()}>{children}</div>;
};

export default GoogleAdSense;