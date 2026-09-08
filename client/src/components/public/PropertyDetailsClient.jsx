'use client';

import React from 'react';
import PropertyDetailsPage from '../../views/public/PropertyDetails/PropertyDetailsPage.jsx';
import { usePropertyDesk } from '../../hooks/usePropertyDesk.js';

export default function PropertyDetailsClient({ initialProperty, propertyId }) {
  const desk = usePropertyDesk({
    properties: initialProperty ? [initialProperty] : [],
    refreshOnMount: false,
    loadLeadsOnMount: false,
  });
  return <PropertyDetailsPage properties={desk.properties} onLead={desk.addLead} propertyId={propertyId} />;
}
