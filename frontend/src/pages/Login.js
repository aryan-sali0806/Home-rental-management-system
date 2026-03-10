import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
        }

        /* LEFT PANEL */
        .login-left {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px;
        }

        .login-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80');
          background-size: cover;
          background-position: center;
          filter: brightness(0.45);
          transform: scale(1.03);
          transition: transform 8s ease;
        }

        .login-left:hover .login-left-bg {
          transform: scale(1.08);
        }

        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.2) 60%,
            transparent 100%
          );
        }

        .login-left-content {
          position: relative;
          z-index: 2;
        }

        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .login-badge-dot {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .login-left-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .login-left-title span {
          color: #fbbf24;
        }

        .login-left-desc {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 40px;
        }

        .login-stats {
          display: flex;
          gap: 32px;
        }

        .login-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .login-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #fff;
          font-weight: 700;
        }

        .login-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* RIGHT PANEL */
        .login-right {
          width: 480px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6);
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
        }

        .login-logo-icon {
          width: 38px;
          height: 38px;
          background: #0a0a0a;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .login-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #0a0a0a;
          font-weight: 700;
        }

        .login-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #0a0a0a;
          margin-bottom: 8px;
        }

        .login-form-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 40px;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #0a0a0a;
          background: #fafafa;
          outline: none;
          transition: all 0.2s ease;
        }

        .login-input:focus {
          border-color: #0a0a0a;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: #0a0a0a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          background: #1f1f1f;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 13px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
          font-size: 12px;
          color: #d1d5db;
          text-align: center;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 40px 32px; }
        }
      `}</style>

      <div className="login-root">

        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <div className="login-badge">
              <div className="login-badge-dot" />
              System Online
            </div>
            <h1 className="login-left-title">
              Manage Your<br />
              <span>Rental Empire</span><br />
              With Ease
            </h1>
            <p className="login-left-desc">
              A complete property management platform for tracking owners,
              tenants, leases, payments, and maintenance — all in one place.
            </p>
            <div className="login-stats">
              <div className="login-stat">
                <span className="login-stat-num">100+</span>
                <span className="login-stat-label">Owners</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">500+</span>
                <span className="login-stat-label">Properties</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">1000+</span>
                <span className="login-stat-label">Tenants</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="login-logo">
            <div className="login-logo-icon">🏠</div>
            <span className="login-logo-text">RentAdmin</span>
          </div>

          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-subtitle">Sign in to your admin account</p>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <input
              className="login-input"
              type="email"
              placeholder="admin@rental.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div className="login-footer">
            © 2025 RentAdmin · Home Rental Management System
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;