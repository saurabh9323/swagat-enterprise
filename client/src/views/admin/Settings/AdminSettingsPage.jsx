import React from 'react';
import SecuritySettingsPanel from '../../../components/admin/SecuritySettingsPanel.jsx';
import ThemeSettingsPanel from '../../../components/admin/ThemeSettingsPanel.jsx';

export default function AdminSettingsPage({ theme, onThemeChange, onSaveTheme, onResetTheme }) {
  return (
    <div className="settings-stack">
      <ThemeSettingsPanel
        theme={theme}
        onChange={onThemeChange}
        onSave={onSaveTheme}
        onReset={onResetTheme}
      />
      <SecuritySettingsPanel />
    </div>
  );
}
