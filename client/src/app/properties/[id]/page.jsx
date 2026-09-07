import React from 'react';
import { notFound } from 'next/navigation';
import PublicLayout from '../../../layouts/PublicLayout.jsx';
import PropertyDetailsClient from '../../../components/public/PropertyDetailsClient.jsx';
import { fetchPublicProperties, fetchPublicProperty } from '../../../services/serverApi.js';
import { siteUrl } from '../../../constants/seo.js';
import { breadcrumbJsonLd, propertyPageJsonLd, propertySeo } from '../../../utils/seo.js';
import { getPrimaryPropertyImage } from '../../../utils/propertyImages.js';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await fetchPublicProperty(id);

  if (!property) {
    return {
      title: 'Property Not Found | Swagat Enterprise',
      description: 'The requested Swagat Enterprise property reference is not available.',
      robots: { index: false, follow: false },
    };
  }

  const seo = propertySeo(property);
  const image = getPrimaryPropertyImage(property);
  const path = `/properties/${property.id}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}${path}`,
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: image ? [image] : [],
    },
  };
}

export default async function PropertyDetails({ params }) {
  const { id } = await params;
  const properties = await fetchPublicProperties();
  const property = properties.find((item) => item.id === id);

  if (!property) notFound();

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
          { name: property.title, path: `/properties/${property.id}` },
        ]),
        propertyPageJsonLd(property),
      ]) }} />
      <PropertyDetailsClient initialProperties={properties} propertyId={id} />
    </PublicLayout>
  );
}
