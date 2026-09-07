import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, ShieldCheck, UserPlus, UsersRound, X } from 'lucide-react';
import { useToast } from '../common/ToastProvider.jsx';
import { api } from '../../services/api.js';

const defaultUser = {
  name: '',
  email: '',
  phone: '',
  username: '',
  alternatePhone: '',
  jobTitle: '',
  branch: 'Nalasopara East',
  password: '',
  role: 'staff',
  mfaEnabled: false,
  mfaMethod: 'none',
  otpChannel: 'email',
  isActive: true,
};

const roles = ['staff', 'admin', 'owner', 'super_admin'];
const mfaMethods = ['none', 'email_otp', 'sms_otp', 'authenticator'];
const otpChannels = ['email', 'sms', 'whatsapp'];

function roleLabel(role) {
  return role.split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function userFormValue(user) {
  if (!user) return defaultUser;

  return {
    ...defaultUser,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    username: user.username || '',
    alternatePhone: user.alternatePhone || '',
    jobTitle: user.jobTitle || '',
    branch: user.branch || 'Nalasopara East',
    password: '',
    role: user.role || 'staff',
    mfaEnabled: Boolean(user.mfaEnabled),
    mfaMethod: user.mfaMethod || 'none',
    otpChannel: user.otpChannel || 'email',
    isActive: user.isActive !== false,
  };
}

export default function UserManagement() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(defaultUser);
  const [editingUser, setEditingUser] = useState(null);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const result = await api.getUsers(query ? { q: query } : {});
      setUsers(Array.isArray(result) ? result : []);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Users could not be loaded.');
      toast.error(apiError, 'Users could not be loaded');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const activeUsers = useMemo(() => users.filter((user) => user.isActive !== false).length, [users]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || (!editingUser && !form.password.trim())) {
      setError(editingUser ? 'Name and email are required.' : 'Name, email and password are required.');
      toast.error(editingUser ? 'Name and email are required.' : 'Name, email and password are required.', 'User not saved');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        username: form.username.trim() || undefined,
        alternatePhone: form.alternatePhone.trim() || undefined,
        jobTitle: form.jobTitle.trim() || undefined,
        branch: form.branch.trim() || 'Nalasopara East',
        password: form.password.trim() || undefined,
        role: form.role,
        mfaEnabled: form.mfaEnabled,
        mfaMethod: form.mfaEnabled && form.mfaMethod === 'none' ? 'email_otp' : form.mfaMethod,
        otpChannel: form.otpChannel,
        isActive: form.isActive,
      };

      if (editingUser) {
        const updated = await api.updateUser(editingUser.id, payload);
        setUsers((current) => current.map((user) => (user.id === editingUser.id ? updated : user)));
        setEditingUser(null);
        setMessage('User updated successfully.');
        toast.success('User updated successfully.', 'User saved');
      } else {
        const created = await api.createUser(payload);
        setUsers((current) => [created, ...current]);
        setMessage('User created successfully.');
        toast.success('User created successfully.', 'User saved');
      }

      setForm(defaultUser);
    } catch (apiError) {
      setError(apiError.message || `User could not be ${editingUser ? 'updated' : 'created'}.`);
      toast.error(apiError, `User could not be ${editingUser ? 'updated' : 'created'}`);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(user) {
    setEditingUser(user);
    setForm(userFormValue(user));
    setError('');
    setMessage('');
  }

  function cancelEdit() {
    setEditingUser(null);
    setForm(defaultUser);
    setError('');
    setMessage('');
  }

  async function deactivateUser(userId) {
    try {
      const updated = await api.deleteUser(userId);
      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, ...updated, isActive: false } : user)));
      setMessage('User deactivated.');
      toast.success('User access has been deactivated.', 'User deactivated');
    } catch (apiError) {
      setError(apiError.message || 'User could not be deactivated.');
      toast.error(apiError, 'User could not be deactivated');
    }
  }

  return (
    <section className="users-workspace">
      <div className="panel user-form-panel">
        <div className="panel-title">
          <h2>{editingUser ? 'Edit user' : 'Add user'}</h2>
          <span className="pill"><ShieldCheck size={14} /> {editingUser ? 'Access update' : 'Role wise'}</span>
        </div>
        <form className="user-management-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Name<input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Satish Pathak" /></label>
            <label>Email<input value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="user@email.com" inputMode="email" /></label>
            <label>Phone<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="Mobile number" inputMode="tel" /></label>
            <label>Username<input value={form.username} onChange={(event) => updateField('username', event.target.value)} placeholder="satish" /></label>
            <label>Alternate phone<input value={form.alternatePhone} onChange={(event) => updateField('alternatePhone', event.target.value)} placeholder="Optional" inputMode="tel" /></label>
            <label>Job title<input value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} placeholder="Sales manager" /></label>
            <label>Branch<input value={form.branch} onChange={(event) => updateField('branch', event.target.value)} placeholder="Nalasopara East" /></label>
            <label>Password<input type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder={editingUser ? 'Leave blank to keep current' : 'Minimum 8 characters'} /></label>
            <label>Role
              <select value={form.role} onChange={(event) => updateField('role', event.target.value)}>
                {roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
              </select>
            </label>
            <label>MFA method
              <select value={form.mfaMethod} onChange={(event) => updateField('mfaMethod', event.target.value)}>
                {mfaMethods.map((method) => <option key={method} value={method}>{roleLabel(method)}</option>)}
              </select>
            </label>
            <label>OTP channel
              <select value={form.otpChannel} onChange={(event) => updateField('otpChannel', event.target.value)}>
                {otpChannels.map((channel) => <option key={channel} value={channel}>{roleLabel(channel)}</option>)}
              </select>
            </label>
            <label className="toggle-field"><input type="checkbox" checked={form.mfaEnabled} onChange={(event) => updateField('mfaEnabled', event.target.checked)} /> MFA enabled</label>
            <label className="toggle-field"><input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} /> Active user</label>
          </div>
          {error && <small className="form-error">{error}</small>}
          {message && <small className="settings-message">{message}</small>}
          <button className="primary" type="submit" disabled={saving}>
            <UserPlus size={18} /> {saving ? 'Saving user...' : editingUser ? 'Update user' : 'Create user'}
          </button>
          {editingUser && <button className="secondary-action" type="button" onClick={cancelEdit}>Cancel edit</button>}
        </form>
      </div>

      <div className="panel users-list-panel">
        <div className="panel-title">
          <h2>Team access</h2>
          <span className="pill"><UsersRound size={14} /> {activeUsers} active</span>
        </div>
        <div className="user-search-row">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" />
          <button type="button" onClick={loadUsers}>Search</button>
        </div>
        <div className="user-list">
          {loading && <p className="empty-column">Loading users...</p>}
          {!loading && users.map((user) => (
            <article className="user-card" key={user.id}>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>{user.phone || 'No phone'} &middot; {user.branch || 'No branch'}</small>
              </div>
              <div>
                <b>{roleLabel(user.role || 'staff')}</b>
                <span>{user.mfaEnabled ? `${roleLabel(user.mfaMethod)} MFA` : 'MFA off'}</span>
              </div>
              <button type="button" onClick={() => startEdit(user)} aria-label={`Edit ${user.name}`}>
                <Pencil size={16} />
              </button>
              {user.isActive !== false && (
                <button type="button" onClick={() => window.confirm(`Deactivate ${user.name}?`) && deactivateUser(user.id)} aria-label={`Deactivate ${user.name}`}>
                  <X size={16} />
                </button>
              )}
            </article>
          ))}
          {!loading && users.length === 0 && <p className="empty-column">No users found</p>}
        </div>
      </div>
    </section>
  );
}
