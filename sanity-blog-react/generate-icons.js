// このスクリプトはPWA用のアイコンを生成します
// 実行: node generate-icons.js

const fs = require('fs');
const path = require('path');

// SVGアイコンテンプレート
const iconSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1e40af"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="${size * 0.4}px" font-weight="bold">
    HS
  </text>
</svg>
`;

// アイコンサイズ
const sizes = [192, 512];

// publicディレクトリにアイコンを生成
sizes.forEach(size => {
  const svg = iconSvg(size);
  const filename = path.join(__dirname, 'public', `icon-${size}.png`);
  
  // SVGを直接保存（実際の使用時はSVGからPNGへの変換ツールを使用）
  fs.writeFileSync(filename.replace('.png', '.svg'), svg);
  
  console.log(`Generated icon-${size}.svg`);
});

console.log('Icon generation complete! Please convert SVG files to PNG format using an image converter.');