import React, { useMemo, useState } from 'react';
import { WandSparkles } from 'lucide-react';
import SectionTitle from '../common/SectionTitle.jsx';
import PropertyCard from '../property/PropertyCard.jsx';
import PropertyFilters from '../property/PropertyFilters.jsx';
import { filterProperties } from '../../utils/property.js';

export default function PropertyExplorer({ properties, onLead, onPreview }) {
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState('all');

  const filtered = useMemo(() => filterProperties(properties, query, budget), [properties, query, budget]);

  return (
    <section className="finder-zone" id="properties">
      <SectionTitle icon={<WandSparkles size={16} />} eyebrow="Smart shortlist" title="Choose by pocket, not just price." />
      <PropertyFilters query={query} budget={budget} onQueryChange={setQuery} onBudgetChange={setBudget} />

      <div className="property-grid">
        {filtered.map((property, index) => (
          <PropertyCard
            property={property}
            index={index}
            key={property.id}
            onPreview={onPreview}
            onLead={onLead}
          />
        ))}
      </div>
    </section>
  );
}
