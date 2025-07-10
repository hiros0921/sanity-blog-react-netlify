// Critical CSS for above-the-fold content
export const CriticalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      /* Critical CSS for immediate render */
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
      }
      
      .min-h-screen {
        min-height: 100vh;
      }
      
      .bg-gradient-to-br {
        background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
      }
      
      .from-gray-900 {
        --tw-gradient-from: #111827;
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      
      .via-blue-900 {
        --tw-gradient-via: #1e3a8a;
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to);
      }
      
      .to-purple-900 {
        --tw-gradient-to: #581c87;
      }
      
      /* Prevent layout shift */
      img {
        aspect-ratio: attr(width) / attr(height);
      }
      
      /* Skeleton loader animation */
      @keyframes skeleton-loading {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      .skeleton {
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
    `
  }} />
);