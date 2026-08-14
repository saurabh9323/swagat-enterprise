import React from 'react';
import { BellRing, Plus } from 'lucide-react';

const titles = {
  dashboard: 'Today at Swagat Enterprise',
  inventory: 'Property inventory studio',
  leads: 'Lead pipeline board',
};

export default function AdminHeader({ section, title, onAddProperty }) {
  return (
    <header className="admin-topbar">
      <div>
        <p className="eyebrow"><BellRing size={16} /> Follow-up command center</p>
        <h1>{title || titles[section]}</h1>
      </div>
      <button onClick={onAddProperty}><Plus size={18} /> Add property reference</button>
    </header>
  );
}
