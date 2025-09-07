// lib/gtag.ts
export const GA_TRACKING_ID = "G-72X4P93JFJ";

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({
  action,
  params,
}: {
  action: string;
  params?: Record<string, any>;
}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, params);
  }
};