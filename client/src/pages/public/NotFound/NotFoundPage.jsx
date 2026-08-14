import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../../components/seo/Seo.jsx';

export default function NotFoundPage({ variant = 'public' }) {
  const home = variant === 'admin' ? '/admin' : '/';
  return (
    <section className={`page-shell not-found-state ${variant === 'admin' ? 'admin-placeholder' : ''}`}>
      {variant === 'public' ? (
        <Seo
          path="/404"
          title="Page Not Found | Swagat Enterprise"
          description="The requested Swagat Enterprise page could not be found."
        />
      ) : null}
      <h1>Page not found</h1>
      <p>The page you opened does not exist in the current Swagat Enterprise app.</p>
      <Link className="secondary-action" to={home}>Go back</Link>
    </section>
  );
}
