import { owner } from '../constants/business.js';
import { defaultSeo, siteUrl } from '../constants/seo.js';
import { currency } from './format.js';

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function propertySeo(property) {
  const action = property.intent === 'Rent' ? 'for Rent' : 'for Sale';
  const descriptionAction = property.intent === 'Rent' ? 'available for rent' : 'available for sale';
  const titleIncludesType = property.title.toLowerCase().includes(property.type.toLowerCase());
  const propertyName = titleIncludesType ? property.title : `${property.type} ${property.title}`;

  return {
    title: `${propertyName} ${action} in ${property.location} | ${owner.business}`,
    description: `${property.type} ${descriptionAction} in ${property.location}. View price, area and contact ${owner.business} for enquiries.`,
    image: property.image,
    type: 'article',
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: owner.business,
    url: `${siteUrl}/`,
    telephone: owner.mobile,
    email: owner.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No 10, A Wing, Blossom Apartment, 90 Feet Road, Ostwal Nagari',
      addressLocality: 'Nalasopara East, Vasai-Virar',
      addressRegion: 'Maharashtra',
      postalCode: '401209',
      addressCountry: 'IN',
    },
    areaServed: [
      'Nalasopara East',
      'Ostwal Nagari',
      '90 Feet Road',
      'Achole Road',
      'Station Belt',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: owner.business,
    url: `${siteUrl}/`,
    publisher: {
      '@id': `${siteUrl}/#localbusiness`,
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function propertyPageJsonLd(property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absoluteUrl(`/properties/${property.id}#webpage`),
    url: absoluteUrl(`/properties/${property.id}`),
    name: propertySeo(property).title,
    description: propertySeo(property).description,
    image: property.image,
    about: {
      '@type': 'Accommodation',
      name: property.title,
      accommodationCategory: property.type,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.area,
        unitText: 'sq.ft',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location,
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      amenityFeature: property.tags.map((tag) => ({
        '@type': 'LocationFeatureSpecification',
        name: tag,
      })),
    },
    provider: {
      '@id': `${siteUrl}/#localbusiness`,
    },
    mainEntity: {
      '@type': 'Thing',
      name: property.title,
      description: `${property.intent} reference: ${property.type}, ${property.area} sq.ft, ${currency(property.price, property.intent)}.`,
    },
  };
}

export function mergeSeo(seo = {}) {
  return {
    ...defaultSeo,
    ...seo,
  };
}
