export const getPublicUrl = () => {
  // 本番環境のURL候補
  const urls = [
    window.location.origin,
    import.meta.env.VITE_PUBLIC_URL,
    'https://steady-chebakia-9c5055.netlify.app',
    'https://hirosuwa.com'
  ];

  // 現在のURLが動作しているかチェック
  for (const url of urls) {
    if (url && window.location.href.startsWith(url)) {
      return url;
    }
  }

  // デフォルトはNetlifyのURL
  return 'https://steady-chebakia-9c5055.netlify.app';
};

export const getAssetUrl = (path: string) => {
  const publicUrl = getPublicUrl();
  return `${publicUrl}${path}`;
};