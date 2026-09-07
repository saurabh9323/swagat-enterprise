import React from 'react';
import { ArrowRight, BadgeIndianRupee, CheckCircle2, MessageCircle, MapPin, Search, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import { owner } from '../../constants/business.js';
import { whatsappUrl } from '../../utils/format.js';

export default function HeroSection({ selectedProperty }) {
  const message = `Hi, I am looking for property options with ${owner.business}.`;

  return (
    <section className="public-hero">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={16} /> Local property references by {owner.proprietor}</p>
        <h1>Swagat Enterprise</h1>
        <h2>Real estate services in Nalasopara East.</h2>
        <p>
          Flats, shops, resale and rental options around Ostwal Nagari, 90 Feet Road,
          Achole Road and the station belt. Shortlist faster, contact directly, and
          keep every visit clear.
        </p>
        <div className="hero-actions">
          <a href={whatsappUrl(owner.mobile, message)} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> WhatsApp now
          </a>
          <Link href="/properties">
            View listings <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hero-search-card" aria-label="Popular property search options">
          <Search size={19} />
          <div>
            <strong>Start with your pocket</strong>
            <span>1 BHK, rentals, shops, resale, near 90 Feet Road</span>
          </div>
          <Link href="/properties">Explore</Link>
        </div>

        <div className="hero-proof">
          {['Direct contact', 'Local shortlist', 'Visit planning'].map((item) => (
            <span key={item}><CheckCircle2 size={15} /> {item}</span>
          ))}
        </div>
      </div>

      <div className="hero-showcase" aria-label="Featured property snapshot">
        <div className="hero-glow" />
        <div className="orbit-card card-a">
          <BadgeIndianRupee size={20} />
          <span>Starting</span>
          <strong>Rs. 36.5L</strong>
        </div>
        <div className="orbit-card card-b">
          <Target size={20} />
          <span>Top fit</span>
          <strong>{selectedProperty.score}%</strong>
        </div>
        <div className="orbit-card card-c">
          <MapPin size={20} />
          <span>Focus area</span>
          <strong>Nalasopara</strong>
        </div>
        <img src={selectedProperty.image} alt={`${selectedProperty.title} in ${selectedProperty.location}`} loading="eager" />
        <div className="glass-ticket">
          <span>{selectedProperty.status}</span>
          <strong>{selectedProperty.title}</strong>
          <p><MapPin size={15} /> {selectedProperty.location}</p>
        </div>
      </div>
    </section>
  );
}
