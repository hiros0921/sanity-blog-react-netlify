import React from 'react';
import { Clock, Coffee, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReadingTimeResult } from '../lib/readingTime';

interface ReadingTimeDisplayProps {
  readingTime: ReadingTimeResult;
  variant?: 'simple' | 'detailed' | 'inline' | 'card';
  showIcon?: boolean;
  showDetails?: boolean;
  className?: string;
}

const ReadingTimeDisplay: React.FC<ReadingTimeDisplayProps> = ({
  readingTime,
  variant = 'simple',
  showIcon = true,
  showDetails = false,
  className = '',
}) => {
  // アイコンを選択（読書時間に応じて）
  const getIcon = () => {
    if (readingTime.minutes <= 3) {
      return <Zap className="w-4 h-4" />;
    } else if (readingTime.minutes <= 10) {
      return <Coffee className="w-4 h-4" />;
    } else {
      return <BookOpen className="w-4 h-4" />;
    }
  };

  // 読書時間に応じたメッセージ
  const getMessage = () => {
    if (readingTime.minutes <= 3) {
      return 'クイックリード';
    } else if (readingTime.minutes <= 10) {
      return 'コーヒーブレイク';
    } else {
      return 'じっくり読書';
    }
  };

  // シンプル表示
  if (variant === 'simple') {
    return (
      <div className={`flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 ${className}`}>
        {showIcon && <Clock className="w-4 h-4" />}
        <span className="text-sm">{readingTime.text}</span>
      </div>
    );
  }

  // インライン表示
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400 ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5" />}
        <span className="text-xs">{readingTime.text}</span>
      </span>
    );
  }

  // 詳細表示
  if (variant === 'detailed') {
    const { details } = readingTime;
    
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showIcon && getIcon()}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {readingTime.text}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getMessage()}
          </span>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-2 text-sm text-gray-600 dark:text-gray-300"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  文字数
                </span>
                <span className="font-medium">
                  {details.characterCount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  単語数
                </span>
                <span className="font-medium">
                  {details.wordCount.toLocaleString()}
                </span>
              </div>
            </div>

            {(details.imageCount > 0 || details.codeBlockCount > 0) && (
              <div className="flex items-center space-x-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                {details.imageCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">🖼️</span>
                    <span className="text-xs">{details.imageCount}枚の画像</span>
                  </div>
                )}
                {details.codeBlockCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">💻</span>
                    <span className="text-xs">{details.codeBlockCount}個のコード</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // カード表示
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {getIcon()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {readingTime.text}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getMessage()}
              </p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(readingTime.details.wordCount / 100) / 10}k
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">単語</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {readingTime.details.imageCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">画像</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {readingTime.details.codeBlockCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">コード</p>
            </div>
          </div>
        )}

        {/* プログレスバー（読書時間の視覚化） */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>0分</span>
            <span>{readingTime.minutes}分</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

// 複数記事の読書時間を表示
export const ReadingTimeList: React.FC<{
  items: Array<{ id: string; title: string; readingTime: ReadingTimeResult }>;
  className?: string;
}> = ({ items, className = '' }) => {
  const totalMinutes = items.reduce((sum, item) => sum + item.readingTime.minutes, 0);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          読書時間の概要
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          合計: 約{totalMinutes}分
        </span>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
              {item.title}
            </p>
          </div>
          <ReadingTimeDisplay
            readingTime={item.readingTime}
            variant="inline"
            showIcon={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ReadingTimeDisplay;