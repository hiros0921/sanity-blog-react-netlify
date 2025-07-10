import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Clock, ChevronUp } from 'lucide-react';
import type { ReadingTimeResult } from '../lib/readingTime';

interface ReadingProgressIndicatorProps {
  variant?: 'top-bar' | 'circular' | 'sidebar' | 'floating';
  readingTime?: ReadingTimeResult;
  showBackToTop?: boolean;
  showTimeRemaining?: boolean;
  className?: string;
  color?: string;
  height?: number;
}

const ReadingProgressIndicator: React.FC<ReadingProgressIndicatorProps> = ({
  variant = 'top-bar',
  readingTime,
  showBackToTop = true,
  showTimeRemaining = true,
  className = '',
  color = 'purple',
  height = 4,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // スクロール位置を監視
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsVisible(scrolled);

      // 残り読書時間の計算
      if (readingTime && showTimeRemaining) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = window.scrollY / totalHeight;
        const remainingProgress = 1 - currentProgress;
        const remainingMinutes = Math.ceil(readingTime.minutes * remainingProgress);
        setTimeRemaining(remainingMinutes);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期値を設定

    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingTime, showTimeRemaining]);

  // トップへ戻る
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // カラークラスを取得
  const getColorClasses = () => {
    const colors = {
      purple: 'bg-purple-600 text-purple-600 border-purple-600',
      blue: 'bg-blue-600 text-blue-600 border-blue-600',
      green: 'bg-green-600 text-green-600 border-green-600',
      red: 'bg-red-600 text-red-600 border-red-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  // トップバーバリアント
  if (variant === 'top-bar') {
    return (
      <>
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 ${className}`}
          style={{
            height: `${height}px`,
            background: 'rgba(0,0,0,0.1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`h-full ${color === 'gradient' ? getColorClasses() : getColorClasses()}`}
            style={{ scaleX, transformOrigin: '0%' }}
          />
        </motion.div>

        {showTimeRemaining && readingTime && isVisible && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              残り{timeRemaining}分
            </span>
          </motion.div>
        )}
      </>
    );
  }

  // 円形プログレスバリアント
  if (variant === 'circular') {
    const progress = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
    });
    const strokeDashoffset = useTransform(progress, [0, 1], [2 * Math.PI * 28, 0]);

    return (
      <motion.div
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* 背景の円 */}
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className={getColorClasses()}
              strokeDasharray={`${2 * Math.PI * 28}`}
              style={{
                strokeDashoffset,
              }}
            />
          </svg>

          {/* 中央のボタン */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Back to top"
            >
              <ChevronUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>

        {showTimeRemaining && readingTime && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md whitespace-nowrap">
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {timeRemaining}分
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  // サイドバーバリアント
  if (variant === 'sidebar') {
    return (
      <motion.div
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-40 ${className}`}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-l-lg shadow-lg p-2">
          {/* 縦のプログレスバー */}
          <div className="relative w-1 h-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`absolute bottom-0 left-0 right-0 ${getColorClasses()}`}
              style={{
                scaleY: scrollYProgress,
                transformOrigin: 'bottom',
              }}
            />
          </div>

          {/* 読書時間情報 */}
          {readingTime && (
            <div className="mt-4 text-center">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-700 dark:text-gray-300">
                <div className="font-medium">{readingTime.text}</div>
                {showTimeRemaining && (
                  <div className="mt-1">残り{timeRemaining}分</div>
                )}
              </div>
            </div>
          )}

          {/* トップへ戻るボタン */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="mt-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // フローティングバリアント
  if (variant === 'floating') {
    const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [2 * Math.PI * 20, 0]);
    return (
      <motion.div
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-4 flex items-center space-x-4">
          {/* プログレスリング */}
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className={getColorClasses()}
                strokeDasharray={`${2 * Math.PI * 20}`}
                style={{
                  strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {Math.round(scrollYProgress.get() * 100)}%
              </span>
            </div>
          </div>

          {/* 読書時間情報 */}
          {readingTime && showTimeRemaining && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium">残り{timeRemaining}分</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                全体: {readingTime.text}
              </div>
            </div>
          )}

          {/* トップへ戻るボタン */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
};

export default ReadingProgressIndicator;