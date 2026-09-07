import React from 'react';
import PublicLayout from '../layouts/PublicLayout.jsx';
import NotFoundPage from '../views/public/NotFound/NotFoundPage.jsx';

export const metadata = {
  title: 'Page Not Found | Swagat Enterprise',
  description: 'The requested Swagat Enterprise page could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PublicLayout>
      <NotFoundPage />
    </PublicLayout>
  );
}
