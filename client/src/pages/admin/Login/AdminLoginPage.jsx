import React from 'react';
import { ArrowRight, KeyRound, ShieldCheck, Smartphone } from 'lucide-react';
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
  const [otp, setOtp] = React.useState('');
  const [loginMode, setLoginMode] = React.useState('password');
  const [otpChallenge, setOtpChallenge] = React.useState(null);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const redirectTo = location.state?.from || '/admin';

  function finishLogin(result) {
    setAdminToken(result.token);
    unlockAdminSession();
    navigate(redirectTo, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (otpChallenge) {
        const result = await api.verifyLoginOtp({ otpId: otpChallenge.otpId, otp });
        finishLogin(result);
        return;
      }

      if (loginMode === 'otp') {
        const result = await api.requestLoginOtp({ email, password: password || undefined });
        setOtpChallenge(result.challenge);
        setNotice(`OTP sent to ${result.challenge.destination || result.challenge.channel}. It expires in 5 minutes.`);
        return;
      }

      const result = await api.login({ email, password });
      if (result.mfaRequired) {
        setOtpChallenge(result.challenge);
        setNotice(`MFA OTP sent to ${result.challenge.destination || result.challenge.channel}. It expires in 5 minutes.`);
        return;
      }

      finishLogin(result);
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
        <p>Use password login, OTP login, or MFA OTP when enabled. OTP expires in 5 minutes.</p>
        <div className="login-mode-switcher">
          <button type="button" className={loginMode === 'password' ? 'active' : ''} onClick={() => { setLoginMode('password'); setOtpChallenge(null); setError(''); }}>
            <KeyRound size={16} /> Password
          </button>
          <button type="button" className={loginMode === 'otp' ? 'active' : ''} onClick={() => { setLoginMode('otp'); setOtpChallenge(null); setError(''); }}>
            <Smartphone size={16} /> OTP
          </button>
        </div>
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
              setNotice('');
            }}
          />
          {(loginMode === 'password' || otpChallenge?.passwordRequired) && !otpChallenge && (
            <>
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
                  setNotice('');
                }}
              />
            </>
          )}
          {loginMode === 'otp' && !otpChallenge && (
            <>
              <label htmlFor="admin-passwordless-password">Password for MFA accounts</label>
              <input
                id="admin-passwordless-password"
                type="password"
                autoComplete="current-password"
                placeholder="Only needed when MFA is enabled"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                  setNotice('');
                }}
              />
            </>
          )}
          {otpChallenge && (
            <>
              <label htmlFor="admin-otp">OTP code</label>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6 digit OTP"
                value={otp}
                maxLength={6}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
              />
            </>
          )}
          {notice ? <small className="login-notice">{notice}</small> : null}
          {error ? <small>{error}</small> : null}
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking...' : otpChallenge ? 'Verify OTP' : loginMode === 'otp' ? 'Send OTP' : 'Open dashboard'} <ArrowRight size={17} />
          </button>
          {otpChallenge && <button className="secondary-action" type="button" onClick={() => { setOtpChallenge(null); setOtp(''); setNotice(''); }}>Back</button>}
        </form>
      </section>
    </main>
  );
}
