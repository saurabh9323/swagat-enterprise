import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { services } from '../../data/demoData.js';

export default function ServicesBand() {
  return (
    <section className="services-band" aria-label="Swagat Enterprise services">
      {services.map((service) => (
        <article key={service.title}>
          <CheckCircle2 size={20} />
          <strong>{service.title}</strong>
          <p>{service.text}</p>
        </article>
      ))}
    </section>
  );
}
