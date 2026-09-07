import { initialProperties } from '../data/demoData.js';

const PRODUCTION_API_URL = 'https://swagat-enterprise.onrender.com/api';
const PUBLIC_FETCH_TIMEOUT_MS = 8000;

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL).replace(/\/$/, '');
}

function readApiData(data) {
  return data?.data ?? data;
}

function isPublicProperty(property) {
  return property?.id && property.isActive !== false && property.status !== 'Inactive';
}

async function fetchFromApi(path) {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(PUBLIC_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) return null;
  return readApiData(await response.json().catch(() => null));
}

export async function fetchPublicProperties() {
  try {
    const properties = await fetchFromApi('/properties');
    if (!Array.isArray(properties) || !properties.length) return initialProperties;
    return properties.filter(isPublicProperty);
  } catch (_error) {
    return initialProperties;
  }
}

export async function fetchPublicProperty(id) {
  try {
    const property = await fetchFromApi(`/properties/${encodeURIComponent(id)}`);
    if (isPublicProperty(property)) return property;
  } catch (_error) {
    // Fall back to the list endpoint or static demo data below.
  }

  const properties = await fetchPublicProperties();
  return properties.find((property) => property.id === id) || null;
}
