import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const LoginPage = () => {
  const [formData, setFormData]       = useState({ email: '', password: '' });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [errors, setErrors]           = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [focused, setFocused]         = useState('');
  const canvasRef = useRef(null);

  /* ── auth checks ── */
  useEffect(() => {
    checkAuthStatus();
    checkGoogleAuth();
    checkUrlToken();
    generateCaptcha();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setIsCheckingAuth(false); return; }
      const res = await axios.get('/api/check-auth', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.authenticated) {
        window.location.href = res.data.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
        return;
      }
      localStorage.removeItem('authToken');
    } catch { localStorage.removeItem('authToken'); }
    finally { setIsCheckingAuth(false); }
  };

  const checkGoogleAuth = () => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get('token'), userData = p.get('user'), err = p.get('error');
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        window.history.replaceState({}, '', window.location.pathname);
        window.location.href = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
      } catch { setErrors({ general: 'Failed to process authentication data' }); }
    }
    if (err) { setErrors({ general: `Google authentication failed: ${err}` }); window.history.replaceState({}, '', window.location.pathname); }
  };

  const checkUrlToken = () => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get('token'), userData = p.get('user');
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        window.history.replaceState({}, '', window.location.pathname);
        window.location.href = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
      } catch {}
    }
  };

  /* ── captcha ── */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    setCaptchaText(Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
    setErrors(p => ({ ...p, captcha: '' }));
  };

  useEffect(() => {
    if (!canvasRef.current || !captchaText) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // bg
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, '#FEF3C7'); g.addColorStop(1, '#FFF8EE');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(217,119,6,0.15)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height); ctx.stroke();
    }
    // letters
    captchaText.split('').forEach((ch, i) => {
      ctx.save();
      ctx.translate(14 + i * 22, 22 + (Math.random() * 6 - 3));
      ctx.rotate(Math.random() * 0.4 - 0.2);
      ctx.font = `bold ${18 + Math.random() * 4}px ${SANS}`;
      ctx.fillStyle = i % 2 === 0 ? '#1E293B' : '#D97706';
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [captchaText]);

  useEffect(() => { setErrors({}); setSuccessMessage(''); }, [formData, userCaptcha]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    if (!userCaptcha) e.captcha = 'CAPTCHA is required';
    else if (userCaptcha.toUpperCase() !== captchaText) e.captcha = 'CAPTCHA does not match';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true); setErrors({}); setSuccessMessage('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); setIsLoading(false); return; }
    try {
      const res = await axios.post('/api/login/user', { email: formData.email.toLowerCase().trim(), password: formData.password });
      if (res.data.success) {
        setSuccessMessage('Login successful! Redirecting...');
        if (res.data.token) localStorage.setItem('authToken', res.data.token);
        if (res.data.user)  localStorage.setItem('userData', JSON.stringify(res.data.user));
        setTimeout(() => { window.location.href = res.data.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/home'; }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      if (msg === 'Invalid login') setErrors({ general: 'No account found with this email.' });
      else if (msg === 'Wrong password') setErrors({ general: 'Incorrect password. Please try again.' });
      else if (msg === 'Use Google Sign-In for this account') setErrors({ general: 'This email uses Google Sign-In.' });
      else setErrors({ general: msg });
      generateCaptcha(); setUserCaptcha('');
    } finally { setIsLoading(false); }
  };

  const handleGoogle = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(window.location.origin + '/login')}`;
  };

  if (isCheckingAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FFF8EE,#FEF3C7)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #D97706', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#64748B', fontFamily: SANS }}>Checking authentication...</p>
      </div>
    </div>
  );

  const inputStyle = (field) => ({
    width: '100%',
    padding: '11px 0',
    border: 'none',
    borderBottom: `2px solid ${errors[field] ? '#EF4444' : focused === field ? '#d08c00' : '#c7ccd4'}`,
    borderRadius: 0,
    fontSize: '0.9rem',
    fontFamily: SANS,
    color: '#1E293B',
    background: 'transparent',
    outline: 'none',
    transition: 'border-color 0.25s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#8A8F99',
    marginBottom: 2,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: SANS,
  };

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%)', fontFamily: SANS, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .auth-wrap {
          height: 100vh;
          padding: 22px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: min(1060px, 100%);
          height: min(90vh, 640px);
          border-radius: 16px;
          background: #f6f7fb;
          box-shadow: 0 28px 65px rgba(0, 0, 0, 0.22);
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          overflow: hidden;
          position: relative;
          animation: fadeUp 0.45s ease;
        }

        .auth-dot {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: rgba(241, 244, 252, 0.95);
          box-shadow: 0 8px 14px rgba(0,0,0,0.08);
        }

        .auth-dot.top { top: -14px; left: -14px; }
        .auth-dot.bottom { right: -14px; bottom: -14px; }

        .auth-right {
          position: relative;
          background: #f2f4f8;
        }

        .auth-right img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 65% center;
        }

        .auth-input::placeholder {
          color: #b2b8c2;
        }

        @media (max-width: 980px) {
          .auth-card {
            grid-template-columns: 1fr;
            max-width: 580px;
            height: min(92vh, 740px);
          }

          .auth-right {
            min-height: 260px;
            order: -1;
          }

          .auth-right img {
            object-position: center 22%;
          }
        }

        @media (max-width: 640px) {
          .auth-wrap {
            padding-top: 12px;
          }

          .auth-left-inner {
            padding: 20px 18px;
          }
        }
      `}</style>

      <Link
        to="/"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 20,
          textDecoration: 'none',
          padding: '8px 14px',
          borderRadius: 999,
          border: '1px solid rgba(0,0,0,0.18)',
          color: '#2f3643',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(4px)',
          fontSize: '0.82rem',
          fontWeight: 700,
        }}
      >
        Back to Home
      </Link>

      <div className="auth-wrap">
        <div className="auth-card">
          <span className="auth-dot top" />
          <span className="auth-dot bottom" />

          <div className="auth-left-inner" style={{ padding: '24px 34px 18px', overflow: 'hidden' }}>
            <div style={{ marginBottom: '0.7rem' }}>
              <h1 style={{ fontFamily: SERIF, fontSize: '2.05rem', color: '#151821', marginBottom: 6, lineHeight: 1.1 }}>
                Welcome to the world
              </h1>
              <p style={{ color: '#7f858f', fontSize: '0.86rem' }}>
                of your raadhyam music
              </p>
            </div>

            <div style={{ marginBottom: 8, color: '#5c616c', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase' }}>
              Login
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              {successMessage && (
                <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 10, padding: '9px 12px', color: '#065F46', fontSize: '0.84rem', marginBottom: 10 }}>
                  {successMessage}
                </div>
              )}
              {errors.general && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '9px 12px', color: '#991B1B', fontSize: '0.84rem' }}>
                  {errors.general}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div>
                <label style={labelStyle}>Name/Email</label>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  style={inputStyle('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                />
                {errors.email && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: 4 }}>{errors.email}</p>}
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="auth-input"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{ ...inputStyle('password'), paddingRight: 32 }}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a1a7b2' }}
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: 4 }}>{errors.password}</p>}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={labelStyle}>Captcha</label>
                  <button type="button" onClick={generateCaptcha} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b57a00', background: 'rgba(208,140,0,0.08)', border: '1px solid rgba(208,140,0,0.25)', borderRadius: 8, padding: '3px 8px', cursor: 'pointer', fontFamily: SANS }}>
                    Refresh
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <canvas ref={canvasRef} width={124} height={42} style={{ borderRadius: 8, border: '1px solid #dde1e8', flexShrink: 0, background: '#fff' }} />
                  <input
                    className="auth-input"
                    type="text"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    placeholder="Type here"
                    style={{ ...inputStyle('captcha'), flex: 1 }}
                    onFocus={() => setFocused('captcha')}
                    onBlur={() => setFocused('')}
                  />
                </div>
                {errors.captcha && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: 4 }}>{errors.captcha}</p>}
              </div>

              <div style={{ textAlign: 'right', marginTop: 2 }}>
                <a href="/forgot-password" style={{ fontSize: '0.79rem', color: '#b57a00', fontWeight: 700, textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: 4,
                  border: 'none',
                  borderRadius: 999,
                  background: isLoading ? '#e4e7ee' : '#efb400',
                  color: isLoading ? '#8a909c' : '#2b2110',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  padding: '10px 18px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Signing in...' : 'Continue'}
              </button>

              <div style={{ display: 'flex', gap: 9 }}>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/dashboard/admin';
                  }}
                  style={{ flex: 1, padding: '9px 10px', borderRadius: 8, border: '1px solid #d8dde6', background: '#fff', color: '#48505f', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/dashboard/home';
                  }}
                  style={{ flex: 1, padding: '9px 10px', borderRadius: 8, border: '1px solid #d8dde6', background: '#fff', color: '#48505f', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Demo User
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0.6rem 0 0.6rem' }}>
              <div style={{ flex: 1, height: 1, background: '#d7dce4' }} />
              <span style={{ color: '#9aa1ad', fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#d7dce4' }} />
            </div>

            <button
              onClick={handleGoogle}
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: '#fff',
                border: '1px solid #d8dde6',
                borderRadius: 10,
                padding: '10px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#2f3643',
                fontFamily: SANS,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ marginTop: '0.7rem', color: '#6c7280', fontSize: '0.84rem' }}>
              Do not have an account?{' '}
              <Link to="/register" style={{ color: '#b57a00', fontWeight: 700, textDecoration: 'none' }}>
                Create account
              </Link>
            </p>
          </div>

          <div className="auth-right">
            <img src="/indianinstruements.png" alt="Indian instruments" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
