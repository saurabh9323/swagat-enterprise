'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminPropertyEditPage from '../../../../../views/admin/Properties/AdminPropertyEditPage.jsx';
import { useAdminDesk } from '../../../../../contexts/AdminDeskContext.jsx';

export default function AdminPropertyEdit({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { desk } = useAdminDesk();

  async function updateProperty(id, payload) {
    await desk.updateProperty(id, payload);
    router.push('/admin/properties');
  }

  return (
    <AdminPropertyEditPage
      propertyId={resolvedParams.id}
      properties={desk.properties}
      onUpdateProperty={updateProperty}
    />
  );
}
