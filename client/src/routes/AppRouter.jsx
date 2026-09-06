import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminRoutes from './AdminRoutes.jsx';
import PublicRoutes from './PublicRoutes.jsx';

export default function AppRouter({ desk, themeSettings }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes desk={desk} themeSettings={themeSettings} />} />
        <Route path="/*" element={<PublicRoutes desk={desk} />} />
      </Routes>
    </BrowserRouter>
  );
}
