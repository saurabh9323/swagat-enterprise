import React from 'react';
import { usePropertyDesk } from './hooks/usePropertyDesk.js';
import { useThemeSettings } from './hooks/useThemeSettings.js';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  const desk = usePropertyDesk();
  const themeSettings = useThemeSettings();
  return <AppRouter desk={desk} themeSettings={themeSettings} />;
}
