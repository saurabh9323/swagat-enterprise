import React from 'react';
import { Map, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currency } from '../../utils/format.js';

export default function PropertyCard({ property, index, onPreview, onLead }) {
  return (
    <article className="property-card" style={{ '--delay': `${index * 70}ms` }}>
      <button className="image-button" onClick={() => onPreview(property)} aria-label={`Preview ${property.title}`}>
        <img src={property.image} alt={`${property.title} in ${property.location}`} loading="lazy" />
        <span>{property.score}% local fit</span>
      </button>
      <div className="property-body">
        <div className="property-head">
          <span>{property.status}</span>
          <strong>{property.intent}</strong>
        </div>
        <h3>{property.title}</h3>
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
          <Link className="secondary-action" to={`/properties/${property.id}`}>View details</Link>
          <button className="primary" onClick={() => onLead(property)}>
            <Plus size={18} /> Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
