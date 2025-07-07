import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { translationAPI } from '../lib/translationAPI';
import type { Language } from '../types/i18n';

interface DynamicTranslationProps {
  text: string;
  sourceLang?: Language;
  className?: string;
  fallback?: React.ReactNode;
  cache?: boolean;
}

// 動的テキストの自動翻訳コンポーネント
export const DynamicTranslation: React.FC<DynamicTranslationProps> = ({
  text,
  sourceLang = 'ja',
  className = '',
  fallback,
  cache = true
}) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(false);
  const targetLang = i18n.language as Language;

  useEffect(() => {
    // 同じ言語の場合は翻訳しない
    if (sourceLang === targetLang) {
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      setIsTranslating(true);
      setError(false);

      try {
        const translated = await translationAPI.translateText(text, targetLang, sourceLang);
        setTranslatedText(translated);
      } catch (err) {
        console.error('Translation error:', err);
        setError(true);
        setTranslatedText(text); // エラー時は元のテキストを表示
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [text, sourceLang, targetLang]);

  if (isTranslating) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        {fallback || text}
      </span>
    );
  }

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return <span className={className}>{translatedText}</span>;
};

// 複数テキストの一括翻訳コンポーネント
interface BatchTranslationProps {
  texts: string[];
  sourceLang?: Language;
  renderItem: (translatedText: string, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}

export const BatchTranslation: React.FC<BatchTranslationProps> = ({
  texts,
  sourceLang = 'ja',
  renderItem,
  fallback
}) => {
  const { i18n } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isTranslating, setIsTranslating] = useState(false);
  const targetLang = i18n.language as Language;

  useEffect(() => {
    if (sourceLang === targetLang) {
      setTranslatedTexts(texts);
      return;
    }

    const translateBatch = async () => {
      setIsTranslating(true);

      try {
        const translated = await translationAPI.translateBatch(texts, targetLang, sourceLang);
        setTranslatedTexts(translated);
      } catch (err) {
        console.error('Batch translation error:', err);
        setTranslatedTexts(texts);
      } finally {
        setIsTranslating(false);
      }
    };

    translateBatch();
  }, [texts, sourceLang, targetLang]);

  if (isTranslating && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {translatedTexts.map((text, index) => renderItem(text, index))}
    </>
  );
};

// 翻訳可能なマークダウンコンポーネント
interface TranslatableMarkdownProps {
  content: string;
  sourceLang?: Language;
  className?: string;
}

export const TranslatableMarkdown: React.FC<TranslatableMarkdownProps> = ({
  content,
  sourceLang = 'ja',
  className = ''
}) => {
  const { i18n } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState<string>(content);
  const [isTranslating, setIsTranslating] = useState(false);
  const targetLang = i18n.language as Language;

  useEffect(() => {
    if (sourceLang === targetLang) {
      setTranslatedContent(content);
      return;
    }

    const translateMarkdown = async () => {
      setIsTranslating(true);

      try {
        // マークダウンを段落に分割
        const paragraphs = content.split(/\n\n+/);
        
        // 各段落を翻訳
        const translatedParagraphs = await translationAPI.translateBatch(
          paragraphs,
          targetLang,
          sourceLang
        );
        
        // 翻訳された段落を結合
        setTranslatedContent(translatedParagraphs.join('\n\n'));
      } catch (err) {
        console.error('Markdown translation error:', err);
        setTranslatedContent(content);
      } finally {
        setIsTranslating(false);
      }
    };

    translateMarkdown();
  }, [content, sourceLang, targetLang]);

  if (isTranslating) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: translatedContent }}
    />
  );
};

// 言語検出コンポーネント
interface LanguageDetectorProps {
  text: string;
  onDetect: (language: Language) => void;
}

export const LanguageDetector: React.FC<LanguageDetectorProps> = ({ text, onDetect }) => {
  useEffect(() => {
    // 簡単な言語検出ロジック（実際にはより高度な検出が必要）
    const detectLanguage = () => {
      // 日本語の文字（ひらがな、カタカナ、漢字）を含むかチェック
      const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
      
      if (japaneseRegex.test(text)) {
        onDetect('ja');
      } else {
        onDetect('en');
      }
    };

    detectLanguage();
  }, [text, onDetect]);

  return null;
};