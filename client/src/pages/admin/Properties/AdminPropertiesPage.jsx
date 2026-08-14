import React from 'react';
import InventoryView from '../../../components/admin/InventoryView.jsx';

export default function AdminPropertiesPage({ properties, onAddProperty }) {
  return <InventoryView properties={properties} onAddProperty={onAddProperty} />;
}
