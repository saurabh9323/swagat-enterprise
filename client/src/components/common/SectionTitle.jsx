import React from 'react';
export default function SectionTitle({ icon, eyebrow, title, level = 2 }) {
  const Heading = `h${level}`;

  return (
    <div className="section-title">
      <div>
        <p className="eyebrow">{icon} {eyebrow}</p>
        <Heading>{title}</Heading>
      </div>
    </div>
  );
}
