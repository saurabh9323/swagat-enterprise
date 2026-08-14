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
import Seo from '../../../components/seo/Seo.jsx';
import { localBusinessJsonLd, websiteJsonLd } from '../../../utils/seo.js';

export default function HomePage({ properties, stats, onLead }) {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  return (
    <>
      <Seo
        path="/"
        title="Swagat Enterprise | Real Estate in Nalasopara East"
        description="Swagat Enterprise provides real estate services and property references in Nalasopara East, Vasai-Virar, including flats, rentals, resale properties and commercial spaces."
        image={selectedProperty?.image}
        jsonLd={[localBusinessJsonLd(), websiteJsonLd()]}
      />
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
