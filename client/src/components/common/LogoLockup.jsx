import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { owner } from '../../constants/business.js';

export default function LogoLockup({ href = '/', icon = <Building2 size={22} />, title = owner.business, subtitle = 'Nalasopara East property desk' }) {
  return (
    <Link className="logo-lockup" to={href}>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </Link>
  );
}
