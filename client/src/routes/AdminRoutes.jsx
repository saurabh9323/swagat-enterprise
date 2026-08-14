import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminGate from './AdminGate.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminDashboardPage from '../pages/admin/Dashboard/AdminDashboardPage.jsx';
import AdminDealsPage from '../pages/admin/Deals/AdminDealsPage.jsx';
import AdminLeadsPage from '../pages/admin/Leads/AdminLeadsPage.jsx';
import AdminLoginPage from '../pages/admin/Login/AdminLoginPage.jsx';
import AdminPropertiesPage from '../pages/admin/Properties/AdminPropertiesPage.jsx';
import AdminPropertyEditPage from '../pages/admin/Properties/AdminPropertyEditPage.jsx';
import AdminPropertyNewPage from '../pages/admin/Properties/AdminPropertyNewPage.jsx';
import AdminSettingsPage from '../pages/admin/Settings/AdminSettingsPage.jsx';
import NotFoundPage from '../pages/public/NotFound/NotFoundPage.jsx';

export default function AdminRoutes({ desk }) {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminGate />}>
        <Route element={<AdminLayout onAddProperty={desk.addDemoProperty} />}>
          <Route index element={<AdminDashboardPage stats={desk.stats} leads={desk.leads} />} />
          <Route path="properties" element={<AdminPropertiesPage properties={desk.properties} onAddProperty={desk.addDemoProperty} />} />
          <Route path="properties/new" element={<AdminPropertyNewPage onAddProperty={desk.addDemoProperty} />} />
          <Route path="properties/:id/edit" element={<AdminPropertyEditPage properties={desk.properties} />} />
          <Route path="leads" element={<AdminLeadsPage leads={desk.leads} />} />
          <Route path="deals" element={<AdminDealsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<NotFoundPage variant="admin" />} />
        </Route>
      </Route>
    </Routes>
  );
}
