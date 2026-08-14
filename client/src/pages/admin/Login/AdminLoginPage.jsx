import React from 'react';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoLockup from '../../../components/common/LogoLockup.jsx';
import NoIndex from '../../../components/seo/NoIndex.jsx';
import { unlockAdmin } from '../../../utils/adminAuth.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState('');
  const redirectTo = location.state?.from || '/admin';

  function handleSubmit(event) {
    event.preventDefault();

    if (!unlockAdmin(pin)) {
      setError('Enter the owner PIN to open the admin desk.');
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="admin-login">
      <NoIndex title="Admin Login | Swagat Enterprise" />
      <LogoLockup href="/" />
      <section className="panel admin-login-card">
        <KeyRound size={28} />
        <span><ShieldCheck size={16} /> Owner access only</span>
        <h1>Admin desk login</h1>
        <p>Use the owner PIN to manage listings, leads and follow-ups.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-pin">Owner PIN</label>
          <input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value);
              setError('');
            }}
          />
          {error ? <small>{error}</small> : null}
          <button className="primary" type="submit">Open dashboard <ArrowRight size={17} /></button>
        </form>
      </section>
    </main>
  );
}
