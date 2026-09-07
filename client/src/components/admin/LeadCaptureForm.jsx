import React, { useState } from 'react';
import { CircleDollarSign, Phone, Save, UserRound } from 'lucide-react';
import { useToast } from '../common/ToastProvider.jsx';

const defaultLead = {
  propertyId: '',
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

function leadFormValue(lead) {
  if (!lead) return defaultLead;

  return {
    ...defaultLead,
    propertyId: lead.propertyId || '',
    customerName: lead.customerName || lead.name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    leadType: lead.leadType || 'Buyer',
    propertyType: lead.propertyType || '1 BHK',
    preferredLocation: lead.preferredLocation || 'Nalasopara East',
    need: lead.need || '',
    budget: lead.budget || '',
    timeline: lead.timeline || 'This week',
    message: lead.message || '',
    source: lead.source || 'Walk-in',
    status: lead.status || lead.stage || 'New',
    priority: lead.priority || 'Warm',
  };
}

export default function LeadCaptureForm({ onSubmit, initialValue = null, submitLabel = 'Save lead', onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState(() => leadFormValue(initialValue));
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
      toast.error('Customer name is required.', 'Lead not saved');
      return;
    }

    if (!form.phone.trim()) {
      setError('Phone number is required.');
      toast.error('Phone number is required.', 'Lead not saved');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...form,
        propertyId: form.propertyId.trim() || null,
        name: form.customerName.trim(),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        status: form.status,
      });
      setForm(defaultLead);
      toast.success(initialValue ? 'Lead updated successfully.' : 'Lead added successfully.', 'Lead saved');
    } catch (submitError) {
      setError(submitError.message || 'Lead could not be saved.');
      toast.error(submitError, 'Lead could not be saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="lead-capture-form" onSubmit={handleSubmit}>
      <div className="panel-title">
        <h2>{initialValue ? 'Edit lead' : 'New lead'}</h2>
        <span className="pill">{initialValue ? 'Update pipeline' : 'Live pipeline'}</span>
      </div>
      <div className="form-grid">
        <label>Property ID<input value={form.propertyId} onChange={(event) => updateField('propertyId', event.target.value)} placeholder="SE-NAL-FDFD7EF7" /></label>
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
        <Save size={18} /> {saving ? 'Saving lead...' : submitLabel}
      </button>
      {onCancel && <button className="secondary-action" type="button" onClick={onCancel}>Cancel edit</button>}
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
