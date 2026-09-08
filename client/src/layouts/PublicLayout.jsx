import React from 'react';
import PublicNav from '../components/layout/PublicNav.jsx';
import PublicFooter from '../components/layout/PublicFooter.jsx';
import ScrollReset from '../components/layout/ScrollReset.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="public-app">
      <ScrollReset />
      <PublicNav />
      <main className="public-main">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
