const LOCAL_API_URL = 'http://localhost:5000/api';
const PRODUCTION_API_URL = 'https://swagat-enterprise.onrender.com/api';

function resolveApiBaseUrl() {
  const envApiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (typeof window === 'undefined') {
    return envApiUrl || PRODUCTION_API_URL;
  }

  const hostname = window.location.hostname;
  const isLocalApp = hostname === 'localhost' || hostname === '127.0.0.1';

  if (envApiUrl && (isLocalApp || !envApiUrl.includes('localhost'))) {
    return envApiUrl;
  }

  return isLocalApp ? LOCAL_API_URL : PRODUCTION_API_URL;
}

const API_BASE_URL = resolveApiBaseUrl();
const ADMIN_TOKEN_KEY = 'swagat_admin_token';

export class ApiRequestError extends Error {
  constructor(message, { status, details, path } = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
    this.path = path;
  }
}

function responseMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((error) => error.message || error.path || String(error))
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
  }
  return fallback;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(responseMessage(data, 'API request failed'), {
      status: response.status,
      details: data,
      path,
    });
  }

  return data?.data ?? data;
}

export function setAdminToken(token) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function hasAdminToken() {
  if (typeof window === 'undefined') return false;
  return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  requestLoginOtp: (payload) => request('/auth/otp/request', { method: 'POST', body: JSON.stringify(payload) }),
  verifyLoginOtp: (payload) => request('/auth/login/otp', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value);
    });
    const query = params.toString();
    return request(`/users${query ? `?${query}` : ''}`);
  },
  createUser: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getProperties: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value);
    });
    const query = params.toString();
    return request(`/properties${query ? `?${query}` : ''}`);
  },
  getProperty: (id) => request(`/properties/${id}`),
  createProperty: (payload) => request('/properties', { method: 'POST', body: JSON.stringify(payload) }),
  updateProperty: (id, payload) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePropertyStatus: (id, status) => request(`/properties/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteProperty: (id) => request(`/properties/${id}`, { method: 'DELETE' }),
  createLead: (payload) => request('/leads', { method: 'POST', body: JSON.stringify(payload) }),
  getLeads: () => request('/leads'),
  updateLead: (id, payload) => request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateLeadStatus: (id, status) => request(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
  getTheme: () => request('/settings/theme'),
  updateTheme: (payload) => request('/settings/theme', { method: 'PUT', body: JSON.stringify(payload) }),
};
