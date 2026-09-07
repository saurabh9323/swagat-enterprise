'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { api } from '../services/api.js';
import { usePropertyDesk } from '../hooks/usePropertyDesk.js';
import { useThemeSettings } from '../hooks/useThemeSettings.js';

const AdminDeskContext = createContext(null);

export function AdminDeskProvider({ children }) {
  const desk = usePropertyDesk();
  const themeSettings = useThemeSettings();

  async function saveTheme(theme) {
    const savedTheme = await api.updateTheme(theme);
    themeSettings.setTheme((current) => ({ ...current, ...savedTheme }));
  }

  const value = useMemo(() => ({
    desk,
    themeSettings,
    saveTheme,
  }), [desk, themeSettings]);

  return (
    <AdminDeskContext.Provider value={value}>
      {children}
    </AdminDeskContext.Provider>
  );
}

export function useAdminDesk() {
  const context = useContext(AdminDeskContext);
  if (!context) throw new Error('useAdminDesk must be used inside AdminDeskProvider');
  return context;
}
