import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactLinks from '../../../components/common/ContactLinks.jsx';
import SectionTitle from '../../../components/common/SectionTitle.jsx';
import { owner } from '../../../constants/business.js';
import Seo from '../../../components/seo/Seo.jsx';
import { breadcrumbJsonLd, localBusinessJsonLd } from '../../../utils/seo.js';

export default function ContactPage() {
  return (
    <section className="page-shell contact-page">
      <Seo
        path="/contact"
        title="Contact Swagat Enterprise | Nalasopara East Real Estate"
        description="Contact Swagat Enterprise for real estate services and property references from Shop No 10, A Wing, Blossom Apartment, 90 Feet Road, Ostwal Nagari, Nalasopara East."
        jsonLd={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <SectionTitle icon={<Phone size={16} />} eyebrow="Contact" title="Contact Swagat Enterprise" level={1} />
      <div className="contact-route-grid">
        <div className="content-panel">
          <p><Phone size={18} /> {owner.mobile}</p>
          <p><Mail size={18} /> {owner.email}</p>
          <p><MapPin size={18} /> {owner.address}</p>
        </div>
        <ContactLinks message={`Hi, I want to enquire about properties with ${owner.business}.`} />
      </div>
    </section>
  );
}
