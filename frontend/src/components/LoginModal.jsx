import React, { useState } from 'react';
import { api } from '../services/api';

export default function LoginModal({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        const res = await api.registerInstructor({ name, email, password, phone, bio });
        onLoginSuccess(res.data);
      } else {
        const res = await api.login(email, password);
        onLoginSuccess(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      if (role === 'INSTRUCTOR') {
        const res = await api.login('instructor@lms.com', 'admin123');
        onLoginSuccess(res.data);
      }
    } catch (err) {
      setError(err.message + ' (Make sure your backend is running and MySQL connected)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginBottom: '12px',
          }}>
            🎓
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            {isRegisterMode ? 'Instructor Registration' : 'Welcome to EduLMS'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            {isRegisterMode
              ? 'Create your instructor account to build courses & manage students.'
              : 'Sign in as an Instructor or Student to access your portal.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegisterMode && (
            <>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Designation / Bio
                </label>
                <input
                  type="text"
                  placeholder="Senior Software Architecture Instructor"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. instructor@lms.com or student@lms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '12px', fontSize: '1rem' }}
          >
            {loading ? 'Please wait...' : isRegisterMode ? 'Complete Registration' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem' }}>
          {isRegisterMode ? (
            <span style={{ color: '#64748b' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(''); }}
                style={{ background: 'none', color: '#4f46e5', fontWeight: 600, padding: 0 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span style={{ color: '#64748b' }}>
              Are you a new instructor?{' '}
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setError(''); }}
                style={{ background: 'none', color: '#4f46e5', fontWeight: 600, padding: 0 }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>

        {!isRegisterMode && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Demo Login
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('INSTRUCTOR')}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
              >
                👨‍🏫 Demo Instructor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
