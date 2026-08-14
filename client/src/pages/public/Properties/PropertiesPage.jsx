import React, { useState } from 'react';
import PropertyExplorer from '../../../components/public/PropertyExplorer.jsx';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { Home } from 'lucide-react';

export default function PropertiesPage({ properties, onLead }) {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <section className="page-shell">
      <SectionTitle icon={<Home size={16} />} eyebrow="Property references" title="Browse Nalasopara East properties." />
      {selectedProperty && (
        <div className="page-highlight">
          <img src={selectedProperty.image} alt={selectedProperty.title} />
          <div>
            <span>{selectedProperty.status}</span>
            <strong>{selectedProperty.title}</strong>
            <p>{selectedProperty.location}</p>
          </div>
        </div>
      )}
      <PropertyExplorer properties={properties} onLead={onLead} onPreview={setSelectedProperty} />
    </section>
  );
}
