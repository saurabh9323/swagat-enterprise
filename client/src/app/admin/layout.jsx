import React from 'react';
import AdminLayoutShell from '../../components/admin/AdminLayoutShell.jsx';

export const metadata = {
  title: 'Swagat Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
