import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      if (res.data?.success) {
        setSuccess(res.data?.message || 'If that email exists, a reset link has been sent.');
      } else {
        setError('Unable to process your request right now.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Try again.');
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
          width: 'min(460px, 100%)',
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
          Forgot Password
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 18 }}>
          Enter your account email and we will send a password reset link.
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
          <label
            style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#8A8F99',
              marginBottom: 6,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '12px 13px',
              border: '1.5px solid #E2E8F0',
              borderRadius: 10,
              outline: 'none',
              fontSize: '0.92rem',
              color: '#1E293B',
              marginBottom: 14,
            }}
          />

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
            {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              color: '#b57a00',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
