declare global {
  interface Window {
    gtag: (
      command: string,
      ...args: any[]
    ) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', import.meta.env.PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};
