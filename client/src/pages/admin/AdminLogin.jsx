import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@jjafoundation.org');
  const [password, setPassword] = useState('Admin2026Secure!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        login(data.token, data.user);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection error. Please ensure API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 60%, #0d213f 100%)', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '3rem 2.25rem', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(212, 175, 55, 0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.45rem', color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
            Administration Portal
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--gold-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Jehovah Jireh Alby Foundation
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--rose-50)', border: '1px solid var(--rose-600)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-navy btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Credentials Reminder Box */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--gold-400)', fontSize: '0.8rem', color: 'var(--text-body)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--navy-900)', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Info size={14} style={{ color: 'var(--gold-600)' }} />
            <span>Default Administrator Credentials:</span>
          </div>
          <div><strong>Email:</strong> admin@jjafoundation.org</div>
          <div><strong>Password:</strong> Admin2026Secure!</div>
          <div style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            (Password can be changed anytime in Admin Settings)
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--navy-700)', fontSize: '0.85rem', fontWeight: 600 }}>
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
