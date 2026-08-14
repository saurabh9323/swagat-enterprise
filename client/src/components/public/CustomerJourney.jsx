import React from 'react';
import { CalendarCheck, Home, MessageCircle, Route } from 'lucide-react';

const steps = [
  { icon: <MessageCircle size={22} />, title: 'Send Requirement', text: 'Share budget, location, family size or shop need on WhatsApp.' },
  { icon: <Route size={22} />, title: 'Get Shortlist', text: 'Compare useful local options around Ostwal Nagari, Achole Road and station belt.' },
  { icon: <CalendarCheck size={22} />, title: 'Plan Visit', text: 'Keep visit timing, owner call and next follow-up organized.' },
  { icon: <Home size={22} />, title: 'Move Forward', text: 'Discuss final terms, brokerage and documentation clearly before decision.' },
];

export default function CustomerJourney() {
  return (
    <section className="journey-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Customer journey</p>
          <h2>From WhatsApp message to site visit, without confusion.</h2>
        </div>
      </div>
      <div className="journey-grid">
        {steps.map((step, index) => (
          <article key={step.title}>
            <span>{index + 1}</span>
            {step.icon}
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
