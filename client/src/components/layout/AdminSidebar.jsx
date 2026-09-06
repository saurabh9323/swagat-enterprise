import React from 'react';
import { BarChart3, BriefcaseBusiness, ClipboardList, Home, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { adminSections } from '../../constants/business.js';
import { clearAdminToken } from '../../services/api.js';
import { lockAdmin } from '../../utils/adminAuth.js';
import LogoLockup from '../common/LogoLockup.jsx';

const sectionIcons = {
  dashboard: <BarChart3 size={18} />,
  properties: <ClipboardList size={18} />,
  leads: <Users size={18} />,
  deals: <BriefcaseBusiness size={18} />,
  settings: <Settings size={18} />,
};

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    lockAdmin();
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  return (
    <aside className="admin-sidebar">
      <LogoLockup href="/admin" icon={<LayoutDashboard size={22} />} title="Swagat Admin" subtitle="Owner desk" />
      <nav aria-label="Admin navigation">
        {adminSections.map((section) => (
          <NavLink
            end={section.href === '/admin'}
            key={section.id}
            to={section.href}
          >
            {sectionIcons[section.id]} {section.label}
          </NavLink>
        ))}
      </nav>
      <Link className="back-site" to="/"><Home size={17} /> Public site</Link>
      <button className="back-site admin-logout" type="button" onClick={handleLogout}><LogOut size={17} /> Lock admin</button>
    </aside>
  );
}
