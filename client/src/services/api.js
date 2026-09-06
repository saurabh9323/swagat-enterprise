const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_TOKEN_KEY = 'swagat_admin_token';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }

  return data?.data ?? data;
}

export function setAdminToken(token) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function hasAdminToken() {
  return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  verifyLoginOtp: (payload) => request('/auth/login/otp', { method: 'POST', body: JSON.stringify(payload) }),
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
  updateLeadStatus: (id, status) => request(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
