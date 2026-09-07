'use client';

import React, { Suspense } from 'react';
import AdminLoginPage from '../../../views/admin/Login/AdminLoginPage.jsx';

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
