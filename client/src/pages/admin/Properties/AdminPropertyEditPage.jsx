import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function AdminPropertyEditPage({ properties }) {
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
    <section className="panel admin-placeholder">
      <h2>Edit {property.title}</h2>
      <p>Editing will be connected in the property CRUD phase. Current demo reference: {property.id}.</p>
      <Link className="secondary-action" to="/admin/properties">Back to inventory</Link>
    </section>
  );
}
