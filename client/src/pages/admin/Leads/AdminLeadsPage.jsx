import React, { useState } from 'react';
import LeadCaptureForm from '../../../components/admin/LeadCaptureForm.jsx';
import LeadsPipeline from '../../../components/admin/LeadsPipeline.jsx';

export default function AdminLeadsPage({ leads, onCreateLead, onUpdateLead, onDeleteLead, onMoveLead }) {
  const [editingLead, setEditingLead] = useState(null);

  async function handleSubmit(payload) {
    if (editingLead) {
      await onUpdateLead(editingLead.id, payload);
      setEditingLead(null);
      return;
    }

    await onCreateLead(payload);
  }

  return (
    <section className="lead-workspace">
      <div className="panel">
        <LeadCaptureForm
          key={editingLead?.id || 'new-lead'}
          initialValue={editingLead}
          onSubmit={handleSubmit}
          submitLabel={editingLead ? 'Update lead' : 'Save lead'}
          onCancel={editingLead ? () => setEditingLead(null) : null}
        />
      </div>
      <LeadsPipeline leads={leads} onMoveLead={onMoveLead} onEditLead={setEditingLead} onDeleteLead={onDeleteLead} />
    </section>
  );
}
