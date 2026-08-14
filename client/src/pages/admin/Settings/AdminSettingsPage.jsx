import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <section className="panel admin-placeholder">
      <Settings size={26} />
      <h2>Settings</h2>
      <p>Admin profile, business preferences and security settings will be implemented after authentication.</p>
    </section>
  );
}
