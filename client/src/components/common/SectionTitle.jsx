import React from 'react';
export default function SectionTitle({ icon, eyebrow, title }) {
  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">{icon} {eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}
