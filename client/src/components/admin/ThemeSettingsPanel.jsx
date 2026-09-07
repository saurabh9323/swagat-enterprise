import React, { useState } from 'react';
import { Eye, EyeOff, Moon, Palette, RotateCcw, Save, Sun } from 'lucide-react';
import { useToast } from '../common/ToastProvider.jsx';
import { defaultTheme, lightTheme } from '../../hooks/useThemeSettings.js';

const colorFields = [
  ['sidebarColor', 'Sidebar'],
  ['navbarColor', 'Navbar'],
  ['pageColor', 'Page background'],
  ['panelColor', 'Cards and panels'],
  ['accentColor', 'Buttons and active tab'],
  ['textColor', 'Text'],
];

export default function ThemeSettingsPanel({ theme, onChange, onSave, onReset }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  function updateTheme(next) {
    onChange((current) => ({ ...current, ...next }));
    setMessage('');
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await onSave(theme);
      setMessage('Saved to database.');
      toast.success('Website colors saved to database.', 'Theme saved');
    } catch (error) {
      setMessage(error.message || 'Could not save theme.');
      toast.error(error, 'Theme could not be saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-grid">
      <div className="panel theme-panel">
        <div className="panel-title">
          <h2>Website appearance</h2>
          <span className="pill"><Palette size={14} /> Theme</span>
        </div>

        <div className="mode-switcher" aria-label="Theme mode">
          <button type="button" className={theme.mode === 'dark' ? 'active' : ''} onClick={() => updateTheme(defaultTheme)}><Moon size={17} /> Dark</button>
          <button type="button" className={theme.mode === 'light' ? 'active' : ''} onClick={() => updateTheme(lightTheme)}><Sun size={17} /> Light</button>
        </div>

        <button type="button" className="preview-toggle" onClick={() => setShowPreview((current) => !current)}>
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>

        <div className="color-grid">
          {colorFields.map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <input type="color" value={theme[field]} onChange={(event) => updateTheme({ [field]: event.target.value })} />
              <input value={theme[field]} onChange={(event) => updateTheme({ [field]: event.target.value })} />
            </label>
          ))}
        </div>

        <div className="settings-actions">
          <button type="button" className="secondary-action" onClick={() => { onReset(); setMessage('Reset preview. Save to keep it.'); }}><RotateCcw size={16} /> Reset</button>
          <button type="button" className="primary" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save theme'}</button>
        </div>
        {message && <small className="settings-message">{message}</small>}
      </div>

      {showPreview && <div className="panel theme-preview-panel">
        <div className="preview-navbar">Swagat Enterprise</div>
        <div className="preview-layout">
          <aside>
            <span />
            <b>Dashboard</b>
            <b>Properties</b>
            <b>Leads</b>
          </aside>
          <main>
            <article>
              <small>Preview</small>
              <strong>Customer-friendly real estate desk</strong>
              <button type="button">Primary action</button>
            </article>
          </main>
        </div>
      </div>}
    </section>
  );
}
