'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';

const titles = {
  '/admin': 'Today at Swagat Enterprise',
  '/admin/properties': 'Property inventory studio',
  '/admin/properties/new': 'Add property reference',
  '/admin/leads': 'Lead pipeline board',
  '/admin/deals': 'Brokerage deals',
  '/admin/settings': 'Admin settings',
};

export default function AdminLayout({ theme, onToggleTheme, onSaveTheme, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname] || (pathname.includes('/edit') ? 'Edit property reference' : 'Admin workspace');

  return (
    <main className="admin-app">
      <AdminSidebar />
      <section className="admin-content">
        <AdminHeader
          title={title}
          theme={theme}
          onAddProperty={() => router.push('/admin/properties/new')}
          onToggleTheme={onToggleTheme}
          onSaveTheme={onSaveTheme}
        />
        {children}
      </section>
    </main>
  );
}
