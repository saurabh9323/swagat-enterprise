import React, { useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '../common/ToastProvider.jsx';
import { fileToDataUrl, validatePropertyImage } from '../../utils/images.js';
import PropertyImageUploader from './PropertyImageUploader.jsx';
import PropertyPayloadPreview from './PropertyPayloadPreview.jsx';
import {
  defaultPropertyReferenceForm,
  formatFileSize,
  imageLabels,
  listingTypes,
  listValue,
  maxPropertyImages,
  numberValue,
  optionalNumber,
  propertyStatuses,
  propertyTypes,
} from './propertyReferenceFormUtils.js';

export default function PropertyReferenceForm({ initialValue = null, onSubmit, submitLabel = 'Save property reference', compact = false }) {
  const toast = useToast();
  const initialImages = initialValue?.images?.length
    ? initialValue.images.map((image, index) => ({
        imageUrl: image.imageUrl || image.image_url || image.url || image,
        storagePath: image.storagePath || image.storage_path || image.imageUrl || image.image_url || image,
        displayOrder: image.displayOrder ?? image.display_order ?? index,
        isPrimary: image.isPrimary ?? image.is_primary ?? index === 0,
        imageName: image.imageName || image.image_name || `Property image ${index + 1}`,
        imageLabel: image.imageLabel || image.image_label || image.label || imageLabels[index] || 'Other',
        imageSize: image.imageSize || image.image_size || image.size || '',
      }))
    : initialValue?.image
      ? [{
          imageUrl: initialValue.image,
          storagePath: initialValue.image,
          displayOrder: 0,
          isPrimary: true,
          imageName: 'Current property image',
          imageLabel: 'Hall',
          imageSize: '',
        }]
    : [];

  const [form, setForm] = useState(() => ({
    ...defaultPropertyReferenceForm,
    ...(initialValue ? {
      title: initialValue.title || '',
      description: initialValue.description || '',
      apartmentName: initialValue.apartmentName || '',
      location: initialValue.location || '',
      price: initialValue.price || '',
      propertyType: initialValue.propertyType || initialValue.type || '1 BHK',
      listingType: initialValue.listingType || initialValue.intent || 'Sale',
      area: initialValue.area || '',
      bedrooms: initialValue.bedrooms ?? '',
      bathrooms: initialValue.bathrooms ?? '',
      floor: initialValue.floor || '',
      totalFloors: initialValue.totalFloors ?? '',
      furnishing: initialValue.furnishing || '',
      status: initialValue.status || 'Fresh',
      score: initialValue.score ?? '90',
      commission: initialValue.commission ?? '',
      walkTime: initialValue.walkTime || 'Added from Swagat admin panel',
      latitude: initialValue.latitude ?? '',
      longitude: initialValue.longitude ?? '',
      tags: (initialValue.tags || []).join(', '),
      amenities: (initialValue.amenities || []).join(', '),
      isActive: initialValue.isActive ?? true,
      images: initialImages,
    } : {}),
  }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const previewTitle = useMemo(() => form.title || 'New property reference', [form.title]);
  const primaryImage = useMemo(() => form.images.find((image) => image.isPrimary) || form.images[0], [form.images]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleImageChange(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      if (form.images.length + files.length > maxPropertyImages) {
        throw new Error(`Upload up to ${maxPropertyImages} property images.`);
      }

      files.forEach(validatePropertyImage);
      const uploadedImages = await Promise.all(files.map(async (file, index) => {
        const imageUrl = await fileToDataUrl(file);
        return {
          imageUrl,
          storagePath: null,
          displayOrder: form.images.length + index,
          isPrimary: form.images.length === 0 && index === 0,
          imageName: file.name,
          imageLabel: imageLabels[(form.images.length + index) % imageLabels.length],
          imageSize: formatFileSize(file.size),
        };
      }));

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages].map((image, index) => ({
          ...image,
          displayOrder: index,
          isPrimary: image.isPrimary || (current.images.length === 0 && index === 0),
        })),
      }));
      setError('');
    } catch (imageError) {
      setError(imageError.message);
      toast.error(imageError, 'Image upload failed');
    } finally {
      event.target.value = '';
    }
  }

  function removeImage(indexToRemove) {
    setForm((current) => {
      const remaining = current.images
        .filter((_, index) => index !== indexToRemove)
        .map((image, index) => ({
          ...image,
          displayOrder: index,
          isPrimary: image.isPrimary,
        }));

      if (remaining.length && !remaining.some((image) => image.isPrimary)) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }

      return { ...current, images: remaining };
    });
  }

  function setPrimaryImage(indexToSet) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, index) => ({
        ...image,
        isPrimary: index === indexToSet,
        displayOrder: index,
      })),
    }));
  }

  function updateImageMeta(indexToUpdate, field, value) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, index) => (
        index === indexToUpdate ? { ...image, [field]: value } : image
      )),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim()) {
      setError('Title and location are required.');
      toast.error('Title and location are required.', 'Property not saved');
      return;
    }

    if (!numberValue(form.price)) {
      setError('Enter a valid price.');
      toast.error('Enter a valid price.', 'Property not saved');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || null,
        apartmentName: form.apartmentName.trim() || null,
        location: form.location.trim(),
        price: numberValue(form.price),
        propertyType: form.propertyType,
        type: form.propertyType,
        listingType: form.listingType,
        intent: form.listingType,
        area: form.area ? numberValue(form.area) : null,
        bedrooms: optionalNumber(form.bedrooms),
        bathrooms: optionalNumber(form.bathrooms),
        floor: form.floor.trim() || null,
        totalFloors: optionalNumber(form.totalFloors),
        furnishing: form.furnishing.trim() || null,
        status: form.status,
        score: optionalNumber(form.score) ?? 90,
        commission: form.commission ? numberValue(form.commission) : (form.listingType === 'Rent' ? numberValue(form.price) : Math.round(numberValue(form.price) * 0.02)),
        walkTime: form.walkTime.trim() || 'Added from Swagat admin panel',
        latitude: optionalNumber(form.latitude),
        longitude: optionalNumber(form.longitude),
        isActive: form.isActive,
        image: primaryImage?.imageUrl || null,
        images: form.images.map((image, index) => ({
          imageUrl: image.imageUrl,
          storagePath: image.storagePath || null,
          imageLabel: image.imageLabel || `Photo ${index + 1}`,
          imageSize: image.imageSize || null,
          displayOrder: index,
          isPrimary: image.isPrimary || index === 0,
        })),
        tags: [...new Set([...listValue(form.tags), form.status, form.images.length ? 'Photo Gallery' : 'Photo Pending'])],
        amenities: [...new Set([...listValue(form.amenities), form.status, form.images.length ? 'Photo Gallery' : 'Photo Pending'])],
      });

      if (!initialValue) setForm(defaultPropertyReferenceForm);
      toast.success(initialValue ? 'Property reference updated successfully.' : 'Property reference added successfully.', 'Property saved');
    } catch (submitError) {
      setError(submitError.message || 'Property could not be saved.');
      toast.error(submitError, 'Property could not be saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={`property-reference-form${compact ? ' compact' : ''}`} onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>Flat title<input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="1 BHK near Ostwal Nagari" /></label>
        <label>Apartment / building<input value={form.apartmentName} onChange={(event) => updateField('apartmentName', event.target.value)} placeholder="Blossom Apartment, Ostwal Nagari" /></label>
        <label>Location<input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Nalasopara East" /></label>
        <label className="wide-field">Description<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Owner direct, loan possible, station belt, road touch details" rows={3} /></label>
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
        <label>Bedrooms<input value={form.bedrooms} onChange={(event) => updateField('bedrooms', event.target.value)} placeholder="1" inputMode="numeric" /></label>
        <label>Bathrooms<input value={form.bathrooms} onChange={(event) => updateField('bathrooms', event.target.value)} placeholder="2" inputMode="numeric" /></label>
        <label>Floor<input value={form.floor} onChange={(event) => updateField('floor', event.target.value)} placeholder="4th floor" /></label>
        <label>Total floors<input value={form.totalFloors} onChange={(event) => updateField('totalFloors', event.target.value)} placeholder="7" inputMode="numeric" /></label>
        <label>Furnishing<input value={form.furnishing} onChange={(event) => updateField('furnishing', event.target.value)} placeholder="Semi furnished" /></label>
        <label>Status
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            {propertyStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label>Score<input value={form.score} onChange={(event) => updateField('score', event.target.value)} placeholder="90" inputMode="numeric" /></label>
        <label>Commission<input value={form.commission} onChange={(event) => updateField('commission', event.target.value)} placeholder="Auto if blank" inputMode="decimal" /></label>
        <label className="wide-field">Walk time / note<input value={form.walkTime} onChange={(event) => updateField('walkTime', event.target.value)} placeholder="5 min from station, near 90 Feet Road" /></label>
        <label>Latitude<input value={form.latitude} onChange={(event) => updateField('latitude', event.target.value)} placeholder="Optional" inputMode="decimal" /></label>
        <label>Longitude<input value={form.longitude} onChange={(event) => updateField('longitude', event.target.value)} placeholder="Optional" inputMode="decimal" /></label>
        <label className="wide-field">Tags<input value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="Admin Added, Owner Direct, Loan Possible" /></label>
        <label className="wide-field">Amenities<input value={form.amenities} onChange={(event) => updateField('amenities', event.target.value)} placeholder="Lift, Parking, Water, Security" /></label>
        <label className="toggle-field"><input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} /> Active listing</label>
      </div>

      <PropertyImageUploader
        images={form.images}
        onImageChange={handleImageChange}
        onImageMetaChange={updateImageMeta}
        onRemoveImage={removeImage}
        onSetPrimaryImage={setPrimaryImage}
        previewTitle={previewTitle}
        primaryImage={primaryImage}
      />

      {error && <small className="form-error">{error}</small>}

      <button className="primary" type="submit" disabled={saving}>
        <Save size={18} /> {saving ? 'Saving property...' : submitLabel}
      </button>

      <PropertyPayloadPreview area={form.area} location={form.location} price={form.price} />
    </form>
  );
}
