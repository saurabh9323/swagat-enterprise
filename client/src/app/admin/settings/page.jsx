'use client';

import React from 'react';
import AdminSettingsPage from '../../../views/admin/Settings/AdminSettingsPage.jsx';
import { useAdminDesk } from '../../../contexts/AdminDeskContext.jsx';

export default function AdminSettings() {
  const { themeSettings, saveTheme } = useAdminDesk();
  return (
    <AdminSettingsPage
      theme={themeSettings.theme}
      onThemeChange={themeSettings.setTheme}
      onSaveTheme={saveTheme}
      onResetTheme={themeSettings.resetTheme}
    />
  );
}
