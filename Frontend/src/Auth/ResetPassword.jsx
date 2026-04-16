import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";

const isStrongPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const ResetPasswordPage = () => {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const tokenFromUrl = params.get('token') || '';
  const emailFromUrl = params.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!tokenFromUrl) return 'Invalid reset link. Missing token.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (!newPassword) return 'New password is required.';
    if (!isStrongPassword(newPassword)) return 'Password must be at least 8 characters with one letter and one number.';
    if (!confirmPassword) return 'Please confirm your new password.';
    if (newPassword !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('/api/auth/reset-password', {
        token: tokenFromUrl,
        email: email.trim().toLowerCase(),
        newPassword,
      });

      if (res.data?.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        setError(res.data?.message || 'Unable to reset password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%)',
        fontFamily: SANS,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
      `}</style>

      <div
        style={{
          width: 'min(500px, 100%)',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 24px 60px rgba(0,0,0,0.24)',
          padding: '28px 24px',
          border: '1px solid rgba(255,255,255,0.35)',
        }}
      >
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: '2rem',
            lineHeight: 1.15,
            color: '#151821',
            marginBottom: 8,
          }}
        >
          Create New Password
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 18 }}>
          Set your new password for your account.
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#991B1B',
              borderRadius: 10,
              padding: '9px 12px',
              fontSize: '0.84rem',
              marginBottom: 10,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'rgba(5,150,105,0.08)',
              border: '1px solid rgba(5,150,105,0.2)',
              color: '#065F46',
              borderRadius: 10,
              padding: '9px 12px',
              fontSize: '0.84rem',
              marginBottom: 10,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#8A8F99', marginBottom:6, letterSpacing:'0.1em', textTransform:'uppercase' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ width:'100%', padding:'12px 13px', border:'1.5px solid #E2E8F0', borderRadius:10, outline:'none', fontSize:'0.92rem', color:'#1E293B', marginBottom:12 }}
          />

          <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#8A8F99', marginBottom:6, letterSpacing:'0.1em', textTransform:'uppercase' }}>New Password</label>
          <div style={{ position:'relative', marginBottom:12 }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 chars, 1 letter, 1 number"
              style={{ width:'100%', padding:'12px 50px 12px 13px', border:'1.5px solid #E2E8F0', borderRadius:10, outline:'none', fontSize:'0.92rem', color:'#1E293B' }}
            />
            <button type="button" onClick={() => setShowPass((p) => !p)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', color:'#64748B', fontWeight:700, cursor:'pointer' }}>
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#8A8F99', marginBottom:6, letterSpacing:'0.1em', textTransform:'uppercase' }}>Confirm Password</label>
          <div style={{ position:'relative', marginBottom:14 }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              style={{ width:'100%', padding:'12px 50px 12px 13px', border:'1.5px solid #E2E8F0', borderRadius:10, outline:'none', fontSize:'0.92rem', color:'#1E293B' }}
            />
            <button type="button" onClick={() => setShowConfirm((p) => !p)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', color:'#64748B', fontWeight:700, cursor:'pointer' }}>
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 999,
              background: isLoading ? '#CBD5E1' : '#efb400',
              color: '#2b2110',
              fontWeight: 800,
              fontSize: '0.9rem',
              padding: '11px 16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <Link to="/login" style={{ color:'#b57a00', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
