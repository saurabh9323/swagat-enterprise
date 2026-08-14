import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { owner } from '../../constants/business.js';
import { whatsappUrl } from '../../utils/format.js';

export default function ContactLinks({ message = '' }) {
  return (
    <div className="contact-panel">
      <a href={`tel:${owner.mobile}`}><Phone size={18} /> {owner.mobile}</a>
      <a href={`mailto:${owner.email}`}><Mail size={18} /> {owner.email}</a>
      <a href={whatsappUrl(owner.mobile, message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a>
    </div>
  );
}
