import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../types/theme';

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown' | 'switch';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'icon', 
  showLabel = false,
  className = ''
}) => {
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'light', label: 'ライト', icon: Sun },
    { value: 'dark', label: 'ダーク', icon: Moon },
    { value: 'system', label: 'システム', icon: Monitor },
  ];

  // アイコンのみのトグル
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {resolvedTheme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // スイッチスタイル
  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Sun className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            resolvedTheme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
          }`}
          aria-label="Toggle theme"
        >
          <motion.span
            layout
            className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
            animate={{
              x: resolvedTheme === 'dark' ? 21 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        </button>
        <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        {showLabel && (
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {resolvedTheme === 'dark' ? 'ダークモード' : 'ライトモード'}
          </span>
        )}
      </div>
    );
  }

  // ドロップダウンスタイル
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        aria-label="Theme options"
      >
        <Palette className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            テーマ
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              <div className="p-2">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isActive = theme === themeOption.value;
                  
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{themeOption.label}</span>
                      </div>
                      {isActive && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>現在のテーマ: {resolvedTheme === 'dark' ? 'ダーク' : 'ライト'}</p>
                  {theme === 'system' && (
                    <p className="mt-1">システム設定に従っています</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 外側クリックで閉じる */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// コンパクトなテーマインジケーター
export const ThemeIndicator: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
      {resolvedTheme === 'dark' ? (
        <Moon className="w-3 h-3" />
      ) : (
        <Sun className="w-3 h-3" />
      )}
      <span>
        {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};

// アニメーション付きテーマプレビュー
export const ThemePreview: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handlePreview = (newTheme: Theme) => {
    // 一時的にプレビュー
    const root = document.documentElement;
    root.classList.add('theme-preview');
    root.setAttribute('data-theme-preview', newTheme === 'system' ? 'light' : newTheme);
    
    setTimeout(() => {
      root.classList.remove('theme-preview');
      root.removeAttribute('data-theme-preview');
    }, 1000);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
        <motion.button
          key={themeOption}
          onClick={() => setTheme(themeOption)}
          onHoverStart={() => handlePreview(themeOption)}
          onHoverEnd={() => handlePreview(theme)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-4 rounded-lg border-2 transition-colors ${
            theme === themeOption
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <div className="space-y-2">
            <div className={`h-8 rounded ${
              themeOption === 'dark' ? 'bg-gray-800' : themeOption === 'light' ? 'bg-white' : 'bg-gradient-to-r from-white to-gray-800'
            }`} />
            <div className={`h-2 rounded ${
              themeOption === 'dark' ? 'bg-gray-700' : themeOption === 'light' ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-200 to-gray-700'
            }`} />
            <div className={`h-2 rounded w-3/4 ${
              themeOption === 'dark' ? 'bg-gray-700' : themeOption === 'light' ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-200 to-gray-700'
            }`} />
          </div>
          <p className="mt-3 text-sm font-medium">
            {themeOption === 'light' ? 'ライト' : themeOption === 'dark' ? 'ダーク' : 'システム'}
          </p>
          {theme === themeOption && (
            <motion.div
              layoutId="selected-theme"
              className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;