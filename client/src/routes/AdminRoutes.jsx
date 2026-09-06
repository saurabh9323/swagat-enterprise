import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminGate />}>
        <Route element={<AdminLayout onAddProperty={() => navigate('/admin/properties/new')} />}>
          <Route index element={<AdminDashboardPage stats={desk.stats} leads={desk.leads} properties={desk.properties} />} />
          <Route path="properties" element={<AdminPropertiesPage properties={desk.properties} onCreateProperty={desk.addProperty} />} />
          <Route path="properties/new" element={<AdminPropertyNewPage onCreateProperty={desk.addProperty} />} />
          <Route path="properties/:id/edit" element={<AdminPropertyEditPage properties={desk.properties} onUpdateProperty={desk.updateProperty} />} />
          <Route path="leads" element={<AdminLeadsPage leads={desk.leads} onCreateLead={desk.addLeadFromForm} onMoveLead={desk.updateLeadStage} />} />
          <Route path="deals" element={<AdminDealsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<NotFoundPage variant="admin" />} />
        </Route>
      </Route>
    </Routes>
  );
}
