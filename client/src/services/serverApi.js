import { initialProperties } from '../data/demoData.js';

const PRODUCTION_API_URL = 'https://swagat-enterprise.onrender.com/api';

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL).replace(/\/$/, '');
}

export async function fetchPublicProperties() {
  try {
    const response = await fetch(`${apiBaseUrl()}/properties`, {
      cache: 'no-store',
    });

    if (!response.ok) return initialProperties;

    const data = await response.json();
    return Array.isArray(data) && data.length ? data : initialProperties;
  } catch (_error) {
    return initialProperties;
  }
}

export async function fetchPublicProperty(id) {
  const properties = await fetchPublicProperties();
  return properties.find((property) => property.id === id) || null;
}
