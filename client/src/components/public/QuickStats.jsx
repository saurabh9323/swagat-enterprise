import React from 'react';
import { Home, MapPin, TrendingUp, Users } from 'lucide-react';
import MetricCard from '../common/MetricCard.jsx';

export default function QuickStats({ stats }) {
  return (
    <section className="quick-strip" aria-label="Business snapshot">
      <MetricCard icon={<Home />} label="Live References" value={stats.properties} />
      <MetricCard icon={<Users />} label="Active Buyers" value={stats.leads} />
      <MetricCard icon={<TrendingUp />} label="Strong Fits" value={stats.hot} />
      <MetricCard icon={<MapPin />} label="Base Office" value="Nalasopara East" />
    </section>
  );
}
