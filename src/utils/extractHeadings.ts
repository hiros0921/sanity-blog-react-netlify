import type { PortableTextBlock } from '@portabletext/types';

export interface Heading {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement | null;
}

// Portable Textから見出しを抽出
export function extractHeadingsFromPortableText(blocks: PortableTextBlock[]): Heading[] {
  const headings: Heading[] = [];
  
  blocks.forEach((block) => {
    if (block._type === 'block' && block.style && ['h1', 'h2', 'h3', 'h4'].includes(block.style)) {
      const text = block.children
        ?.filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join('') || '';
      
      if (text) {
        const level = parseInt(block.style.charAt(1));
        const id = generateId(text);
        
        headings.push({
          id,
          text,
          level
        });
      }
    }
  });
  
  return headings;
}

// DOMから見出し要素を取得
export function extractHeadingsFromDOM(container: HTMLElement): Heading[] {
  const headingElements = container.querySelectorAll('h1, h2, h3, h4');
  const headings: Heading[] = [];
  
  headingElements.forEach((element) => {
    const text = element.textContent || '';
    const level = parseInt(element.tagName.charAt(1));
    let id = element.id;
    
    // IDがない場合は生成して設定
    if (!id) {
      id = generateId(text);
      element.id = id;
    }
    
    headings.push({
      id,
      text,
      level,
      element: element as HTMLElement
    });
  });
  
  return headings;
}

// テキストからIDを生成
function generateId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '') // 英数字、ひらがな、カタカナ、漢字以外を削除
    .replace(/\s+/g, '-') // スペースをハイフンに変換
    .replace(/-+/g, '-') // 連続するハイフンを一つに
    .replace(/^-|-$/g, ''); // 先頭と末尾のハイフンを削除
}

// スムーズスクロール
export function scrollToHeading(id: string, offset: number = 80): void {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}