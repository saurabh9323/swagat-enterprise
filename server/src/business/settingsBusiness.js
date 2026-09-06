import * as settingsService from '../services/settingsService.js';

export function defaultTheme() {
  return settingsService.defaultTheme;
}

export async function getTheme(request) {
  if (!request.app.locals.databaseReady) return settingsService.defaultTheme;
  return settingsService.getTheme();
}

export async function saveTheme(payload, user, request) {
  const theme = {
    ...settingsService.defaultTheme,
    ...payload,
  };

  if (!request.app.locals.databaseReady) return theme;
  return settingsService.saveTheme(theme, user.id);
}
