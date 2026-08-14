import React from 'react';
import { absoluteUrl, mergeSeo } from '../../utils/seo.js';

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export default function Seo({ title, description, path = '/', image, type, jsonLd = [] }) {
  React.useEffect(() => {
    const seo = mergeSeo({ title, description, image, type });
    const canonical = absoluteUrl(path);
    const imageUrl = seo.image?.startsWith('http') ? seo.image : absoluteUrl(seo.image || '/favicon.svg');
    const structuredData = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

    document.title = seo.title;
    setMeta('meta[name="description"]', { name: 'description', content: seo.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
    setLink('canonical', canonical);

    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Swagat Enterprise' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });

    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

    document.head.querySelectorAll('script[data-seo-json-ld="true"]').forEach((script) => script.remove());
    structuredData.filter(Boolean).forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonLd = 'true';
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [description, image, jsonLd, path, title, type]);

  return null;
}
