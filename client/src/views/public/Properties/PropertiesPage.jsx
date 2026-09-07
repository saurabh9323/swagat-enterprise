'use client';

import React, { useState } from 'react';
import PropertyExplorer from '../../../components/public/PropertyExplorer.jsx';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { Home } from 'lucide-react';
import { getPrimaryPropertyImage } from '../../../utils/propertyImages.js';

export default function PropertiesPage({ properties, onLead }) {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const selectedImage = getPrimaryPropertyImage(selectedProperty);

  return (
    <section className="page-shell">
      <SectionTitle icon={<Home size={16} />} eyebrow="Property references" title="Properties in Nalasopara East" level={1} />
      {selectedProperty && (
        <div className="page-highlight">
          <img src={selectedImage} alt={`${selectedProperty.title} in ${selectedProperty.location}`} loading="eager" />
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
