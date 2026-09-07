import React from 'react';
import Link from 'next/link';
import { owner } from '../../constants/business.js';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <strong>{owner.business}</strong>
      <nav aria-label="Footer navigation">
        <Link href="/properties">Properties</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <span>{owner.address}</span>
    </footer>
  );
}
