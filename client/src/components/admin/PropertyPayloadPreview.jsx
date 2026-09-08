import React from 'react';
import { IndianRupee, MapPin, Ruler } from 'lucide-react';

export default function PropertyPayloadPreview({ area, location, price }) {
  return (
    <div className="payload-preview" aria-label="Property payload preview">
      <span><MapPin size={14} /> {location || 'Location'}</span>
      <span><IndianRupee size={14} /> {price || 'Price'}</span>
      <span><Ruler size={14} /> {area || 'Area'}</span>
    </div>
  );
}
