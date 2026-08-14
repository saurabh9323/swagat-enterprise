import React from 'react';

export default function NoIndex({ title = 'Admin | Swagat Enterprise' }) {
  React.useEffect(() => {
    document.title = title;

    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');

    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelectorAll('script[data-seo-json-ld="true"]').forEach((script) => script.remove());
  }, [title]);

  return null;
}
