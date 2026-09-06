import React, { useMemo, useState } from 'react';
import { Camera, ImagePlus, IndianRupee, MapPin, Ruler, Save, X } from 'lucide-react';
import { fileToDataUrl, validatePropertyImage } from '../../utils/images.js';

const defaultForm = {
  title: '',
  location: '',
  price: '',
  propertyType: '1 BHK',
  listingType: 'Sale',
  area: '',
  status: 'Fresh',
  image: '',
  imageName: '',
};

const statuses = ['Fresh', 'Visit Today', 'Negotiable', 'Hot', 'Prime Frontage', 'Owner Direct'];
const propertyTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', 'Shop', 'Office', 'Plot'];
const listingTypes = ['Sale', 'Rent'];

function numberValue(value) {
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  return cleaned ? Number(cleaned) : 0;
}

export default function PropertyReferenceForm({ initialValue = null, onSubmit, submitLabel = 'Save property reference', compact = false }) {
  const [form, setForm] = useState(() => ({
    ...defaultForm,
    ...(initialValue ? {
      title: initialValue.title || '',
      location: initialValue.location || '',
      price: initialValue.price || '',
      propertyType: initialValue.propertyType || initialValue.type || '1 BHK',
      listingType: initialValue.listingType || initialValue.intent || 'Sale',
      area: initialValue.area || '',
      status: initialValue.status || 'Fresh',
      image: initialValue.image || '',
      imageName: initialValue.image ? 'Current property image' : '',
    } : {}),
  }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const previewTitle = useMemo(() => form.title || 'New property reference', [form.title]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validatePropertyImage(file);
      const image = await fileToDataUrl(file);
      setForm((current) => ({ ...current, image, imageName: file.name }));
      setError('');
    } catch (imageError) {
      setError(imageError.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim()) {
      setError('Title and location are required.');
      return;
    }

    if (!numberValue(form.price)) {
      setError('Enter a valid price.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit({
        title: form.title.trim(),
        location: form.location.trim(),
        price: numberValue(form.price),
        propertyType: form.propertyType,
        type: form.propertyType,
        listingType: form.listingType,
        intent: form.listingType,
        area: form.area ? numberValue(form.area) : null,
        status: form.status,
        image: form.image || null,
        tags: ['Admin Added', form.status, form.image ? 'Photo Uploaded' : 'Photo Pending'],
        amenities: ['Admin Added', form.status, form.image ? 'Photo Uploaded' : 'Photo Pending'],
        score: 90,
        commission: form.listingType === 'Rent' ? numberValue(form.price) : Math.round(numberValue(form.price) * 0.02),
        walkTime: 'Added from Swagat admin panel',
      });

      if (!initialValue) setForm(defaultForm);
    } catch (submitError) {
      setError(submitError.message || 'Property could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={`property-reference-form${compact ? ' compact' : ''}`} onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>Flat title<input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="1 BHK near Ostwal Nagari" /></label>
        <label>Location<input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Nalasopara East" /></label>
        <label>Price<input value={form.price} onChange={(event) => updateField('price', event.target.value)} placeholder="3950000" inputMode="decimal" /></label>
        <label>BHK / Type
          <select value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value)}>
            {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>Listing
          <select value={form.listingType} onChange={(event) => updateField('listingType', event.target.value)}>
            {listingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>Area<input value={form.area} onChange={(event) => updateField('area', event.target.value)} placeholder="560 sq.ft" inputMode="decimal" /></label>
        <label>Status
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <div className="image-upload-card">
        <label className="image-dropzone">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
          {form.image ? (
            <img src={form.image} alt={`${previewTitle} preview`} />
          ) : (
            <span><ImagePlus size={24} /> Upload property image</span>
          )}
        </label>
        <div>
          <strong><Camera size={16} /> Property photo</strong>
          <p>{form.imageName || 'JPG, PNG or WebP. This saves as Base64 for current compatibility.'}</p>
          {form.image && <button type="button" className="clear-image" onClick={() => setForm((current) => ({ ...current, image: '', imageName: '' }))}><X size={15} /> Remove</button>}
        </div>
      </div>

      {error && <small className="form-error">{error}</small>}

      <button className="primary" type="submit" disabled={saving}>
        <Save size={18} /> {saving ? 'Saving property...' : submitLabel}
      </button>

      <div className="payload-preview" aria-label="Property payload preview">
        <span><MapPin size={14} /> {form.location || 'Location'}</span>
        <span><IndianRupee size={14} /> {form.price || 'Price'}</span>
        <span><Ruler size={14} /> {form.area || 'Area'}</span>
      </div>
    </form>
  );
}
