import React from 'react';
import { BarChart3 } from 'lucide-react';
import { microAreas } from '../../data/demoData.js';
import SectionTitle from '../common/SectionTitle.jsx';

export default function AreaIntelligence() {
  return (
    <section className="area-lab" id="area">
      <SectionTitle icon={<BarChart3 size={16} />} eyebrow="Nalasopara area intelligence" title="Micro-market view for faster decisions." />
      <div className="area-grid">
        {microAreas.map((area) => (
          <article key={area.name}>
            <div>
              <strong>{area.name}</strong>
              <span>{area.demand}% interest</span>
            </div>
            <div className="demand-bar"><span style={{ width: `${area.demand}%` }} /></div>
            <p>{area.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
