import React from 'react';
import { Home, IndianRupee, Phone, Target, Users, Mail } from 'lucide-react';
import { microAreas } from '../../data/demoData.js';
import { owner } from '../../constants/business.js';
import { currency } from '../../utils/format.js';
import MetricCard from '../common/MetricCard.jsx';

export default function DashboardView({ stats, hotLeads }) {
  return (
    <>
      <section className="admin-kpis">
        <MetricCard icon={<Home />} label="Listed References" value={stats.properties} />
        <MetricCard icon={<Users />} label="Lead Pipeline" value={stats.leads} />
        <MetricCard icon={<IndianRupee />} label="Projected Brokerage" value={currency(stats.brokerage)} />
        <MetricCard icon={<Target />} label="Hot Leads" value={hotLeads} />
      </section>

      <section className="admin-grid">
        <div className="panel command-map">
          <div className="panel-title">
            <h2>Nalasopara deal radar</h2>
            <span className="pill">Demo view</span>
          </div>
          {microAreas.map((area) => (
            <div className="radar-row" key={area.name}>
              <span>{area.name}</span>
              <b>{area.demand}%</b>
              <div className="demand-bar"><span style={{ width: `${area.demand}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="panel owner-desk">
          <h2>Owner profile</h2>
          <strong>{owner.proprietor}</strong>
          <p>Sole owner, {owner.business}</p>
          <a href={`tel:${owner.mobile}`}><Phone size={17} /> {owner.mobile}</a>
          <a href={`mailto:${owner.email}`}><Mail size={17} /> {owner.email}</a>
          <small>{owner.address}</small>
        </div>
      </section>
    </>
  );
}
