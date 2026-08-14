import React from 'react';
import DashboardView from '../../../components/admin/DashboardView.jsx';

export default function AdminDashboardPage({ stats, leads }) {
  const hotLeads = leads.filter((lead) => lead.priority === 'Hot').length;
  return <DashboardView stats={stats} hotLeads={hotLeads} />;
}
