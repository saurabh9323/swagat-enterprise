'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { AdminDeskProvider, useAdminDesk } from '../../contexts/AdminDeskContext.jsx';
import AdminGate from '../../routes/AdminGate.jsx';

function AdminLayoutInner({ children }) {
  const { themeSettings, saveTheme } = useAdminDesk();

  return (
    <AdminGate>
      <AdminLayout
        theme={themeSettings.theme}
        onToggleTheme={themeSettings.toggleMode}
        onSaveTheme={() => saveTheme(themeSettings.theme)}
      >
        {children}
      </AdminLayout>
    </AdminGate>
  );
}

export default function AdminLayoutShell({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminDeskProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminDeskProvider>
  );
}
