import React from 'react';
import PropertyReferenceForm from '../../../components/admin/PropertyReferenceForm.jsx';

export default function AdminPropertyNewPage({ onCreateProperty }) {
  return (
    <section className="panel admin-placeholder property-form-page">
      <div className="panel-title">
        <h2>Add property reference</h2>
        <span className="pill">Image upload enabled</span>
      </div>
      <PropertyReferenceForm onSubmit={onCreateProperty} />
    </section>
  );
}
