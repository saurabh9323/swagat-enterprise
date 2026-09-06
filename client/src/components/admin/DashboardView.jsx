import React from 'react';
import { Activity, Home, IndianRupee, Phone, Target, TrendingUp, Users, Mail } from 'lucide-react';
import { microAreas } from '../../data/demoData.js';
import { owner } from '../../constants/business.js';
import { currency } from '../../utils/format.js';
import { getAdminAnalytics } from '../../utils/property.js';
import MetricCard from '../common/MetricCard.jsx';

function ProgressRow({ label, value, max }) {
  const width = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="analytics-row">
      <span>{label}</span>
      <b>{value}</b>
      <div className="demand-bar"><span style={{ width: `${width}%` }} /></div>
    </div>
  );
}

export default function DashboardView({ stats, hotLeads, properties, leads }) {
  const analytics = getAdminAnalytics(properties, leads);
  const maxStage = Math.max(1, ...Object.values(analytics.byStage));
  const maxArea = Math.max(1, ...analytics.topAreas.map((area) => area.count));

  return (
    <>
      <section className="admin-kpis">
        <MetricCard icon={<Home />} label="Listed References" value={stats.properties} />
        <MetricCard icon={<Users />} label="Lead Pipeline" value={stats.leads} />
        <MetricCard icon={<IndianRupee />} label="Projected Brokerage" value={currency(stats.brokerage)} />
        <MetricCard icon={<Target />} label="Hot Leads" value={hotLeads} />
      </section>

      <section className="analytics-strip">
        <article>
          <span><TrendingUp size={16} /> Sale inventory</span>
          <strong>{analytics.saleCount}</strong>
          <small>{currency(stats.value)} active sale value</small>
        </article>
        <article>
          <span><Activity size={16} /> Rental inventory</span>
          <strong>{analytics.rentCount}</strong>
          <small>{analytics.activeFollowUps} open follow-ups</small>
        </article>
        <article>
          <span><Target size={16} /> Average score</span>
          <strong>{stats.avgScore}%</strong>
          <small>{stats.hot} high-priority references</small>
        </article>
      </section>

      <section className="admin-grid">
        <div className="panel command-map">
          <div className="panel-title">
            <h2>Lead stage funnel</h2>
            <span className="pill">Kanban synced</span>
          </div>
          {['New', 'Contacted', 'Visit Booked', 'Negotiation', 'Won', 'Lost'].map((stage) => (
            <ProgressRow key={stage} label={stage} value={analytics.byStage[stage] || 0} max={maxStage} />
          ))}
        </div>

        <div className="panel command-map">
          <div className="panel-title">
            <h2>Inventory by area</h2>
            <span className="pill">Live listings</span>
          </div>
          {analytics.topAreas.length > 0 ? analytics.topAreas.map((area) => (
            <ProgressRow key={area.name} label={area.name} value={area.count} max={maxArea} />
          )) : microAreas.map((area) => (
            <div className="radar-row" key={area.name}>
              <span>{area.name}</span>
              <b>{area.demand}%</b>
              <div className="demand-bar"><span style={{ width: `${area.demand}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="panel command-map">
          <div className="panel-title">
            <h2>Lead type mix</h2>
            <span className="pill">Customer intent</span>
          </div>
          {['Buyer', 'Seller', 'Rental', 'Commercial', 'Investor'].map((type) => (
            <ProgressRow key={type} label={type} value={analytics.byLeadType[type] || 0} max={Math.max(1, ...Object.values(analytics.byLeadType))} />
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
