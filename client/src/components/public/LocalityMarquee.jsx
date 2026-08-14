import React from 'react';
import { MapPin } from 'lucide-react';
import { microAreas } from '../../data/demoData.js';

export default function LocalityMarquee() {
  const areas = [...microAreas, ...microAreas];

  return (
    <section className="locality-marquee" aria-label="Areas served by Swagat Enterprise">
      <div>
        {areas.map((area, index) => (
          <span key={`${area.name}-${index}`}><MapPin size={15} /> {area.name}</span>
        ))}
      </div>
    </section>
  );
}
