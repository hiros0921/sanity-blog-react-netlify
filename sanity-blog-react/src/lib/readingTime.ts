// 読書時間推定サービス

interface ReadingTimeConfig {
  // 1分あたりの単語数（デフォルト）
  wordsPerMinute: {
    ja: number; // 日本語
    en: number; // 英語
  };
  // 画像1枚あたりの秒数
  imageViewTime: number;
  // コードブロック1行あたりの秒数
  codeLineTime: number;
  // 最小読書時間（分）
  minReadingTime: number;
}

// デフォルト設定
const DEFAULT_CONFIG: ReadingTimeConfig = {
  wordsPerMinute: {
    ja: 400, // 日本語は1分間に400文字
    en: 200, // 英語は1分間に200単語
  },
  imageViewTime: 12, // 画像1枚12秒
  codeLineTime: 4, // コード1行4秒
  minReadingTime: 1, // 最小1分
};

export interface ReadingTimeResult {
  // 推定読書時間（分）
  minutes: number;
  // 推定読書時間（秒）
  seconds: number;
  // フォーマット済みの時間（例：5分）
  text: string;
  // 詳細情報
  details: {
    wordCount: number;
    characterCount: number;
    imageCount: number;
    codeBlockCount: number;
    codeLineCount: number;
  };
}

class ReadingTimeService {
  private config: ReadingTimeConfig;

  constructor(config: Partial<ReadingTimeConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // テキストから読書時間を計算
  calculate(
    content: string,
    options: {
      lang?: 'ja' | 'en';
      includeImages?: boolean;
      includeCode?: boolean;
    } = {}
  ): ReadingTimeResult {
    const {
      lang = this.detectLanguage(content),
      includeImages = true,
      includeCode = true,
    } = options;

    // 基本的なテキスト処理
    const plainText = this.stripHtml(content);
    const wordCount = this.countWords(plainText, lang);
    const characterCount = this.countCharacters(plainText);

    // 画像とコードブロックのカウント
    const imageCount = includeImages ? this.countImages(content) : 0;
    const { blockCount: codeBlockCount, lineCount: codeLineCount } = includeCode
      ? this.countCodeBlocks(content)
      : { blockCount: 0, lineCount: 0 };

    // 読書時間の計算
    const textReadingTime = wordCount / this.config.wordsPerMinute[lang];
    const imageViewingTime = (imageCount * this.config.imageViewTime) / 60;
    const codeReadingTime = (codeLineCount * this.config.codeLineTime) / 60;

    const totalMinutes = textReadingTime + imageViewingTime + codeReadingTime;
    const minutes = Math.max(Math.ceil(totalMinutes), this.config.minReadingTime);
    const seconds = Math.round(totalMinutes * 60);

    return {
      minutes,
      seconds,
      text: this.formatTime(minutes, lang),
      details: {
        wordCount,
        characterCount,
        imageCount,
        codeBlockCount,
        codeLineCount,
      },
    };
  }

  // HTMLタグを除去
  private stripHtml(html: string): string {
    // HTMLタグを除去
    let text = html.replace(/<[^>]*>/g, ' ');
    // 改行を空白に変換
    text = text.replace(/\n+/g, ' ');
    // 複数の空白を1つに
    text = text.replace(/\s+/g, ' ');
    // 前後の空白を削除
    return text.trim();
  }

  // 言語を自動検出
  private detectLanguage(text: string): 'ja' | 'en' {
    // 日本語の文字（ひらがな、カタカナ、漢字）を含むかチェック
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text) ? 'ja' : 'en';
  }

  // 単語数をカウント
  private countWords(text: string, lang: 'ja' | 'en'): number {
    if (lang === 'ja') {
      // 日本語の場合は文字数をカウント（句読点を除く）
      return text.replace(/[、。！？\s]/g, '').length;
    } else {
      // 英語の場合は単語数をカウント
      const words = text.match(/\b\w+\b/g);
      return words ? words.length : 0;
    }
  }

