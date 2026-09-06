const ADMIN_SESSION_KEY = 'swagat_owner_session';

export function isAdminUnlocked() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
}

export function unlockAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
}

export function lockAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
