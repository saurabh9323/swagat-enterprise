'use client';

import React from 'react';
import AdminLeadsPage from '../../../views/admin/Leads/AdminLeadsPage.jsx';
import { useAdminDesk } from '../../../contexts/AdminDeskContext.jsx';

export default function AdminLeads() {
  const { desk } = useAdminDesk();
  return (
    <AdminLeadsPage
      leads={desk.leads}
      onCreateLead={desk.addLeadFromForm}
      onUpdateLead={desk.updateLead}
      onDeleteLead={desk.deleteLead}
      onMoveLead={desk.updateLeadStage}
    />
  );
}
