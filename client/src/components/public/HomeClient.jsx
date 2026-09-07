'use client';

import React from 'react';
import HomePage from '../../views/public/Home/HomePage.jsx';
import { usePropertyDesk } from '../../hooks/usePropertyDesk.js';

export default function HomeClient({ initialProperties }) {
  const desk = usePropertyDesk({ properties: initialProperties });
  return <HomePage properties={desk.properties} stats={desk.stats} onLead={desk.addLead} />;
}
