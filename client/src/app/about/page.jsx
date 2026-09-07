import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import AboutPage from '../../views/public/About/AboutPage.jsx';
import { siteUrl } from '../../constants/seo.js';

export const metadata = {
  title: 'About Swagat Enterprise | Real Estate Services in Nalasopara East',
  description: 'Learn about Swagat Enterprise, a real estate service desk owned by Satish Pathak for property references in Nalasopara East, Vasai-Virar and nearby areas.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Swagat Enterprise | Real Estate Services in Nalasopara East',
    description: 'Learn about Swagat Enterprise and its local real estate services in Nalasopara East.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
};

export default function About() {
  return (
    <PublicLayout>
      <AboutPage />
    </PublicLayout>
  );
}
