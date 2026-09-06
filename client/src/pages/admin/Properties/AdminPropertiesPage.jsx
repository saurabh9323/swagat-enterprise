import React from 'react';
import InventoryView from '../../../components/admin/InventoryView.jsx';

export default function AdminPropertiesPage({ properties, onCreateProperty }) {
  return <InventoryView properties={properties} onCreateProperty={onCreateProperty} />;
}
