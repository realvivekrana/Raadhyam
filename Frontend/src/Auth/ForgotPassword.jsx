import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep]             = useState(1); // 1=email 2=otp 3=newpass
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState(['','','','','','']);
  const [resetToken, setResetToken] = useState('');
  const [newPass, setNewPass]       = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [countdown, setCountdown]   = useState(0);
  const [focused, setFocused]       = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 0', border: 'none',
    borderBottom: `2px solid ${focused === field ? '#d08c00' : '#c7ccd4'}`,
    borderRadius: 0, fontSize: '0.9rem', fontFamily: SANS,
    color: '#1E293B', background: 'transparent', outline: 'none',
    transition: 'border-color 0.25s',
  });

  const labelStyle = {
    display: 'block', fontSize: '0.68rem', fontWeight: 700,
    color: '#8A8F99', marginBottom: 2, letterSpacing: '0.12em',
    textTransform: 'uppercase', fontFamily: SANS,
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/auth/send-otp', { email });
      if (res.data.success) {
        setSuccess('OTP sent! Check your inbox.');
        setStep(2); setCountdown(60);
        if (res.data.devOtp) {
          setOtp(res.data.devOtp.split(''));
          setSuccess(`Dev mode OTP: ${res.data.devOtp}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp: code });
      if (res.data.success) {
        setResetToken(res.data.resetToken);
        setSuccess('OTP verified! Set your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) { setError('Passwords do not match'); return; }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(newPass)) {
      setError('Password must be 8+ characters with a letter and number'); return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post('/api/auth/reset-password-otp', { resetToken, newPassword: newPass });
      if (res.data.success) {
        setSuccess('Password reset! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  const stepTitles    = ['Forgot Password?', 'Verify OTP', 'New Password'];
  const stepSubtitles = [
    "Enter your email and we'll send a 6-digit OTP.",
    `OTP sent to ${email} — check your inbox.`,
    'Choose a strong new password.',
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%)', fontFamily: SANS, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes floatNote { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-22px) rotate(9deg)} 66%{transform:translateY(10px) rotate(-6deg)} }
        @keyframes orbPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes drawLine  { from{width:0} to{width:48px} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes imgReveal { from{opacity:0;transform:scale(1.08)} to{opacity:1;transform:scale(1)} }
        @keyframes pulseBtn  { 0%,100%{box-shadow:0 4px 18px rgba(239,180,0,0.4)} 50%{box-shadow:0 4px 32px rgba(239,180,0,0.75)} }

        .auth-wrap { min-height:100vh; padding:70px 18px 22px; display:flex; align-items:center; justify-content:center; }
        .auth-card {
          width: min(1060px, 100%);
          height: min(92vh, 620px);
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
        .auth-heading { animation: fadeLeft 0.6s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .auth-field { animation: fadeUp 0.5s ease both; }
        .auth-field:nth-child(1){ animation-delay:.2s }
        .auth-field:nth-child(2){ animation-delay:.3s }
        .auth-field:nth-child(3){ animation-delay:.4s }
        .auth-submit { animation: pulseBtn 2.5s ease-in-out 1.2s infinite; }
        .auth-submit:hover { transform:translateY(-2px) !important; animation:none !important; box-shadow:0 8px 28px rgba(239,180,0,0.65) !important; }
        .note-float { position:absolute; pointer-events:none; user-select:none; color:rgba(255,255,255,0.22); font-size:1.8rem; animation:floatNote 7s ease-in-out infinite; }
        .otp-box:focus { border-color:#d08c00 !important; }
        @media(max-width:768px){
          .auth-wrap{ padding:80px 16px 22px; align-items:flex-start; }
          .auth-card{ grid-template-columns:1fr; height:auto; min-height:unset; max-width:440px; border-radius:16px; }
          .auth-right{ display:none !important; }
          .auth-left-inner{ padding:28px 22px 24px !important; }
        }
      `}</style>

      {/* Orbs */}
      <div style={{ position:'absolute', top:'-10%', left:'-8%', width:380, height:380, borderRadius:'50%', background:'rgba(255,255,255,0.08)', animation:'orbPulse 8s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-12%', right:'-6%', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', animation:'orbPulse 10s ease-in-out 2s infinite', pointerEvents:'none' }} />
      {/* Floating notes */}
      {[{n:'♩',t:'10%',l:'6%',d:'0s'},{n:'♫',t:'18%',r:'8%',d:'1.5s'},{n:'♬',b:'18%',l:'10%',d:'2.8s'},{n:'𝄞',t:'50%',r:'5%',d:'0.9s'},{n:'♪',b:'30%',r:'14%',d:'3.5s'}].map((x,i)=>(
        <span key={i} className="note-float" style={{ top:x.t, bottom:x.b, left:x.l, right:x.r, animationDelay:x.d }}>{x.n}</span>
      ))}

      {/* Back to Home */}
      <Link to="/" style={{ position:'absolute', top:16, left:16, zIndex:20, textDecoration:'none', padding:'8px 14px', borderRadius:999, border:'1px solid rgba(0,0,0,0.18)', color:'#2f3643', background:'rgba(255,255,255,0.8)', backdropFilter:'blur(4px)', fontSize:'0.82rem', fontWeight:700 }}>
        Back to Home
      </Link>

      <div className="auth-wrap">
        <div className="auth-card">
          <span className="auth-dot top" />
          <span className="auth-dot bottom" />

          {/* Left — form */}
          <div className="auth-left-inner" style={{ padding:'28px 34px 22px', overflowY:'auto', overflowX:'hidden' }}>

            {/* Step dots */}
            <div style={{ display:'flex', gap:6, marginBottom:'1.2rem' }}>
              {[1,2,3].map(s => (
                <div key={s} style={{ flex:1, height:3, borderRadius:2, background: step >= s ? '#efb400' : '#dde1e8', transition:'background 0.3s' }} />
              ))}
            </div>

            <div className="auth-heading" style={{ marginBottom:'0.8rem' }}>
              <h1 style={{ fontFamily:SERIF, fontSize:'2rem', color:'#151821', marginBottom:4, lineHeight:1.1 }}>{stepTitles[step-1]}</h1>
              <p style={{ color:'#7f858f', fontSize:'0.85rem' }}>{stepSubtitles[step-1]}</p>
              <div style={{ height:3, width:0, background:'linear-gradient(90deg,#D97706,#ef7e1a)', borderRadius:2, marginTop:10, animation:'drawLine 0.8s ease 0.5s forwards' }} />
            </div>

            <div style={{ marginBottom:'0.6rem' }}>
              {error   && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'9px 12px', color:'#991B1B', fontSize:'0.84rem', marginBottom:8 }}>{error}</div>}
              {success && <div style={{ background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.2)', borderRadius:10, padding:'9px 12px', color:'#065F46', fontSize:'0.84rem' }}>{success}</div>}
            </div>

            {/* ── Step 1: Email ── */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div className="auth-field">
                  <label style={labelStyle}>Email Address</label>
                  <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    style={inputStyle('email')} onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} />
                </div>
                <button type="submit" disabled={loading} className={loading ? '' : 'auth-submit'}
                  style={{ marginTop:8, border:'none', borderRadius:999, background: loading ? '#e4e7ee' : '#efb400', color: loading ? '#8a909c' : '#2b2110', fontWeight:800, fontSize:'0.86rem', padding:'10px 18px', cursor: loading ? 'not-allowed' : 'pointer', transition:'transform 0.2s, box-shadow 0.2s' }}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <p style={{ marginTop:'0.5rem', color:'#6c7280', fontSize:'0.84rem' }}>
                  Remember it? <Link to="/login" style={{ color:'#b57a00', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
                </p>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                <div className="auth-field" style={{ display:'flex', gap:8, justifyContent:'center', marginTop:4 }}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => otpRefs.current[i] = el}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      className="otp-box"
                      style={{ width:44, height:50, textAlign:'center', fontSize:'1.4rem', fontWeight:700, border:'2px solid #dde1e8', borderRadius:10, outline:'none', background:'#fff', color:'#1E293B', transition:'border-color 0.2s', fontFamily:SANS }} />
                  ))}
                </div>
                <button type="submit" disabled={loading} className={loading ? '' : 'auth-submit'}
                  style={{ border:'none', borderRadius:999, background: loading ? '#e4e7ee' : '#efb400', color: loading ? '#8a909c' : '#2b2110', fontWeight:800, fontSize:'0.86rem', padding:'10px 18px', cursor: loading ? 'not-allowed' : 'pointer', transition:'transform 0.2s, box-shadow 0.2s' }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <p style={{ textAlign:'center', color:'#6c7280', fontSize:'0.82rem' }}>
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : <button type="button" onClick={handleSendOtp} style={{ background:'none', border:'none', color:'#b57a00', fontWeight:700, cursor:'pointer', fontFamily:SANS, fontSize:'0.82rem' }}>Resend OTP</button>
                  }
                </p>
              </form>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div className="auth-field">
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position:'relative' }}>
                    <input className="auth-input" type={showPass ? 'text' : 'password'} value={newPass}
                      onChange={e=>setNewPass(e.target.value)} placeholder="Min 8 chars + number" required
                      style={{ ...inputStyle('newPass'), paddingRight:36 }}
                      onFocus={()=>setFocused('newPass')} onBlur={()=>setFocused('')} />
                    <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:2, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', color:'#a1a7b2' }}>
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label style={labelStyle}>Confirm Password</label>
                  <input className="auth-input" type="password" value={confirmPass}
                    onChange={e=>setConfirmPass(e.target.value)} placeholder="Repeat password" required
                    style={inputStyle('confirmPass')}
                    onFocus={()=>setFocused('confirmPass')} onBlur={()=>setFocused('')} />
                </div>
                <button type="submit" disabled={loading} className={loading ? '' : 'auth-submit'}
                  style={{ marginTop:6, border:'none', borderRadius:999, background: loading ? '#e4e7ee' : '#efb400', color: loading ? '#8a909c' : '#2b2110', fontWeight:800, fontSize:'0.86rem', padding:'10px 18px', cursor: loading ? 'not-allowed' : 'pointer', transition:'transform 0.2s, box-shadow 0.2s' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>

          {/* Right — image (same as login/register) */}
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

export default ForgotPassword;
