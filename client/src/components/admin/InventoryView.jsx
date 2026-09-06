import React from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currency } from '../../utils/format.js';
import PropertyReferenceForm from './PropertyReferenceForm.jsx';

export default function InventoryView({ properties, onCreateProperty, onDeleteProperty }) {
  return (
    <section className="inventory-studio">
      <div className="panel property-form">
        <div className="panel-title">
          <h2>Quick add format</h2>
          <span className="pill">Ready for PostgreSQL</span>
        </div>
        <PropertyReferenceForm compact onSubmit={onCreateProperty} />
      </div>

      <div className="panel">
        <div className="panel-title">
          <h2>Current references</h2>
          <span className="pill">{properties.length} active</span>
        </div>
        <div className="table property-table">
          {properties.map((property) => (
            <div className="table-row" key={property.id}>
              <span>{property.id}</span>
              <strong>{property.location}</strong>
              <span>{property.type}</span>
              <span>{currency(property.price, property.intent)}</span>
              <Link className="icon-action" aria-label={`Edit ${property.title}`} to={`/admin/properties/${property.id}/edit`}>
                <SquarePen size={17} />
              </Link>
              <button type="button" aria-label={`Delete ${property.title}`} onClick={() => window.confirm(`Delete ${property.title}?`) && onDeleteProperty(property.id)}>
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
