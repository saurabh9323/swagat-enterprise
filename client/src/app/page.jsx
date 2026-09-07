import React from 'react';
import PublicLayout from '../layouts/PublicLayout.jsx';
import HomeClient from '../components/public/HomeClient.jsx';
import { fetchPublicProperties } from '../services/serverApi.js';
import { defaultSeo, fallbackSeoImage, siteUrl } from '../constants/seo.js';
import { localBusinessJsonLd, websiteJsonLd } from '../utils/seo.js';

export const metadata = {
  title: 'Swagat Enterprise | Real Estate in Nalasopara East',
  description: defaultSeo.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Swagat Enterprise | Real Estate in Nalasopara East',
    description: defaultSeo.description,
    url: `${siteUrl}/`,
    images: [{ url: fallbackSeoImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swagat Enterprise | Real Estate in Nalasopara East',
    description: defaultSeo.description,
    images: [fallbackSeoImage],
  },
};

export default async function Home() {
  const properties = await fetchPublicProperties();

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusinessJsonLd(), websiteJsonLd()]) }} />
      <HomeClient initialProperties={properties} />
    </PublicLayout>
  );
}
