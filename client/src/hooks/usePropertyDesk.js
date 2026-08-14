import { useMemo, useState } from 'react';
import { initialProperties, seedLeads } from '../data/demoData.js';
import { currency } from '../utils/format.js';
import { getPortfolioStats } from '../utils/property.js';

export function usePropertyDesk() {
  const [properties, setProperties] = useState(initialProperties);
  const [leads, setLeads] = useState(seedLeads);

  const stats = useMemo(() => getPortfolioStats(properties, leads), [properties, leads]);

  function addLead(property, name = 'New Swagat inquiry') {
    setLeads((current) => [
      {
        name,
        need: `${property.type} in ${property.location}`,
        budget: currency(property.price, property.intent),
        stage: 'Call within 30 minutes',
        priority: property.score > 93 ? 'Hot' : 'Warm',
        source: 'Website',
      },
      ...current,
    ]);
  }

  function addDemoProperty() {
    setProperties((current) => [
      {
        id: `SE-NAL-${100 + current.length + 1}`,
        title: 'New owner reference from Nalasopara',
        location: 'Blossom Apartment Area',
        price: 3950000,
        type: '1 BHK',
        area: 560,
        status: 'Owner Direct',
        intent: 'Sale',
        score: 90,
        commission: 79000,
        walkTime: 'Near Swagat Enterprise office',
        tags: ['Fresh Lead', 'Photo Pending', 'Site Visit Ready'],
        image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      },
      ...current,
    ]);
  }

  return {
    properties,
    leads,
    stats,
    addLead,
    addDemoProperty,
  };
}
