import React from 'react';
import LeadCard from '../lead/LeadCard.jsx';

const leadStages = ['Hot', 'Warm', 'New'];

export default function LeadsPipeline({ leads }) {
  return (
    <section className="pipeline">
      {leadStages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.priority === stage);
        return (
          <div className="panel pipeline-column" key={stage}>
            <div className="panel-title">
              <h2>{stage}</h2>
              <span className="pill">{stageLeads.length}</span>
            </div>
            {stageLeads.map((lead, index) => (
              <LeadCard lead={lead} key={`${lead.name}-${index}`} />
            ))}
          </div>
        );
      })}
    </section>
  );
}
