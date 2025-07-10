// Lazy load heavy components and libraries
export const lazyLoadComponent = (
  importFn: () => Promise<any>,
  delay: number = 0
) => {
  return new Promise((resolve) => {
    if (delay > 0) {
      setTimeout(() => {
        importFn().then(resolve);
      }, delay);
    } else {
      importFn().then(resolve);
    }
  });
};

// Intersection Observer for lazy loading
export const createLazyObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);
};

// Resource hints
export const addResourceHint = (
  url: string,
  rel: 'prefetch' | 'preload' | 'preconnect' | 'dns-prefetch',
  as?: string
) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  if (as) link.as = as;
  document.head.appendChild(link);
};