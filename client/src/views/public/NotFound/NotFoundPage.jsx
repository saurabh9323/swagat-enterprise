import React from 'react';
import Link from 'next/link';

export default function NotFoundPage({ variant = 'public' }) {
  const home = variant === 'admin' ? '/admin' : '/';
  return (
    <section className={`page-shell not-found-state ${variant === 'admin' ? 'admin-placeholder' : ''}`}>
      <h1>Page not found</h1>
      <p>The page you opened does not exist in the current Swagat Enterprise app.</p>
      <Link className="secondary-action" href={home}>Go back</Link>
    </section>
  );
}
