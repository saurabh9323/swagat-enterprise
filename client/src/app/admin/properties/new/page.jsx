'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminPropertyNewPage from '../../../../views/admin/Properties/AdminPropertyNewPage.jsx';
import { useAdminDesk } from '../../../../contexts/AdminDeskContext.jsx';

export default function AdminPropertyNew() {
  const router = useRouter();
  const { desk } = useAdminDesk();

  async function createProperty(payload) {
    await desk.addProperty(payload);
    router.push('/admin/properties');
  }

  return <AdminPropertyNewPage onCreateProperty={createProperty} />;
}
