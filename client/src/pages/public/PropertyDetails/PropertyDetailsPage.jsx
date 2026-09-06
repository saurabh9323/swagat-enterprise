import React from 'react';
import { ArrowLeft, BadgeIndianRupee, Home, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { owner } from '../../../constants/business.js';
import { currency, whatsappUrl } from '../../../utils/format.js';
import Seo from '../../../components/seo/Seo.jsx';
import { breadcrumbJsonLd, propertyPageJsonLd, propertySeo } from '../../../utils/seo.js';
import { getPrimaryPropertyImage, getPropertyImages } from '../../../utils/propertyImages.js';

export default function PropertyDetailsPage({ properties, onLead }) {
  const { id } = useParams();
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return (
      <section className="page-shell not-found-state">
        <Seo
          path={`/properties/${id}`}
          title="Property Not Found | Swagat Enterprise"
          description="The requested Swagat Enterprise property reference is not available."
        />
        <h1>Property not found</h1>
        <p>This property reference is not available in the current demo list.</p>
        <Link className="secondary-action" to="/properties"><ArrowLeft size={18} /> Back to properties</Link>
      </section>
    );
  }

  const message = `Hi, I am interested in ${property.title} (${property.id}).`;
  const seo = propertySeo(property);
  const galleryImages = getPropertyImages(property);
  const primaryImage = getPrimaryPropertyImage(property);
  const secondaryImages = galleryImages.length > 1 ? galleryImages.filter((image) => image.imageUrl !== primaryImage).slice(0, 4) : galleryImages.slice(0, 2);

  return (
    <section className="detail-page page-shell">
      <Seo
        path={`/properties/${property.id}`}
        title={seo.title}
        description={seo.description}
        image={primaryImage}
        type={seo.type}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Properties', path: '/properties' },
            { name: property.title, path: `/properties/${property.id}` },
          ]),
          propertyPageJsonLd(property),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/properties">Properties</Link>
        <span>/</span>
        <span>{property.title}</span>
      </nav>
      <Link className="back-inline" to="/properties"><ArrowLeft size={18} /> Back to properties</Link>
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
          <strong className="detail-price">{currency(property.price, property.intent)}</strong>

          <div className="detail-facts">
            <span><Home size={18} /> {property.type}</span>
            <span><BadgeIndianRupee size={18} /> {property.intent}</span>
            <span>{property.area} sq.ft</span>
            <span>{property.walkTime}</span>
          </div>

          <p className="detail-description">
            A Swagat Enterprise local property reference for customers looking around {property.location}.
            Use the contact options to confirm current availability, visit timing and exact terms.
          </p>

          <div className="tags">
            {property.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="detail-actions">
            <a href={whatsappUrl(owner.mobile, message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
            <a href={`tel:${owner.mobile}`}><Phone size={18} /> Call</a>
            <Link to="/contact">Contact office</Link>
            <button onClick={() => onLead(property)}>Send enquiry</button>
          </div>
        </article>
      </div>
    </section>
  );
}
