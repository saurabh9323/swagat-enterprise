import React from 'react';
import { usePropertyDesk } from './hooks/usePropertyDesk.js';
import { useThemeSettings } from './hooks/useThemeSettings.js';
import { ToastProvider } from './components/common/ToastProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  const desk = usePropertyDesk();
  const themeSettings = useThemeSettings();
  return (
    <ToastProvider>
      <AppRouter desk={desk} themeSettings={themeSettings} />
    </ToastProvider>
  );
}
