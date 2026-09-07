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
  const description = propertyDescription(property);

  return {
    title: `${propertyName} ${action} in ${property.location} | ${owner.business}`,
    description: description || `${property.type} ${descriptionAction} in ${property.location}. Contact ${owner.business} for enquiries.`,
    image: property.image,
    type: 'article',
  };
}

export function propertyDescription(property) {
  const facts = [
    property.type,
    property.intent ? `for ${String(property.intent).toLowerCase()}` : '',
    property.location ? `in ${property.location}` : '',
  ].filter(Boolean).join(' ');
  const details = [
    property.apartmentName ? `Apartment/building: ${property.apartmentName}.` : '',
    property.area ? `Area: ${property.area} sq.ft.` : '',
    property.price ? `Price: ${currency(property.price, property.intent)}.` : '',
    property.status ? `Status: ${property.status}.` : '',
    property.furnishing ? `Furnishing: ${property.furnishing}.` : '',
    property.floor ? `Floor: ${property.floor}.` : '',
    property.walkTime ? `Local note: ${property.walkTime}.` : '',
  ].filter(Boolean);
  const features = Array.isArray(property.tags) && property.tags.length
    ? `Features mentioned for this reference include ${property.tags.slice(0, 6).join(', ')}.`
    : '';
  const customDescription = property.description ? `${property.description}` : '';

  return [
    facts ? `Explore this ${facts} with ${owner.business}.` : '',
    ...details,
    features,
    customDescription,
    `Contact ${owner.business} to confirm current details and arrange the next step.`,
  ].filter(Boolean).join(' ');
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
  const tags = Array.isArray(property.tags) ? property.tags : [];
  const description = propertyDescription(property);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absoluteUrl(`/properties/${property.id}#webpage`),
    url: absoluteUrl(`/properties/${property.id}`),
    name: propertySeo(property).title,
    description,
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
      amenityFeature: tags.map((tag) => ({
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
      description,
    },
  };
}

export function mergeSeo(seo = {}) {
  return {
    ...defaultSeo,
    ...seo,
  };
}
