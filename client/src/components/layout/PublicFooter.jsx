import React from 'react';
import { Link } from 'react-router-dom';
import { owner } from '../../constants/business.js';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <strong>{owner.business}</strong>
      <nav aria-label="Footer navigation">
        <Link to="/properties">Properties</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <span>{owner.address}</span>
    </footer>
  );
}
