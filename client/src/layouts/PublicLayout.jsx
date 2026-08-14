import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicNav from '../components/layout/PublicNav.jsx';
import PublicFooter from '../components/layout/PublicFooter.jsx';

export default function PublicLayout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ left: 0, top: window.scrollY });
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }, [location.pathname]);

  return (
    <main className="public-app">
      <PublicNav />
      <Outlet />
      <PublicFooter />
    </main>
  );
}
