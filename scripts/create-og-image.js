// OG画像生成スクリプト
// 使用方法: node scripts/create-og-image.js

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createOGImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // ビューポートを設定
  await page.setViewport({
    width: 1200,
    height: 630,
  });
  
  // HTMLファイルを読み込む
  const htmlPath = join(__dirname, '../public/og-image-template.html');
  await page.goto(`file://${htmlPath}`);
  
  // スクリーンショットを撮影
  await page.screenshot({
    path: join(__dirname, '../public/og-image.png'),
    type: 'png',
  });
  
  await browser.close();
  
  console.log('✅ OG画像を作成しました: public/og-image.png');
}

createOGImage().catch(console.error);