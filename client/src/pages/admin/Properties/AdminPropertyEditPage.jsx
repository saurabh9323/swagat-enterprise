import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropertyReferenceForm from '../../../components/admin/PropertyReferenceForm.jsx';

export default function AdminPropertyEditPage({ properties, onUpdateProperty }) {
  const { id } = useParams();
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return (
      <section className="panel admin-placeholder">
        <h2>Property not found</h2>
        <p>This property reference is not available in the current demo data.</p>
        <Link className="secondary-action" to="/admin/properties">Back to admin properties</Link>
      </section>
    );
  }

  return (
    <section className="panel admin-placeholder property-form-page">
      <div className="panel-title">
        <h2>Edit property</h2>
        <span className="pill">{property.id}</span>
      </div>
      <PropertyReferenceForm
        initialValue={property}
        submitLabel="Update property reference"
        onSubmit={(payload) => onUpdateProperty(property.id, payload)}
      />
      <Link className="secondary-action" to="/admin/properties">Back to inventory</Link>
    </section>
  );
}
