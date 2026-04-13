import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha]  = useState('');
  const [showPass, setShowPass]        = useState(false);
  const [showConfirm, setShowConfirm]  = useState(false);
  const [isLoading, setIsLoading]      = useState(false);
  const [errors, setErrors]            = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [focused, setFocused]          = useState('');
  const canvasRef = useRef(null);

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { setErrors({}); setSuccessMessage(''); }, [formData, userCaptcha]);

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
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, '#FEF3C7'); g.addColorStop(1, '#FFF8EE');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = 'rgba(217,119,6,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height); ctx.stroke();
    }
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

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters with a letter and number';
    else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) e.password = 'Must contain at least one letter and one number';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      const res = await axios.post('/api/auth/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });
      if (res.data.success) {
        setSuccessMessage('Account created! Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 1800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      if (err.response?.status === 409) setErrors({ email: 'This email is already registered.' });
      else if (err.response?.data?.field) setErrors({ [err.response.data.field]: msg });
      else setErrors({ general: msg });
      generateCaptcha(); setUserCaptcha('');
    } finally { setIsLoading(false); }
  };

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
    display: 'block', fontSize: '0.68rem', fontWeight: 700,
    color: '#8A8F99', marginBottom: 2, letterSpacing: '0.12em',
    textTransform: 'uppercase', fontFamily: SANS,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%)', fontFamily: SANS, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes floatNote { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-22px) rotate(9deg)} 66%{transform:translateY(10px) rotate(-6deg)} }
        @keyframes orbPulse  { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.08) translateY(-18px)} }
        @keyframes drawLine  { from{width:0} to{width:48px} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes imgReveal { from{opacity:0;transform:scale(1.08)} to{opacity:1;transform:scale(1)} }
        @keyframes pulseBtn  { 0%,100%{box-shadow:0 4px 18px rgba(239,180,0,0.4)} 50%{box-shadow:0 4px 32px rgba(239,180,0,0.75)} }

        .auth-wrap { min-height:100vh; padding:70px 18px 22px; display:flex; align-items:center; justify-content:center; }

        .auth-card {
          width: min(1060px, 100%);
          height: min(92vh, 680px);
          border-radius: 20px;
          background: #f6f7fb;
          box-shadow: 0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.15);
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          overflow: hidden;
          position: relative;
          animation: cardIn 0.6s cubic-bezier(.22,1,.36,1) both;
        }

        .auth-dot { position:absolute; width:36px; height:36px; border-radius:999px; background:rgba(241,244,252,0.95); box-shadow:0 8px 14px rgba(0,0,0,0.08); }
        .auth-dot.top { top:-14px; left:-14px; }
        .auth-dot.bottom { right:-14px; bottom:-14px; }

        .auth-right { position:relative; background:#f2f4f8; overflow:hidden; }
        .auth-right img { width:100%; height:100%; object-fit:cover; object-position:65% center; animation:imgReveal 0.9s ease 0.3s both; }
        .auth-right-overlay { position:absolute; inset:0; background:linear-gradient(135deg,rgba(239,126,26,0.18) 0%,transparent 60%); pointer-events:none; }

        .auth-input::placeholder { color:#b2b8c2; }
        .auth-left-inner::-webkit-scrollbar { width:3px; }
        .auth-left-inner::-webkit-scrollbar-thumb { background:rgba(217,119,6,0.3); border-radius:3px; }

        .auth-field { animation: fadeUp 0.5s ease both; }
        .auth-field:nth-child(1){ animation-delay:.2s }
        .auth-field:nth-child(2){ animation-delay:.28s }
        .auth-field:nth-child(3){ animation-delay:.36s }
        .auth-field:nth-child(4){ animation-delay:.44s }
        .auth-field:nth-child(5){ animation-delay:.52s }

        .auth-heading { animation: fadeLeft 0.6s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .auth-submit { animation: pulseBtn 2.5s ease-in-out 1.2s infinite; }
        .auth-submit:hover { transform:translateY(-2px) !important; animation:none !important; box-shadow:0 8px 28px rgba(239,180,0,0.65) !important; }

        .note-float { position:absolute; pointer-events:none; user-select:none; color:rgba(255,255,255,0.22); font-size:1.8rem; animation:floatNote 7s ease-in-out infinite; }

        @media(max-width:768px){
          .auth-wrap{ padding:80px 16px 22px; align-items:flex-start; }
          .auth-card{ grid-template-columns:1fr; height:auto; min-height:unset; max-width:440px; border-radius:16px; }
          .auth-right{ display:none !important; }
          .auth-left-inner{ padding:28px 22px 24px !important; }
          .register-password-grid{ grid-template-columns:1fr !important; }
        }
        @media(max-width:420px){
          .auth-wrap{ padding:72px 12px 16px; }
          .auth-left-inner{ padding:22px 16px 20px !important; }
          .auth-card{ border-radius:14px; }
        }
      `}</style>

      {/* Animated background orbs */}
      <div style={{ position:'absolute', top:'-10%', left:'-8%', width:380, height:380, borderRadius:'50%', background:'rgba(255,255,255,0.08)', animation:'orbPulse 8s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-12%', right:'-6%', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', animation:'orbPulse 10s ease-in-out 2s infinite', pointerEvents:'none' }} />
      {/* Floating music notes */}
      {[{n:'♩',t:'10%',l:'6%',d:'0s'},{n:'♫',t:'18%',r:'8%',d:'1.5s'},{n:'♬',b:'18%',l:'10%',d:'2.8s'},{n:'𝄞',t:'50%',r:'5%',d:'0.9s'},{n:'♪',b:'30%',r:'14%',d:'3.5s'}].map((x,i)=>(
        <span key={i} className="note-float" style={{ top:x.t, bottom:x.b, left:x.l, right:x.r, animationDelay:x.d }}>{x.n}</span>
      ))}

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

          <div className="auth-left-inner" style={{ padding: '24px 34px 18px', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="auth-heading" style={{ marginBottom: '0.7rem' }}>
              <h1 style={{ fontFamily: SERIF, fontSize: '2.05rem', color: '#151821', marginBottom: 6, lineHeight: 1.1 }}>
                Welcome to the world
              </h1>
              <p style={{ color: '#7f858f', fontSize: '0.86rem' }}>
                of your raadhyam music
              </p>
              <div style={{ height:3, width:0, background:'linear-gradient(90deg,#D97706,#ef7e1a)', borderRadius:2, marginTop:10, animation:'drawLine 0.8s ease 0.5s forwards' }} />
            </div>

            <div style={{ marginBottom: 8, color: '#5c616c', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase' }}>
              Register
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
              <div className="auth-field">
                <label style={labelStyle}>Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  style={inputStyle('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                />
                {errors.name && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div className="auth-field">
                <label style={labelStyle}>Email Address</label>
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

              <div className="auth-field register-password-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="auth-input"
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 chars + number"
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
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="auth-input"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      style={{ ...inputStyle('confirmPassword'), paddingRight: 32 }}
                      onFocus={() => setFocused('confirmPassword')}
                      onBlur={() => setFocused('')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a1a7b2' }}
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: 4 }}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="auth-field">
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

              <button
                type="submit"
                disabled={isLoading}
                className={isLoading ? '' : 'auth-submit'}
                style={{
                  marginTop: 4, border: 'none', borderRadius: 999,
                  background: isLoading ? '#e4e7ee' : '#efb400',
                  color: isLoading ? '#8a909c' : '#2b2110',
                  fontWeight: 800, fontSize: '0.86rem', padding: '10px 18px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {isLoading ? 'Creating account...' : 'Continue'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0.6rem 0 0.6rem' }}>
              <div style={{ flex: 1, height: 1, background: '#d7dce4' }} />
              <span style={{ color: '#9aa1ad', fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#d7dce4' }} />
            </div>

            <button
              onClick={() => {
                window.location.href = '/api/auth/google';
              }}
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
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#b57a00', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          <div className="auth-right">
            <img src="/indianinstruements.png" alt="Indian instruments" />
            <div className="auth-right-overlay" />
            {[{n:'🎵',t:'15%',l:'12%',d:'0.4s'},{n:'🎶',b:'20%',r:'10%',d:'1.8s'},{n:'🎸',t:'55%',l:'8%',d:'3s'}].map((x,i)=>(
              <span key={i} style={{ position:'absolute', top:x.t, bottom:x.b, left:x.l, right:x.r, fontSize:'1.6rem', opacity:0.35, animation:`floatNote 6s ease-in-out ${x.d} infinite`, pointerEvents:'none' }}>{x.n}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
