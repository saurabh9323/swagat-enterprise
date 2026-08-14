import React from 'react';
import { owner } from '../../constants/business.js';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <strong>{owner.business}</strong>
      <span>{owner.address}</span>
    </footer>
  );
}
