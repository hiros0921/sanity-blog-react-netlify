// Twitter Bearer Token生成スクリプト
// 使用方法: node generateBearerToken.js

const https = require('https');

// ここにあなたのAPI KeyとAPI Secret Keyを入力してください
const API_KEY = 'o1uRWOLvSiBXFZfx3ASSo6ecH';  // o1uRWO...から始まる完全なキー
const API_SECRET_KEY = 'nUxCaqbvXOsfKnK1kXsaG2yNDIctsmZulJGdXtf5uWHR5bmxEV';  // nUxCaqbv...から始まる完全なキー

// Base64エンコード
const credentials = Buffer.from(`${API_KEY}:${API_SECRET_KEY}`).toString('base64');

const options = {
  hostname: 'api.twitter.com',
  path: '/oauth2/token',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Content-Length': 29
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.access_token) {
        console.log('\n✅ Bearer Token生成成功！\n');
        console.log('Bearer Token:', response.access_token);
        console.log('\nこのトークンを.envファイルのVITE_TWITTER_BEARER_TOKENに設定してください。');
      } else {
        console.error('❌ エラー:', response);
      }
    } catch (error) {
      console.error('❌ パースエラー:', error);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ リクエストエラー:', error);
});

req.write('grant_type=client_credentials');
req.end();