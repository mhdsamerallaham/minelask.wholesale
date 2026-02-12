export function reportWebVitals({
  id,
  name,
  label,
  value,
}: {
  id: string;
  name: string;
  label: string;
  value: number;
}) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, Vercel Analytics, or custom endpoint
    console.log(`[Web Vitals] ${name}: ${value}ms`);
    
    // You can send this data to your analytics service
    // Example for Vercel Analytics:
    // if (window.va) {
    //   window.va('event', {
    //     name: `web-vital-${name}`,
    //     data: {
    //       value,
    //       id,
    //       label,
    //     },
    //   });
    // }
  }
}

// Performance monitoring utility
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`[Performance] ${name}: ${end - start}ms`);
      });
    } else {
      const end = performance.now();
      console.log(`[Performance] ${name}: ${end - start}ms`);
      return result;
    }
  }
  
  return fn();
}
