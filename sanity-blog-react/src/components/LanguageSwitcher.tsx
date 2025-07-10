import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { changeLanguage, getCurrentLanguage, languageNames, supportedLanguages } from '../lib/i18n';
import type { Language } from '../types/i18n';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline' | 'modal';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'dropdown',
  showLabel = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = async (language: Language) => {
    if (language === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    try {
      await changeLanguage(language);
      setIsOpen(false);
      
      // ページをリロードして新しい言語を反映（オプション）
      // window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  // インラインバリアント
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        {showLabel && <Globe className="w-5 h-5 text-gray-400" />}
        <div className="flex space-x-1">
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              disabled={isChanging}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                currentLanguage === lang
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // モーダルバリアント
  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 z-50 max-w-sm w-full"
              >
                <h3 className="text-lg font-bold mb-4">言語を選択 / Select Language</h3>
                <div className="space-y-2">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      disabled={isChanging}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        currentLanguage === lang
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {lang === 'ja' ? '🇯🇵' : '🇺🇸'}
                        </span>
                        <div className="text-left">
                          <p className="font-medium">{languageNames[lang]}</p>
                          <p className="text-sm text-gray-500">
                            {lang === 'ja' ? 'Japanese' : 'English'}
                          </p>
                        </div>
                      </div>
                      {currentLanguage === lang && (
                        <Check className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  閉じる / Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ドロップダウンバリアント（デフォルト）
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        {showLabel && (
          <>
            <span className="text-sm font-medium">
              {languageNames[currentLanguage]}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                disabled={isChanging}
                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  currentLanguage === lang ? 'bg-purple-50' : ''
                } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">
                    {lang === 'ja' ? '🇯🇵' : '🇺🇸'}
                  </span>
                  <span className="font-medium">{languageNames[lang]}</span>
                </div>
                {currentLanguage === lang && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* クリック外側で閉じる */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// 言語切り替えボタン（シンプル版）
export const LanguageToggle: React.FC = () => {
  const currentLanguage = getCurrentLanguage();
  const [isChanging, setIsChanging] = useState(false);

  const toggleLanguage = async () => {
    const nextLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    setIsChanging(true);
    try {
      await changeLanguage(nextLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isChanging}
      className={`p-2 rounded-lg transition-all ${
        isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
      aria-label="Toggle language"
    >
      <motion.div
        key={currentLanguage}
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-1"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {currentLanguage.toUpperCase()}
        </span>
      </motion.div>
    </button>
  );
};

export default LanguageSwitcher;