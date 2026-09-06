import React, { useState } from 'react';
import { CircleDollarSign, Phone, Save, UserRound } from 'lucide-react';

const defaultLead = {
  customerName: '',
  phone: '',
  email: '',
  leadType: 'Buyer',
  propertyType: '1 BHK',
  preferredLocation: 'Nalasopara East',
  need: '',
  budget: '',
  timeline: 'This week',
  message: '',
  source: 'Walk-in',
  status: 'New',
  priority: 'Warm',
};

const sources = ['Walk-in', 'WhatsApp', 'Call', 'Referral', 'Website'];
const priorities = ['Hot', 'Warm', 'New'];
const leadTypes = ['Buyer', 'Seller', 'Rental', 'Commercial', 'Investor'];
const propertyTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', 'Shop', 'Office', 'Plot'];
const timelines = ['Today', 'This week', 'This month', 'Just exploring'];

export default function LeadCaptureForm({ onSubmit }) {
  const [form, setForm] = useState(defaultLead);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...form,
        name: form.customerName.trim(),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        status: form.status,
      });
      setForm(defaultLead);
    } catch (submitError) {
      setError(submitError.message || 'Lead could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="lead-capture-form" onSubmit={handleSubmit}>
      <div className="panel-title">
        <h2>New lead</h2>
        <span className="pill">Live pipeline</span>
      </div>
      <div className="form-grid">
        <label>Customer<input value={form.customerName} onChange={(event) => updateField('customerName', event.target.value)} placeholder="Customer name" /></label>
        <label>Phone<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="Mobile number" inputMode="tel" /></label>
        <label>Email<input value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Optional email" inputMode="email" /></label>
        <label>Lead type
          <select value={form.leadType} onChange={(event) => updateField('leadType', event.target.value)}>
            {leadTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>Property type
          <select value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value)}>
            {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>Preferred location<input value={form.preferredLocation} onChange={(event) => updateField('preferredLocation', event.target.value)} placeholder="Ostwal Nagari, Achole Road" /></label>
        <label>Need<input value={form.need} onChange={(event) => updateField('need', event.target.value)} placeholder="Loan possible, station nearby, road touch" /></label>
        <label>Budget<input value={form.budget} onChange={(event) => updateField('budget', event.target.value)} placeholder="Rs. 35L-40L" /></label>
        <label>Timeline
          <select value={form.timeline} onChange={(event) => updateField('timeline', event.target.value)}>
            {timelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
          </select>
        </label>
        <label>Source
          <select value={form.source} onChange={(event) => updateField('source', event.target.value)}>
            {sources.map((source) => <option key={source} value={source}>{source}</option>)}
          </select>
        </label>
        <label>Priority
          <select value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
            {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </label>
        <label className="wide-field">Notes<input value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder="Site visit timing, owner reference, special requirement" /></label>
      </div>
      {error && <small className="form-error">{error}</small>}
      <button className="primary" type="submit" disabled={saving}>
        <Save size={18} /> {saving ? 'Saving lead...' : 'Save lead'}
      </button>
      <div className="payload-preview">
        <span><UserRound size={14} /> {form.customerName || 'Customer'}</span>
        <span><Phone size={14} /> {form.phone || 'Phone'}</span>
        <span>{form.leadType}</span>
        <span>{form.propertyType}</span>
        <span><CircleDollarSign size={14} /> {form.budget || 'Budget'}</span>
      </div>
    </form>
  );
}
