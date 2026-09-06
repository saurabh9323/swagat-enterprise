import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { hasAdminToken } from '../services/api.js';
import { isAdminUnlocked } from '../utils/adminAuth.js';

export default function AdminGate() {
  const location = useLocation();

  if (!isAdminUnlocked() || !hasAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
