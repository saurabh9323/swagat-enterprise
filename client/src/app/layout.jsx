import React from 'react';
import '../styles.css';
import AppProviders from '../components/common/AppProviders.jsx';
import { defaultSeo, fallbackSeoImage, siteUrl } from '../constants/seo.js';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSeo.title,
    template: '%s',
  },
  description: defaultSeo.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    url: siteUrl,
    siteName: 'Swagat Enterprise',
    images: [{ url: fallbackSeoImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: [fallbackSeoImage],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
