'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PublicNav from '../components/layout/PublicNav.jsx';
import PublicFooter from '../components/layout/PublicFooter.jsx';

export default function PublicLayout({ children }) {
  const pathname = usePathname();

  React.useEffect(() => {
    window.scrollTo({ left: 0, top: window.scrollY });
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }, [pathname]);

  return (
    <div className="public-app">
      <PublicNav />
      <main className="public-main">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
