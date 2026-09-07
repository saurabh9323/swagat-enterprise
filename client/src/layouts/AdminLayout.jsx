'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';
import LogoLockup from '../components/common/LogoLockup.jsx';

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const title = titles[pathname] || (pathname.includes('/edit') ? 'Edit property reference' : 'Admin workspace');

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <main className="admin-app">
      <header className="admin-mobile-bar">
        <LogoLockup href="/admin" title="Swagat Admin" subtitle="Owner desk" />
        <button
          className="admin-menu-button"
          type="button"
          aria-label={isSidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen((value) => !value)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      <button
        className={`admin-sidebar-scrim${isSidebarOpen ? ' show' : ''}`}
        type="button"
        aria-label="Close admin menu"
        onClick={() => setIsSidebarOpen(false)}
      />
      <AdminSidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
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
