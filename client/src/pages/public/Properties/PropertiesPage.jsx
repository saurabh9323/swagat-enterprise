import React, { useState } from 'react';
import PropertyExplorer from '../../../components/public/PropertyExplorer.jsx';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { Home } from 'lucide-react';
import Seo from '../../../components/seo/Seo.jsx';
import { breadcrumbJsonLd } from '../../../utils/seo.js';

export default function PropertiesPage({ properties, onLead }) {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <section className="page-shell">
      <Seo
        path="/properties"
        title="Properties in Nalasopara East | Swagat Enterprise"
        description="Browse Swagat Enterprise property references for flats, rentals, resale properties and commercial spaces in Nalasopara East and nearby local areas."
        image={selectedProperty?.image}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
        ])}
      />
      <SectionTitle icon={<Home size={16} />} eyebrow="Property references" title="Properties in Nalasopara East" level={1} />
      {selectedProperty && (
        <div className="page-highlight">
          <img src={selectedProperty.image} alt={`${selectedProperty.title} in ${selectedProperty.location}`} loading="eager" />
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
