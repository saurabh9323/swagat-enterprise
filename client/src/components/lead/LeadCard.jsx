import React from 'react';
import { ArrowLeft, ArrowRight, Phone, Sparkles } from 'lucide-react';

export default function LeadCard({ lead, onMove, canMoveBack, canMoveNext }) {
  return (
    <article className="lead-card">
      <div className="lead-card-head">
        <strong>{lead.name || lead.customerName}</strong>
        <span>{lead.priority || 'Warm'}</span>
      </div>
      <div className="lead-type-row">
        <b>{lead.leadType || 'Buyer'}</b>
        <small>{lead.propertyType || 'Property open'}</small>
      </div>
      <span>{lead.need || 'Requirement pending'}</span>
      <small>{lead.preferredLocation || 'Location open'}{lead.timeline ? ` · ${lead.timeline}` : ''}</small>
      <p>{lead.stage || lead.status || 'New'}</p>
      <div>
        <small>{lead.source || 'Admin'}</small>
        <small>{lead.budget || 'Budget open'}</small>
      </div>
      <div className="lead-actions">
        <button type="button" onClick={() => onMove(-1)} disabled={!canMoveBack} aria-label="Move lead back"><ArrowLeft size={15} /></button>
        {lead.phone && <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name || lead.customerName}`}><Phone size={15} /></a>}
        <button type="button" onClick={() => onMove(1)} disabled={!canMoveNext} aria-label="Move lead forward"><ArrowRight size={15} /></button>
      </div>
      <span className="lead-signal"><Sparkles size={13} /> Follow up today</span>
    </article>
  );
}
