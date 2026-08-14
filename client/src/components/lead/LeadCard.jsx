import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function LeadCard({ lead }) {
  return (
    <article className="lead-card">
      <strong>{lead.name}</strong>
      <span>{lead.need}</span>
      <p>{lead.stage}</p>
      <div>
        <small>{lead.source}</small>
        <ChevronRight size={16} />
      </div>
    </article>
  );
}
