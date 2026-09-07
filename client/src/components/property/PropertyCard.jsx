import React from 'react';
import { Map, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import { currency } from '../../utils/format.js';
import { getPrimaryPropertyImage, getPropertyImages } from '../../utils/propertyImages.js';

export default function PropertyCard({ property, index, onPreview, onLead }) {
  const primaryImage = getPrimaryPropertyImage(property);
  const imageCount = getPropertyImages(property).length;

  return (
    <article className="property-card" style={{ '--delay': `${index * 70}ms` }}>
      <button className="image-button" onClick={() => onPreview(property)} aria-label={`Preview ${property.title}`}>
        <img src={primaryImage} alt={`${property.title} in ${property.location}`} loading="lazy" />
        <span>{property.score}% local fit</span>
        {imageCount > 1 && <b>{imageCount} photos</b>}
      </button>
      <div className="property-body">
        <div className="property-head">
          <span>{property.status}</span>
          <strong>{property.intent}</strong>
        </div>
        <h3>{property.title}</h3>
        {property.apartmentName && <em>{property.apartmentName}</em>}
        <p><MapPin size={16} /> {property.location}</p>
        <p><Map size={16} /> {property.walkTime}</p>
        <div className="spec-row">
          <b>{property.type}</b>
          <b>{property.area} sq.ft</b>
          <b>{currency(property.price, property.intent)}</b>
        </div>
        <div className="tags">
          {property.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="property-actions">
          <Link className="secondary-action" href={`/properties/${property.id}`}>View details</Link>
          <button className="primary" onClick={() => onLead(property)}>
            <Plus size={18} /> Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
