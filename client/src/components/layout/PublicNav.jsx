import React from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { publicNavItems } from '../../constants/business.js';
import LogoLockup from '../common/LogoLockup.jsx';

export default function PublicNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('nav-open', isMenuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="public-nav">
      <LogoLockup />
      <button
        className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
        type="button"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <button
        className={`nav-scrim ${isMenuOpen ? 'show' : ''}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={closeMenu}
      />

      <nav className={isMenuOpen ? 'open' : ''} aria-label="Public navigation">
        {publicNavItems.map((item) => (
          <NavLink to={item.href} key={item.href} onClick={closeMenu}>{item.label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
