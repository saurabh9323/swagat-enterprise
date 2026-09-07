import { siteUrl } from '../constants/seo.js';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
