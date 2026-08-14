import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { owner } from '../../constants/business.js';
import ContactLinks from '../common/ContactLinks.jsx';

export default function OfficeContact() {
  return (
    <section className="office-band" id="contact">
      <div>
        <p className="eyebrow"><ShieldCheck size={16} /> Office-backed local desk</p>
        <h2>Visit Swagat Enterprise for local property references.</h2>
        <p>{owner.address}</p>
      </div>
      <ContactLinks message={`Hi, I want to enquire about properties with ${owner.business}.`} />
    </section>
  );
}
