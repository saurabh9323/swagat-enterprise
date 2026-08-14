import React, { useState } from 'react';
import AreaIntelligence from '../../../components/public/AreaIntelligence.jsx';
import CustomerJourney from '../../../components/public/CustomerJourney.jsx';
import FloatingContact from '../../../components/public/FloatingContact.jsx';
import HeroSection from '../../../components/public/HeroSection.jsx';
import LocalityMarquee from '../../../components/public/LocalityMarquee.jsx';
import OfficeContact from '../../../components/public/OfficeContact.jsx';
import PropertyExplorer from '../../../components/public/PropertyExplorer.jsx';
import QuickStats from '../../../components/public/QuickStats.jsx';
import ServicesBand from '../../../components/public/ServicesBand.jsx';

export default function HomePage({ properties, stats, onLead }) {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <>
      <HeroSection selectedProperty={selectedProperty} />
      <LocalityMarquee />
      <QuickStats stats={stats} />
      <PropertyExplorer properties={properties} onLead={onLead} onPreview={setSelectedProperty} />
      <ServicesBand />
      <CustomerJourney />
      <AreaIntelligence />
      <OfficeContact />
      <FloatingContact />
    </>
  );
}
