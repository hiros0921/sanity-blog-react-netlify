import { useState, useEffect, useCallback, useRef } from 'react';
import { useScroll } from 'framer-motion';

export interface ReadingProgressData {
  // 現在の読書進捗（0-1）
  progress: number;
  // パーセンテージ（0-100）
  percentage: number;
  // 現在のスクロール位置
  scrollY: number;
  // ドキュメントの高さ
  documentHeight: number;
  // ビューポートの高さ
  viewportHeight: number;
  // 読書開始からの経過時間（秒）
  elapsedTime: number;
  // 推定読書速度（ピクセル/秒）
  readingSpeed: number;
  // 現在表示されているセクション
  currentSection?: string;
  // 読書完了フラグ
  isComplete: boolean;
}

interface UseReadingProgressOptions {
  // 完了とみなす進捗率（デフォルト: 0.9）
  completeThreshold?: number;
  // スクロール速度の計算間隔（ミリ秒）
  speedCalculationInterval?: number;
  // コールバック
  onProgress?: (data: ReadingProgressData) => void;
  onComplete?: () => void;
  onSectionChange?: (section: string) => void;
  // セクションを識別するセレクタ
  sectionSelector?: string;
}

export const useReadingProgress = (options: UseReadingProgressOptions = {}) => {
  const {
    completeThreshold = 0.9,
    speedCalculationInterval = 1000,
    onProgress,
    onComplete,
    onSectionChange,
    sectionSelector = 'h2, h3',
  } = options;

  const { scrollY, scrollYProgress } = useScroll();
  const [progressData, setProgressData] = useState<ReadingProgressData>({
    progress: 0,
    percentage: 0,
    scrollY: 0,
    documentHeight: 0,
    viewportHeight: 0,
    elapsedTime: 0,
    readingSpeed: 0,
    isComplete: false,
  });

  const startTimeRef = useRef<number>(Date.now());
  const lastScrollYRef = useRef<number>(0);
  const lastSpeedUpdateRef = useRef<number>(Date.now());
  const hasCompletedRef = useRef<boolean>(false);
  const currentSectionRef = useRef<string>('');

  // スクロール速度を計算
  const calculateReadingSpeed = useCallback(() => {
    const now = Date.now();
    const timeDiff = (now - lastSpeedUpdateRef.current) / 1000; // 秒に変換
    const scrollDiff = Math.abs(scrollY.get() - lastScrollYRef.current);

    if (timeDiff >= speedCalculationInterval / 1000) {
      const speed = scrollDiff / timeDiff;
      lastScrollYRef.current = scrollY.get();
      lastSpeedUpdateRef.current = now;
      return speed;
    }

    return progressData.readingSpeed;
  }, [scrollY, speedCalculationInterval, progressData.readingSpeed]);

  // 現在のセクションを検出
  const detectCurrentSection = useCallback(() => {
    if (!sectionSelector) return '';

    const sections = document.querySelectorAll(sectionSelector);
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i] as HTMLElement;
      if (section.offsetTop <= scrollPosition) {
        return section.textContent || section.id || `Section ${i + 1}`;
      }
    }

    return '';
  }, [sectionSelector]);

  // プログレスデータを更新
  const updateProgress = useCallback(() => {
    const progress = scrollYProgress.get();
    const percentage = Math.round(progress * 100);
    const currentScrollY = scrollY.get();
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    const readingSpeed = calculateReadingSpeed();
    const currentSection = detectCurrentSection();
    const isComplete = progress >= completeThreshold;

    const newProgressData: ReadingProgressData = {
      progress,
      percentage,
      scrollY: currentScrollY,
      documentHeight,
      viewportHeight,
      elapsedTime,
      readingSpeed,
      currentSection,
      isComplete,
    };

    setProgressData(newProgressData);

    // コールバック実行
    onProgress?.(newProgressData);

    // セクション変更の検出
    if (currentSection && currentSection !== currentSectionRef.current) {
      currentSectionRef.current = currentSection;
      onSectionChange?.(currentSection);
    }

    // 完了の検出
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete?.();
    }
  }, [
    scrollY,
    scrollYProgress,
    calculateReadingSpeed,
    detectCurrentSection,
    completeThreshold,
    onProgress,
    onComplete,
    onSectionChange,
  ]);

  // スクロールイベントの監視
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(updateProgress);
    return unsubscribe;
  }, [scrollYProgress, updateProgress]);

  // 読書統計を取得
  const getReadingStats = useCallback(() => {
    const { progress, elapsedTime, readingSpeed } = progressData;
    
    // 平均読書速度（ピクセル/分）
    const averageSpeed = elapsedTime > 0 ? (scrollY.get() / elapsedTime) * 60 : 0;
    
    // 推定残り時間（秒）
    const remainingDistance = progressData.documentHeight * (1 - progress);
    const estimatedRemainingTime = readingSpeed > 0 ? remainingDistance / readingSpeed : 0;
    
    // 推定総読書時間（秒）
    const estimatedTotalTime = progress > 0 ? elapsedTime / progress : 0;

    return {
      elapsedTime,
      estimatedRemainingTime,
      estimatedTotalTime,
      averageSpeed,
      currentSpeed: readingSpeed,
      progress,
      percentage: progressData.percentage,
    };
  }, [progressData, scrollY]);

  // 特定の位置へスクロール
  const scrollToProgress = useCallback((targetProgress: number) => {
    const targetY = progressData.documentHeight * targetProgress;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, [progressData.documentHeight]);

  // 特定のセクションへスクロール
  const scrollToSection = useCallback((sectionIndex: number) => {
    const sections = document.querySelectorAll(sectionSelector);
    if (sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [sectionSelector]);

  return {
    ...progressData,
    getReadingStats,
    scrollToProgress,
    scrollToSection,
  };
};