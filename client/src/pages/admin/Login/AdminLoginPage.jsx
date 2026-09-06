import React from 'react';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoLockup from '../../../components/common/LogoLockup.jsx';
import NoIndex from '../../../components/seo/NoIndex.jsx';
import { api, setAdminToken } from '../../../services/api.js';
import { unlockAdminSession } from '../../../utils/adminAuth.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const redirectTo = location.state?.from || '/admin';

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await api.login({ email, password });
      setAdminToken(result.token);
      unlockAdminSession();
      navigate(redirectTo, { replace: true });
    } catch (apiError) {
      setError(apiError.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <NoIndex title="Admin Login | Swagat Enterprise" />
      <LogoLockup href="/" />
      <section className="panel admin-login-card">
        <KeyRound size={28} />
        <span><ShieldCheck size={16} /> Owner access only</span>
        <h1>Admin desk login</h1>
        <p>Use your admin email and password to manage listings, leads and follow-ups.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="satish.pathak52@gmail.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError('');
            }}
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
          />
          {error ? <small>{error}</small> : null}
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking...' : 'Open dashboard'} <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
