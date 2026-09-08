import React from 'react';
import { Camera, ImagePlus, Star, X } from 'lucide-react';
import { imageLabels, maxPropertyImages } from './propertyReferenceFormUtils.js';

export default function PropertyImageUploader({
  images,
  onImageChange,
  onImageMetaChange,
  onRemoveImage,
  onSetPrimaryImage,
  previewTitle,
  primaryImage,
}) {
  return (
    <div className="image-upload-card">
      <label className="image-dropzone">
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onImageChange} />
        {primaryImage ? (
          <img src={primaryImage.imageUrl} alt={`${previewTitle} preview`} />
        ) : (
          <span><ImagePlus size={24} /> Upload property images</span>
        )}
      </label>
      <div>
        <strong><Camera size={16} /> Property photo gallery</strong>
        <p>{images.length ? `${images.length} image${images.length > 1 ? 's' : ''} selected. First/primary image appears on cards.` : `JPG, PNG or WebP. Select up to ${maxPropertyImages}; saved as Base64 for current compatibility.`}</p>
        <div className="image-thumb-grid">
          {images.map((image, index) => (
            <figure className={image.isPrimary ? 'is-primary' : ''} key={`${image.imageName}-${index}`}>
              <img src={image.imageUrl} alt={`${previewTitle} thumbnail ${index + 1}`} />
              <figcaption>{image.isPrimary ? 'Primary' : `Photo ${index + 1}`}</figcaption>
              <button type="button" className="thumb-primary" onClick={() => onSetPrimaryImage(index)} aria-label={`Set image ${index + 1} as primary`}>
                <Star size={13} />
              </button>
              <button type="button" className="thumb-remove" onClick={() => onRemoveImage(index)} aria-label={`Remove image ${index + 1}`}>
                <X size={13} />
              </button>
              <div className="image-meta-controls">
                <select value={image.imageLabel || 'Other'} onChange={(event) => onImageMetaChange(index, 'imageLabel', event.target.value)} aria-label={`Image ${index + 1} label`}>
                  {imageLabels.map((label) => <option key={label} value={label}>{label}</option>)}
                </select>
                <input value={image.imageSize || ''} onChange={(event) => onImageMetaChange(index, 'imageSize', event.target.value)} placeholder="Size" aria-label={`Image ${index + 1} size`} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
