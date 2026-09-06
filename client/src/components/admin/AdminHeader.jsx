import React, { useState } from 'react';
import { BellRing, Check, Moon, Plus, Save, Sun } from 'lucide-react';

const titles = {
  dashboard: 'Today at Swagat Enterprise',
  inventory: 'Property inventory studio',
  leads: 'Lead pipeline board',
};

export default function AdminHeader({ section, title, theme, onAddProperty, onToggleTheme, onSaveTheme }) {
  const [saveState, setSaveState] = useState('idle');

  async function handleSaveTheme() {
    setSaveState('saving');
    try {
      await onSaveTheme();
      setSaveState('saved');
      window.setTimeout(() => setSaveState('idle'), 1400);
    } catch {
      setSaveState('error');
      window.setTimeout(() => setSaveState('idle'), 1800);
    }
  }

  return (
    <header className="admin-topbar">
      <div>
        <p className="eyebrow"><BellRing size={16} /> Follow-up command center</p>
        <h1>{title || titles[section]}</h1>
      </div>
      <div className="topbar-actions">
        <button className="topbar-icon" type="button" onClick={onToggleTheme} aria-label="Toggle light and dark mode" title="Toggle light and dark mode">
          {theme?.mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="topbar-icon" type="button" onClick={handleSaveTheme} aria-label="Save appearance" title="Save appearance">
          {saveState === 'saved' ? <Check size={18} /> : <Save size={18} />}
        </button>
        <button onClick={onAddProperty}><Plus size={18} /> Add property reference</button>
      </div>
    </header>
  );
}
