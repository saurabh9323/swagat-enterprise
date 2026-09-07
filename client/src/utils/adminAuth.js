const ADMIN_SESSION_KEY = 'swagat_owner_session';

export function isAdminUnlocked() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
}

export function unlockAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
}

export function lockAdmin() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
