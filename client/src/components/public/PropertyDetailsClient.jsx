'use client';

import React from 'react';
import PropertyDetailsPage from '../../views/public/PropertyDetails/PropertyDetailsPage.jsx';
import { usePropertyDesk } from '../../hooks/usePropertyDesk.js';

export default function PropertyDetailsClient({ initialProperties, propertyId }) {
  const desk = usePropertyDesk({ properties: initialProperties });
  return <PropertyDetailsPage properties={desk.properties} onLead={desk.addLead} propertyId={propertyId} />;
}
