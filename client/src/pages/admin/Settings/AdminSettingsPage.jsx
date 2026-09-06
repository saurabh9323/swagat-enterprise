import React from 'react';
import ThemeSettingsPanel from '../../../components/admin/ThemeSettingsPanel.jsx';

export default function AdminSettingsPage({ theme, onThemeChange, onSaveTheme, onResetTheme }) {
  return (
    <ThemeSettingsPanel
      theme={theme}
      onChange={onThemeChange}
      onSave={onSaveTheme}
      onReset={onResetTheme}
    />
  );
}
