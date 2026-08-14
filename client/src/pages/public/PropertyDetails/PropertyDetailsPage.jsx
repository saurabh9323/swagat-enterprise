import React from 'react';
import { ArrowLeft, BadgeIndianRupee, Home, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { owner } from '../../../constants/business.js';
import { currency, whatsappUrl } from '../../../utils/format.js';

export default function PropertyDetailsPage({ properties, onLead }) {
  const { id } = useParams();
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return (
      <section className="page-shell not-found-state">
        <h1>Property not found</h1>
        <p>This property reference is not available in the current demo list.</p>
        <Link className="secondary-action" to="/properties"><ArrowLeft size={18} /> Back to properties</Link>
      </section>
    );
  }

  const message = `Hi, I am interested in ${property.title} (${property.id}).`;

  return (
    <section className="detail-page page-shell">
      <Link className="back-inline" to="/properties"><ArrowLeft size={18} /> Back to properties</Link>
      <div className="detail-grid">
        <div className="detail-gallery">
          <img src={property.image} alt={property.title} />
          <div>
            <img src={property.image} alt={`${property.title} view 1`} />
            <img src={property.image} alt={`${property.title} view 2`} />
          </div>
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
            A Swagat Enterprise local property reference for customers looking around Nalasopara East.
            Use the contact options to confirm current availability, visit timing and exact terms.
          </p>

          <div className="tags">
            {property.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="detail-actions">
            <a href={whatsappUrl(owner.mobile, message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
            <a href={`tel:${owner.mobile}`}><Phone size={18} /> Call</a>
            <button onClick={() => onLead(property)}>Send enquiry</button>
          </div>
        </article>
      </div>
    </section>
  );
}
