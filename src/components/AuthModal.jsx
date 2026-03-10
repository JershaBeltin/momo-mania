import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, showToast }) {
  const [tab, setTab]       = useState('login');
  const [form, setForm]     = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (tab === 'signup' && !form.name)  { setError('Name is required.'); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
        showToast('🎉 Welcome back!');
      } else {
        await register(form.name, form.email, form.password, form.phone);
        showToast(`🎉 Welcome to MomoMania, ${form.name}!`);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-title">🥟 MOMO MANIA</div>
        <div className="modal-sub">Sign in to save your address &amp; track orders</div>

        <div className="modal-tabs">
          <button className={`modal-tab${tab === 'login'  ? ' active' : ''}`} onClick={() => { setTab('login');  setError(''); }}>Log In</button>
          <button className={`modal-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>

        {tab === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Radhika Thapa" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        {tab === 'signup' && (
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <button className="form-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : tab === 'login' ? 'LOG IN →' : 'CREATE ACCOUNT →'}
        </button>
      </div>
    </div>
  );
}