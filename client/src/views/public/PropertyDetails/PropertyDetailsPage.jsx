'use client';

import React from 'react';
import { ArrowLeft, BadgeIndianRupee, Home, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { owner } from '../../../constants/business.js';
import { currency, whatsappUrl } from '../../../utils/format.js';
import { propertyDescription } from '../../../utils/seo.js';
import { getPrimaryPropertyImage, getPropertyImages } from '../../../utils/propertyImages.js';

export default function PropertyDetailsPage({ properties, onLead, propertyId }) {
  const property = properties.find((item) => item.id === propertyId);

  if (!property) {
    return (
      <section className="page-shell not-found-state">
        <h1>Property not found</h1>
        <p>This property reference is not available in the current demo list.</p>
        <Link className="secondary-action" href="/properties"><ArrowLeft size={18} /> Back to properties</Link>
      </section>
    );
  }

  const message = `Hi, I am interested in ${property.title} (${property.id}).`;
  const galleryImages = getPropertyImages(property);
  const primaryImage = getPrimaryPropertyImage(property);
  const secondaryImages = galleryImages.length > 1 ? galleryImages.filter((image) => image.imageUrl !== primaryImage).slice(0, 4) : galleryImages.slice(0, 2);
  const tags = Array.isArray(property.tags) ? property.tags : [];
  const description = propertyDescription(property);

  return (
    <section className="detail-page page-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/properties">Properties</Link>
        <span>/</span>
        <span>{property.title}</span>
      </nav>
      <Link className="back-inline" href="/properties"><ArrowLeft size={18} /> Back to properties</Link>
      <div className="detail-grid">
        <div className="detail-gallery">
          <img src={primaryImage} alt={`${property.title} in ${property.location}`} loading="eager" />
          <div>
            {secondaryImages.map((image, index) => (
              <figure key={`${image.imageUrl}-${index}`}>
                <img src={image.imageUrl} alt={`${property.title} ${image.imageLabel || `view ${index + 2}`}`} loading="lazy" />
                <figcaption>{image.imageLabel || `View ${index + 2}`}{image.imageSize ? ` · ${image.imageSize}` : ''}</figcaption>
              </figure>
            ))}
          </div>
          {galleryImages.length > 1 && <span>{galleryImages.length} property photos</span>}
        </div>

        <article className="detail-panel">
          <span className="pill">{property.status}</span>
          <h1>{property.title}</h1>
          <p><MapPin size={17} /> {property.location}</p>
          {property.apartmentName && <p><Home size={17} /> {property.apartmentName}</p>}
          <strong className="detail-price">{currency(property.price, property.intent)}</strong>

          <div className="detail-facts">
            <span><Home size={18} /> {property.type}</span>
            <span><BadgeIndianRupee size={18} /> {property.intent}</span>
            {property.area ? <span>{property.area} sq.ft</span> : null}
            {property.walkTime ? <span>{property.walkTime}</span> : null}
            {property.furnishing ? <span>{property.furnishing}</span> : null}
            {property.floor ? <span>{property.floor}</span> : null}
          </div>

          <p className="detail-description">{description}</p>

          {tags.length ? (
            <div className="tags">
              {tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}

          <div className="detail-actions">
            <a href={whatsappUrl(owner.mobile, message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
            <a href={`tel:${owner.mobile}`}><Phone size={18} /> Call</a>
            <Link href="/contact">Contact office</Link>
            <button onClick={() => onLead(property)}>Send enquiry</button>
          </div>
        </article>
      </div>
    </section>
  );
}
