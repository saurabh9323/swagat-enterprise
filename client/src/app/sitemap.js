import { siteUrl } from '../constants/seo.js';
import { fetchPublicProperties } from '../services/serverApi.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap() {
  const now = new Date();
  const properties = await fetchPublicProperties();
  const publicRoutes = ['/', '/properties', '/about', '/contact'].map((path) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/properties' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const propertyRoutes = properties.map((property) => ({
    url: `${siteUrl}/properties/${property.id}`,
    lastModified: property.updatedAt ? new Date(property.updatedAt) : now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...publicRoutes, ...propertyRoutes];
}
