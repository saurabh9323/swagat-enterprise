import React from 'react';
import { Building2, MapPin, ShieldCheck } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { owner } from '../../../constants/business.js';
import Seo from '../../../components/seo/Seo.jsx';
import { breadcrumbJsonLd, localBusinessJsonLd } from '../../../utils/seo.js';

export default function AboutPage() {
  return (
    <section className="page-shell about-page">
      <Seo
        path="/about"
        title="About Swagat Enterprise | Real Estate Services in Nalasopara East"
        description="Learn about Swagat Enterprise, a local real estate desk owned by Satish Pathak and serving property customers around Nalasopara East, Ostwal Nagari, 90 Feet Road and Achole Road."
        jsonLd={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <SectionTitle icon={<Building2 size={16} />} eyebrow="About Swagat Enterprise" title="Local real estate services in Nalasopara East" level={1} />
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
