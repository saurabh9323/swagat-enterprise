import React from 'react';
import { BarChart3, BriefcaseBusiness, ClipboardList, Home, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminSections } from '../../constants/business.js';
import { clearAdminToken } from '../../services/api.js';
import { lockAdmin } from '../../utils/adminAuth.js';
import LogoLockup from '../common/LogoLockup.jsx';

const sectionIcons = {
  dashboard: <BarChart3 size={18} />,
  properties: <ClipboardList size={18} />,
  leads: <Users size={18} />,
  users: <Users size={18} />,
  deals: <BriefcaseBusiness size={18} />,
  settings: <Settings size={18} />,
};

export default function AdminSidebar({ isOpen = false, onNavigate = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    onNavigate();
    lockAdmin();
    clearAdminToken();
    router.replace('/admin/login');
  }

  return (
    <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`}>
      <LogoLockup href="/admin" icon={<LayoutDashboard size={22} />} title="Swagat Admin" subtitle="Owner desk" onClick={onNavigate} />
      <nav aria-label="Admin navigation">
        {adminSections.map((section) => (
          <Link
            className={pathname === section.href || (section.href !== '/admin' && pathname.startsWith(section.href)) ? 'active' : ''}
            key={section.id}
            href={section.href}
            onClick={onNavigate}
          >
            {sectionIcons[section.id]} {section.label}
          </Link>
        ))}
      </nav>
      <Link className="back-site" href="/" onClick={onNavigate}><Home size={17} /> Public site</Link>
      <button className="back-site admin-logout" type="button" onClick={handleLogout}><LogOut size={17} /> Lock admin</button>
    </aside>
  );
}
