import React from 'react';
import { Building2, MapPin, ShieldCheck } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { owner } from '../../../constants/business.js';

export default function AboutPage() {
  return (
    <section className="page-shell about-page">
      <SectionTitle icon={<Building2 size={16} />} eyebrow="About Swagat Enterprise" title="Local real estate services in Nalasopara East." />
      <div className="content-panel">
        <p>
          {owner.business} is a local real estate desk owned by {owner.proprietor}, serving property
          customers around Ostwal Nagari, 90 Feet Road, Achole Road and nearby Nalasopara East pockets.
        </p>
        <div className="about-facts">
          <span><ShieldCheck size={18} /> Sole owner: {owner.proprietor}</span>
          <span><MapPin size={18} /> {owner.address}</span>
        </div>
      </div>
    </section>
  );
}
