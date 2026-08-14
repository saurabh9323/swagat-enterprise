const ADMIN_SESSION_KEY = 'swagat_owner_session';
const OWNER_PIN = '5289';

export function isAdminUnlocked() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
}

export function unlockAdmin(pin) {
  if (pin.trim() !== OWNER_PIN) {
    return false;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
  return true;
}

export function lockAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
