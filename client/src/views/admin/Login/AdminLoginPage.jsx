import React from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, RotateCcw, ShieldCheck, Smartphone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogoLockup from '../../../components/common/LogoLockup.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';
import { api, setAdminToken } from '../../../services/api.js';
import { unlockAdminSession } from '../../../utils/adminAuth.js';

export default function AdminLoginPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loginMode, setLoginMode] = React.useState('password');
  const [otpChallenge, setOtpChallenge] = React.useState(null);
  const [otpSource, setOtpSource] = React.useState('otp');
  const [otpExpiresAt, setOtpExpiresAt] = React.useState(null);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const otpInputsRef = React.useRef([]);
  const redirectTo = searchParams.get('from') || '/admin';
  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] || '');

  React.useEffect(() => {
    if (!otpChallenge || !otpExpiresAt) {
      setSecondsLeft(0);
      return undefined;
    }

    function tick() {
      setSecondsLeft(Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000)));
    }

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [otpChallenge, otpExpiresAt]);

  React.useEffect(() => {
    if (otpChallenge) {
      window.setTimeout(() => otpInputsRef.current[0]?.focus(), 40);
    }
  }, [otpChallenge]);

  function formatCountdown(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function startOtpChallenge(challenge, source, message) {
    setOtpChallenge(challenge);
    setOtpSource(source);
    setOtp('');
    setOtpExpiresAt(Date.now() + 5 * 60 * 1000);
    setNotice(message);
  }

  function resetToPassword() {
    setLoginMode('password');
    setOtpChallenge(null);
    setOtp('');
    setOtpExpiresAt(null);
    setNotice('');
    setError('');
  }

  function handleOtpChange(index, value) {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      const nextOtp = otp.split('');
      nextOtp[index] = '';
      setOtp(nextOtp.join('').slice(0, 6));
      setError('');
      return;
    }

    const nextOtp = otp.padEnd(6, ' ').split('');
    digits.slice(0, 6 - index).split('').forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    const normalizedOtp = nextOtp.join('').replace(/\s/g, '').slice(0, 6);
    setOtp(normalizedOtp);
    setError('');
    const nextIndex = Math.min(5, index + digits.length);
    otpInputsRef.current[nextIndex]?.focus();
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  }

  function finishLogin(result) {
    setAdminToken(result.token);
    unlockAdminSession();
    router.replace(redirectTo);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (otpChallenge) {
        if (secondsLeft <= 0) {
          setError('OTP expired. Please resend a new code.');
          return;
        }
        const result = await api.verifyLoginOtp({ otpId: otpChallenge.otpId, otp });
        finishLogin(result);
        return;
      }

      if (loginMode === 'otp') {
        const result = await api.requestLoginOtp({ email });
        startOtpChallenge(result.challenge, 'otp', `OTP sent to ${result.challenge.destination || result.challenge.channel}.`);
        toast.info('OTP sent. It expires in 5 minutes.', 'Check OTP');
        return;
      }

      const result = await api.login({ email, password });
      if (result.mfaRequired) {
        startOtpChallenge(result.challenge, 'mfa', `Security OTP sent to ${result.challenge.destination || result.challenge.channel}.`);
        toast.info('Security OTP sent. It expires in 5 minutes.', 'Second step required');
        return;
      }

      finishLogin(result);
    } catch (apiError) {
      setError(apiError.message || 'Unable to sign in.');
      toast.error(apiError, 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (otpSource === 'mfa') {
        const result = await api.login({ email, password });
        if (result.mfaRequired) {
          startOtpChallenge(result.challenge, 'mfa', `Security OTP resent to ${result.challenge.destination || result.challenge.channel}.`);
          toast.info('New security OTP sent. It expires in 5 minutes.', 'OTP resent');
        } else {
          finishLogin(result);
        }
        return;
      }

      const result = await api.requestLoginOtp({ email });
      startOtpChallenge(result.challenge, 'otp', `OTP resent to ${result.challenge.destination || result.challenge.channel}.`);
      toast.info('New OTP sent. It expires in 5 minutes.', 'OTP resent');
    } catch (apiError) {
      setError(apiError.message || 'Unable to resend OTP.');
      toast.error(apiError, 'OTP resend failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <LogoLockup href="/" />
      <section className="panel admin-login-card">
        <KeyRound size={28} />
        <span><ShieldCheck size={16} /> Owner access only</span>
        <h1>Admin desk login</h1>
        <p>{otpChallenge ? 'Enter the 6 digit OTP sent to the owner account. It expires in 5 minutes.' : 'Use password login or request a one-time OTP for owner access.'}</p>
        {!otpChallenge && (
          <div className="login-mode-switcher">
          <button type="button" className={loginMode === 'password' ? 'active' : ''} onClick={() => { setLoginMode('password'); setOtpChallenge(null); setError(''); setNotice(''); }}>
            <KeyRound size={16} /> Password
          </button>
          <button type="button" className={loginMode === 'otp' ? 'active' : ''} onClick={() => { setLoginMode('otp'); setOtpChallenge(null); setError(''); setNotice(''); }}>
            <Smartphone size={16} /> OTP
          </button>
          </div>
        )}
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
          {loginMode === 'password' && !otpChallenge && (
            <>
              <label htmlFor="admin-password">Password</label>
              <div className="password-field">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                    setNotice('');
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          )}
          {otpChallenge && (
            <>
              <label htmlFor="admin-otp">OTP code</label>
              <div className="otp-box-row" id="admin-otp">
                {otpDigits.map((digit, index) => (
                  <input
                    aria-label={`OTP digit ${index + 1}`}
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    inputMode="numeric"
                    key={index}
                    maxLength={1}
                    ref={(element) => {
                      otpInputsRef.current[index] = element;
                    }}
                    type="text"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={(event) => {
                      event.preventDefault();
                      handleOtpChange(index, event.clipboardData.getData('text'));
                    }}
                  />
                ))}
              </div>
              <div className="otp-tools">
                <span className={secondsLeft <= 30 ? 'otp-countdown is-ending' : 'otp-countdown'}>
                  {secondsLeft > 0 ? `Expires in ${formatCountdown(secondsLeft)}` : 'OTP expired'}
                </span>
                <button className="otp-link" type="button" disabled={isSubmitting} onClick={handleResendOtp}>
                  <RotateCcw size={15} /> Resend OTP
                </button>
              </div>
            </>
          )}
          {notice ? <small className="login-notice">{notice}</small> : null}
          {error ? <small>{error}</small> : null}
          <button className="primary" type="submit" disabled={isSubmitting || (otpChallenge && (otp.length < 6 || secondsLeft <= 0))}>
            {isSubmitting ? 'Checking...' : otpChallenge ? 'Verify OTP' : loginMode === 'otp' ? 'Send OTP' : 'Open dashboard'} <ArrowRight size={17} />
          </button>
          {otpChallenge && <button className="secondary-action" type="button" onClick={resetToPassword}>Back to password</button>}
        </form>
      </section>
    </main>
  );
}
