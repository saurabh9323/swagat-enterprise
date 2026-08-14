import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';
import NoIndex from '../components/seo/NoIndex.jsx';

const titles = {
  '/admin': 'Today at Swagat Enterprise',
  '/admin/properties': 'Property inventory studio',
  '/admin/properties/new': 'Add property reference',
  '/admin/leads': 'Lead pipeline board',
  '/admin/deals': 'Brokerage deals',
  '/admin/settings': 'Admin settings',
};

export default function AdminLayout({ onAddProperty }) {
  const location = useLocation();
  const title = titles[location.pathname] || (location.pathname.includes('/edit') ? 'Edit property reference' : 'Admin workspace');

  return (
    <main className="admin-app">
      <NoIndex title={`${title} | Swagat Admin`} />
      <AdminSidebar />
      <section className="admin-content">
        <AdminHeader title={title} onAddProperty={onAddProperty} />
        <Outlet />
      </section>
    </main>
  );
}
