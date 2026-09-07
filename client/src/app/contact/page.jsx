import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import ContactPage from '../../views/public/Contact/ContactPage.jsx';
import { siteUrl } from '../../constants/seo.js';

export const metadata = {
  title: 'Contact Swagat Enterprise | Nalasopara East Real Estate',
  description: 'Contact Swagat Enterprise for flats, rentals, resale properties and commercial property references in Nalasopara East, Vasai-Virar.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Swagat Enterprise | Nalasopara East Real Estate',
    description: 'Call, WhatsApp or visit Swagat Enterprise in Nalasopara East for local real estate support.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
};

export default function Contact() {
  return (
    <PublicLayout>
      <ContactPage />
    </PublicLayout>
  );
}
