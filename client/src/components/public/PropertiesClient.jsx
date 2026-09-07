'use client';

import React from 'react';
import PropertiesPage from '../../views/public/Properties/PropertiesPage.jsx';
import { usePropertyDesk } from '../../hooks/usePropertyDesk.js';

export default function PropertiesClient({ initialProperties }) {
  const desk = usePropertyDesk({ properties: initialProperties });
  return <PropertiesPage properties={desk.properties} onLead={desk.addLead} />;
}