  // 文字数をカウント
  private countCharacters(text: string): number {
    return text.length;
  }

  // 画像数をカウント
  private countImages(content: string): number {
    const imgRegex = /<img[^>]*>/gi;
    const matches = content.match(imgRegex);
    return matches ? matches.length : 0;
  }

  // コードブロックをカウント
  private countCodeBlocks(content: string): { blockCount: number; lineCount: number } {
    // ```で囲まれたコードブロック
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = content.match(codeBlockRegex) || [];
    
    let lineCount = 0;
    codeBlocks.forEach(block => {
      // 各ブロック内の行数をカウント
      const lines = block.split('\n').length - 2; // 開始と終了の```を除く
      lineCount += Math.max(lines, 1);
    });

    // <code>タグ
    const inlineCodeRegex = /<code[^>]*>[\s\S]*?<\/code>/g;
    const inlineCodes = content.match(inlineCodeRegex) || [];

    return {
      blockCount: codeBlocks.length + inlineCodes.length,
      lineCount: lineCount + inlineCodes.length,
    };
  }

  // 時間をフォーマット
  private formatTime(minutes: number, lang: 'ja' | 'en'): string {
    if (lang === 'ja') {
      if (minutes < 1) {
        return '1分未満';
      } else if (minutes === 1) {
        return '約1分';
      } else {
        return `約${minutes}分`;
      }
    } else {
      if (minutes < 1) {
        return 'Less than 1 min';
      } else if (minutes === 1) {
        return '1 min read';
      } else {
        return `${minutes} min read`;
      }
    }
  }

  // バッチ処理（複数の記事の読書時間を一括計算）
  calculateBatch(
    contents: Array<{ id: string; content: string }>,
    options?: Parameters<typeof this.calculate>[1]
  ): Map<string, ReadingTimeResult> {
    const results = new Map<string, ReadingTimeResult>();
    
    contents.forEach(({ id, content }) => {
      results.set(id, this.calculate(content, options));
    });

    return results;
  }

  // Portable Text用の計算
  calculateFromPortableText(blocks: any[]): ReadingTimeResult {
    let text = '';
    let imageCount = 0;
    let codeBlockCount = 0;
    let codeLineCount = 0;

    blocks.forEach(block => {
      if (block._type === 'block') {
        // テキストブロック
        const blockText = block.children
          ?.map((child: any) => child.text || '')
          .join('') || '';
        text += blockText + ' ';
      } else if (block._type === 'image') {
        // 画像ブロック
        imageCount++;
      } else if (block._type === 'code') {
        // コードブロック
        codeBlockCount++;
        const lines = (block.code || '').split('\n').length;
        codeLineCount += lines;
      }
    });

    const lang = this.detectLanguage(text);
    const wordCount = this.countWords(text, lang);
    const characterCount = this.countCharacters(text);

    // 読書時間の計算
    const textReadingTime = wordCount / this.config.wordsPerMinute[lang];
    const imageViewingTime = (imageCount * this.config.imageViewTime) / 60;
    const codeReadingTime = (codeLineCount * this.config.codeLineTime) / 60;

    const totalMinutes = textReadingTime + imageViewingTime + codeReadingTime;
    const minutes = Math.max(Math.ceil(totalMinutes), this.config.minReadingTime);
    const seconds = Math.round(totalMinutes * 60);

    return {
      minutes,
      seconds,
      text: this.formatTime(minutes, lang),
      details: {
        wordCount,
        characterCount,
        imageCount,
        codeBlockCount,
        codeLineCount,
      },
    };
  }
}

// デフォルトのインスタンスをエクスポート
export const readingTimeService = new ReadingTimeService();

// カスタム設定でのインスタンス作成もエクスポート
export const createReadingTimeService = (config?: Partial<ReadingTimeConfig>) => {
  return new ReadingTimeService(config);
};