import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

export const defaultTheme = {
  mode: 'dark',
  sidebarColor: '#071512',
  navbarColor: '#10281f',
  pageColor: '#111c29',
  panelColor: '#25323b',
  accentColor: '#d8ff69',
  textColor: '#eef4f0',
};

export const lightTheme = {
  mode: 'light',
  sidebarColor: '#f7f5ee',
  navbarColor: '#ffffff',
  pageColor: '#eef3ef',
  panelColor: '#ffffff',
  accentColor: '#0f7a5f',
  textColor: '#17211d',
};

const themeStorageKey = 'swagat_theme_settings';

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme.mode;
  root.style.setProperty('--admin-sidebar', theme.sidebarColor);
  root.style.setProperty('--admin-navbar', theme.navbarColor);
  root.style.setProperty('--admin-page', theme.pageColor);
  root.style.setProperty('--admin-panel', theme.panelColor);
  root.style.setProperty('--admin-accent', theme.accentColor);
  root.style.setProperty('--admin-text', theme.textColor);
}

export function useThemeSettings() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = localStorage.getItem(themeStorageKey);
    return stored ? { ...defaultTheme, ...JSON.parse(stored) } : defaultTheme;
  });

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') localStorage.setItem(themeStorageKey, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    api.getTheme()
      .then((remoteTheme) => {
        if (!cancelled && remoteTheme) setTheme((current) => ({ ...current, ...remoteTheme }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => ({
    theme,
    setTheme,
    resetTheme: () => setTheme(defaultTheme),
    toggleMode: () => setTheme((current) => (current.mode === 'dark'
      ? { ...lightTheme, accentColor: current.accentColor }
      : { ...defaultTheme, accentColor: current.accentColor })),
  }), [theme]);
}
