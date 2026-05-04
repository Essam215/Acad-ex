import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', username: '', year: 'Junior' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    if (isLogin) {
      const res = await login(form.email, form.password);
      if (res.success) navigate('/dashboard');
      else { setError(res.error || 'Access denied. Check your credentials.'); setLoading(false); }
    } else {
      const metadata = {
        name: form.name,
        username: form.username,
        year: form.year,
        avatar: form.name.substring(0, 2).toUpperCase()
      };
      const res = await signup(form.email, form.password, metadata);
      if (res.success) {
        alert('Account created! You can now log in.');
        setIsLogin(true);
        setLoading(false);
      } else {
        setError(res.error || 'Registration failed.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', zIndex: 2,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.6s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 900, color: '#000',
            marginBottom: 20, boxShadow: '0 0 40px rgba(0,255,136,0.3)',
            animation: 'float 3s ease-in-out infinite',
          }}>A</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900,
            letterSpacing: 6, color: 'var(--text-primary)', marginBottom: 6,
          }}>
            <span className="shimmer-text">ACADEX</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, letterSpacing: 2 }}>
            ACADEMIC EXCELLENCE PLATFORM
          </p>
        </div>

        {/* Auth card */}
        <div className="card" style={{ padding: 32 }}>
          <div className="corner-tl" /><div className="corner-tr" />
          <div className="corner-bl" /><div className="corner-br" />

          <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => { setIsLogin(true); setError(''); }} style={{
              flex: 1, background: 'transparent', border: 'none', padding: '12px',
              color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isLogin ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: 700, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s'
            }}>LOGIN</button>
            <button onClick={() => { setIsLogin(false); setError(''); }} style={{
              flex: 1, background: 'transparent', border: 'none', padding: '12px',
              color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: !isLogin ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: 700, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s'
            }}>REGISTER</button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>FULL NAME</label>
                  <input className="input" placeholder="e.g. Ahmed Hassan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>USERNAME</label>
                  <input className="input" placeholder="e.g. ahmed123" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>ACADEMIC YEAR</label>
                  <select className="input" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                    <option value="Junior">Junior</option>
                    <option value="Wheeler">Wheeler</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>EMAIL</label>
              <input className="input" type="email" placeholder="student@school.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>PASSWORD</label>
              <input className="input" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 6, marginBottom: 16,
                background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
                color: 'var(--danger)', fontSize: 13,
              }}>{error}</div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 13, letterSpacing: 2 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid #00000033', borderTopColor: '#000', borderRadius: '50%', animation: 'rotate 0.6s linear infinite' }} /> PROCESSING...</>
              ) : (isLogin ? 'INITIALIZE SESSION →' : 'REGISTER ACCOUNT →')}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
          ACADEX v3.0 · CLOUD CONNECTED
        </p>
      </div>
    </div>
  );
}
