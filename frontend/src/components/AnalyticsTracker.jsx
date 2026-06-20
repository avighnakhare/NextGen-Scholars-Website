import { useEffect } from 'react';

export default function AnalyticsTracker({ currentPage }) {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'pageview',
            url: `/${currentPage}`,
            referrer: document.referrer || 'direct'
          })
        });
      } catch (err) {
        // Fail silently in development
        console.debug('Analytics capture error:', err.message);
      }
    };

    trackPageView();
  }, [currentPage]);

  return null;
}
