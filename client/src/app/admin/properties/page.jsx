'use client';

import React from 'react';
import AdminPropertiesPage from '../../../views/admin/Properties/AdminPropertiesPage.jsx';
import { useAdminDesk } from '../../../contexts/AdminDeskContext.jsx';

export default function AdminProperties() {
  const { desk } = useAdminDesk();
  return <AdminPropertiesPage properties={desk.properties} onCreateProperty={desk.addProperty} onDeleteProperty={desk.deleteProperty} />;
}
