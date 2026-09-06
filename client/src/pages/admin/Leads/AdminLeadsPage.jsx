import React from 'react';
import LeadCaptureForm from '../../../components/admin/LeadCaptureForm.jsx';
import LeadsPipeline from '../../../components/admin/LeadsPipeline.jsx';

export default function AdminLeadsPage({ leads, onCreateLead, onMoveLead }) {
  return (
    <section className="lead-workspace">
      <div className="panel">
        <LeadCaptureForm onSubmit={onCreateLead} />
      </div>
      <LeadsPipeline leads={leads} onMoveLead={onMoveLead} />
    </section>
  );
}
