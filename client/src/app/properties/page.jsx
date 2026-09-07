import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import PropertiesClient from '../../components/public/PropertiesClient.jsx';
import { fetchPublicProperties } from '../../services/serverApi.js';
import { fallbackSeoImage, siteUrl } from '../../constants/seo.js';
import { breadcrumbJsonLd } from '../../utils/seo.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Properties for Sale & Rent in Nalasopara East | Swagat Enterprise',
  description: 'Browse Swagat Enterprise property references for flats, rentals, resale properties and commercial spaces in Nalasopara East, Ostwal Nagari, 90 Feet Road, Achole Road and Vasai-Virar.',
  alternates: { canonical: '/properties' },
  openGraph: {
    title: 'Properties for Sale & Rent in Nalasopara East | Swagat Enterprise',
    description: 'Browse active Swagat Enterprise property references in Nalasopara East and nearby areas.',
    url: `${siteUrl}/properties`,
    images: [{ url: fallbackSeoImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties for Sale & Rent in Nalasopara East | Swagat Enterprise',
    description: 'Browse active Swagat Enterprise property references in Nalasopara East and nearby areas.',
    images: [fallbackSeoImage],
  },
};

export default async function Properties() {
  const properties = await fetchPublicProperties();

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Properties', path: '/properties' },
      ])) }} />
      <PropertiesClient initialProperties={properties} />
    </PublicLayout>
  );
}
