import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { owner } from '../../constants/business.js';
import { whatsappUrl } from '../../utils/format.js';

export default function FloatingContact() {
  return (
    <div className="floating-contact" aria-label="Quick contact actions">
      <a href={`tel:${owner.mobile}`} aria-label="Call Swagat Enterprise"><Phone size={18} /></a>
      <a href={whatsappUrl(owner.mobile, `Hi, I want to enquire about properties with ${owner.business}.`)} target="_blank" rel="noreferrer" aria-label="WhatsApp Swagat Enterprise">
        <MessageCircle size={18} />
      </a>
    </div>
  );
}
