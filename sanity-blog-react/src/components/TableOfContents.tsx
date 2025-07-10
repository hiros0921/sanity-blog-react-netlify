import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, ChevronRight } from 'lucide-react';
import type { Heading } from '../utils/extractHeadings';
import { scrollToHeading } from '../utils/extractHeadings';

interface TableOfContentsProps {
  headings: Heading[];
  variant?: 'floating' | 'sidebar' | 'inline';
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  headings, 
  variant = 'floating',
  className = '' 
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (headings.length === 0) return;

    // Intersection Observerで現在表示中の見出しを追跡
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // 見出し要素を監視
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // スクロール位置に応じて表示/非表示を切り替え（floating variant用）
  useEffect(() => {
    if (variant !== 'floating') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variant]);

  const handleClick = (id: string) => {
    scrollToHeading(id);
    if (variant === 'floating') {
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  // インライン版（記事の最初に表示）
  if (variant === 'inline') {
    return (
      <nav className={`bg-gray-50 rounded-lg p-6 mb-8 ${className}`}>
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <List className="w-5 h-5 mr-2" />
          目次
        </h2>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`pl-${(heading.level - 1) * 4}`}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`
                  text-left w-full py-1 px-2 rounded transition-colors duration-200
                  hover:bg-purple-100 hover:text-purple-700
                  ${activeId === heading.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'}
                `}
              >
                <span className="flex items-center">
                  {heading.level > 1 && (
                    <ChevronRight className="w-3 h-3 mr-1 opacity-50" />
                  )}
                  {heading.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // サイドバー版
  if (variant === 'sidebar') {
    return (
      <nav className={`sticky top-24 ${className}`}>
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">
          目次
        </h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`
                  text-left w-full py-1 transition-all duration-200
                  hover:text-purple-600
                  ${activeId === heading.id 
                    ? 'text-purple-600 font-medium border-l-2 border-purple-600 pl-2 -ml-0.5' 
                    : 'text-gray-600 hover:pl-2'
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // フローティング版（デフォルト）
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 ${className}`}
        >
          {/* トグルボタン */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <List className="w-6 h-6 text-gray-700" />
            )}
          </motion.button>

          {/* 目次パネル */}
          <AnimatePresence>
            {isOpen && (
              <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-16 bg-white rounded-lg shadow-xl p-6 w-80 max-h-[70vh] overflow-y-auto"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  目次
                </h3>
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <motion.li
                      key={heading.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                    >
                      <button
                        onClick={() => handleClick(heading.id)}
                        className={`
                          text-left w-full py-2 px-3 rounded transition-all duration-200
                          hover:bg-purple-50 hover:text-purple-700
                          ${activeId === heading.id 
                            ? 'bg-purple-100 text-purple-700 font-medium shadow-sm' 
                            : 'text-gray-700'
                          }
                        `}
                      >
                        <span className="flex items-center">
                          {heading.level > 1 && (
                            <ChevronRight className="w-3 h-3 mr-1 opacity-50" />
                          )}
                          {heading.text}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* プログレスインジケーター */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>読書の進捗</span>
                    <span className="font-medium">
                      {activeId ? `${headings.findIndex(h => h.id === activeId) + 1}/${headings.length}` : '0/0'}
                    </span>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableOfContents;