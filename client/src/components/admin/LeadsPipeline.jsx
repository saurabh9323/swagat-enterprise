import React from 'react';
import LeadCard from '../lead/LeadCard.jsx';

const leadStages = ['New', 'Contacted', 'Visit Booked', 'Negotiation', 'Won', 'Lost'];

function leadStage(lead) {
  return lead.status || lead.stage || 'New';
}

export default function LeadsPipeline({ leads, onMoveLead, onEditLead, onDeleteLead }) {
  return (
    <section className="kanban-board" aria-label="Lead Kanban board">
      {leadStages.map((stage, stageIndex) => {
        const stageLeads = leads.filter((lead) => leadStage(lead) === stage || (!lead.status && !lead.stage && stage === 'New'));

        return (
          <div className="panel pipeline-column" key={stage}>
            <div className="panel-title">
              <h2>{stage}</h2>
              <span className="pill">{stageLeads.length}</span>
            </div>
            <div className="kanban-stack">
              {stageLeads.map((lead, index) => (
                <LeadCard
                  lead={lead}
                  key={lead.id || `${lead.name}-${index}`}
                  canMoveBack={stageIndex > 0}
                  canMoveNext={stageIndex < leadStages.length - 1}
                  onMove={(direction) => onMoveLead(lead.id, leadStages[stageIndex + direction])}
                  onEdit={() => onEditLead(lead)}
                  onDelete={() => onDeleteLead(lead.id)}
                />
              ))}
              {stageLeads.length === 0 && <p className="empty-column">No leads here</p>}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export { leadStages };
