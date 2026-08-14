import React from 'react';
import { Camera } from 'lucide-react';

export default function AdminPropertyNewPage({ onAddProperty }) {
  return (
    <section className="panel admin-placeholder">
      <h2>Add property reference</h2>
      <p>The full property creation form will be implemented in the property management phase.</p>
      <button className="primary" onClick={onAddProperty}><Camera size={18} /> Add sample reference</button>
    </section>
  );
}
