import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressProps {
  className?: string;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      const progressPercent = Math.min(Math.max(scrollPercent * 100, 0), 100);
      
      setProgress(progressPercent);
    };

    // 初期値を設定
    updateProgress();

    // スクロールイベントをリッスン
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="h-1 bg-gray-200/30">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* プログレスインジケーター */}
      <div className="absolute right-4 top-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
        <span className="text-xs font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ReadingProgress;