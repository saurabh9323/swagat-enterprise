import React, { useState } from 'react';
import LeadCaptureForm from '../../../components/admin/LeadCaptureForm.jsx';
import LeadsPipeline from '../../../components/admin/LeadsPipeline.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';

export default function AdminLeadsPage({ leads, onCreateLead, onUpdateLead, onDeleteLead, onMoveLead }) {
  const toast = useToast();
  const [editingLead, setEditingLead] = useState(null);

  async function handleSubmit(payload) {
    if (editingLead) {
      await onUpdateLead(editingLead.id, payload);
      setEditingLead(null);
      return;
    }

    await onCreateLead(payload);
  }

  async function handleDeleteLead(leadId) {
    try {
      await onDeleteLead(leadId);
      toast.success('Lead removed from the pipeline.', 'Lead deleted');
    } catch (error) {
      toast.error(error, 'Lead could not be deleted');
    }
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
      <LeadsPipeline leads={leads} onMoveLead={onMoveLead} onEditLead={setEditingLead} onDeleteLead={handleDeleteLead} />
    </section>
  );
}
