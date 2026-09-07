import React, { useEffect, useState } from 'react';
import { KeyRound, Save, ShieldCheck } from 'lucide-react';
import { useToast } from '../common/ToastProvider.jsx';
import { api } from '../../services/api.js';

const mfaMethods = ['none', 'email_otp', 'sms_otp', 'authenticator'];
const otpChannels = ['email', 'sms', 'whatsapp'];

function label(value) {
  return value.split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export default function SecuritySettingsPanel() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ mfaEnabled: false, mfaMethod: 'none', otpChannel: 'email' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.getMe()
      .then((result) => {
        const currentUser = result.user || result;
        if (cancelled || !currentUser) return;
        setUser(currentUser);
        setForm({
          mfaEnabled: Boolean(currentUser.mfaEnabled),
          mfaMethod: currentUser.mfaMethod || 'none',
          otpChannel: currentUser.otpChannel || 'email',
        });
      })
      .catch((error) => {
        setMessage(error.message || 'Could not load security settings.');
        toast.error(error, 'Security settings unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage('');
  }

  async function saveSecurity() {
    if (!user?.id) return;
    setSaving(true);
    try {
      const payload = {
        mfaEnabled: form.mfaEnabled,
        mfaMethod: form.mfaEnabled && form.mfaMethod === 'none' ? 'email_otp' : form.mfaMethod,
        otpChannel: form.otpChannel,
      };
      await api.updateUser(user.id, payload);
      setForm(payload);
      setMessage('Security settings saved.');
      toast.success('MFA and OTP settings saved.', 'Security saved');
    } catch (error) {
      setMessage(error.message || 'Security settings could not be saved.');
      toast.error(error, 'Security settings not saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel security-panel">
      <div className="panel-title">
        <h2>Login security</h2>
        <span className="pill"><ShieldCheck size={14} /> 5 min OTP</span>
      </div>
      <div className="security-grid">
        <label className="toggle-field"><input type="checkbox" checked={form.mfaEnabled} onChange={(event) => updateField('mfaEnabled', event.target.checked)} /> Require password + OTP</label>
        <label>MFA method
          <select value={form.mfaMethod} onChange={(event) => updateField('mfaMethod', event.target.value)}>
            {mfaMethods.map((method) => <option key={method} value={method}>{label(method)}</option>)}
          </select>
        </label>
        <label>OTP channel
          <select value={form.otpChannel} onChange={(event) => updateField('otpChannel', event.target.value)}>
            {otpChannels.map((channel) => <option key={channel} value={channel}>{label(channel)}</option>)}
          </select>
        </label>
      </div>
      <p><KeyRound size={15} /> OTP login is available. If MFA is enabled, password is required first, then OTP verification.</p>
      <button className="primary" type="button" onClick={saveSecurity} disabled={saving || !user}>
        <Save size={16} /> {saving ? 'Saving...' : 'Save security'}
      </button>
      {message && <small className="settings-message">{message}</small>}
    </section>
  );
}
