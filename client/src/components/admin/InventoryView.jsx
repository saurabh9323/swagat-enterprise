import React from 'react';
import { Camera, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currency } from '../../utils/format.js';

export default function InventoryView({ properties, onAddProperty }) {
  return (
    <section className="inventory-studio">
      <div className="panel property-form">
        <div className="panel-title">
          <h2>Quick add format</h2>
          <span className="pill">Ready for MongoDB</span>
        </div>
        <div className="form-grid">
          <label>Flat title<input placeholder="1 BHK near Ostwal Nagari" /></label>
          <label>Location<input placeholder="Nalasopara East" /></label>
          <label>Price<input placeholder="Rs. 42L or Rs. 12K/mo" /></label>
          <label>BHK / Type<input placeholder="1 BHK, 2 BHK, Shop" /></label>
          <label>Area<input placeholder="560 sq.ft" /></label>
          <label>Status<input placeholder="Fresh, Hot, Visit Today" /></label>
        </div>
        <button className="primary" onClick={onAddProperty}><Camera size={18} /> Add sample reference</button>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
