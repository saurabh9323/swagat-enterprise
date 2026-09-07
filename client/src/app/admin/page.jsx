'use client';

import React from 'react';
import AdminDashboardPage from '../../views/admin/Dashboard/AdminDashboardPage.jsx';
import { useAdminDesk } from '../../contexts/AdminDeskContext.jsx';

export default function AdminDashboard() {
  const { desk } = useAdminDesk();
  return <AdminDashboardPage stats={desk.stats} leads={desk.leads} properties={desk.properties} />;
}
