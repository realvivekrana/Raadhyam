import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const userData = (() => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } })();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handlePasswordInput = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordMessage.text) {
      setPasswordMessage({ type: '', text: '' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill all password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password must match.' });
      return;
    }

    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(newPassword)) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters with one letter and one number.' });
      return;
    }

    try {
      setSavingPassword(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/user/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update password.'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>My Profile</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Your account information</p>
      </div>

      {/* Avatar card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'2rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'2rem', fontFamily:SERIF, flexShrink:0 }}>
          {(userData.name || userData.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:4 }}>{userData.name || 'Student'}</h2>
          <p style={{ color:MUTED, fontSize:'0.88rem', fontFamily:SANS }}>{userData.email || 'No email'}</p>
          <span style={{ display:'inline-block', marginTop:8, fontSize:'0.72rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'3px 12px', fontFamily:SANS, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            {userData.role || 'Student'}
          </span>
        </div>
      </div>

      {/* Info card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:SERIF, fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:'1.25rem' }}>Account Details</h3>
        {[
          { label:'Full Name',  value: userData.name  || '—' },
          { label:'Email',      value: userData.email || '—' },
          { label:'Role',       value: userData.role  || 'Student' },
          { label:'Member Since', value: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long' }) : '—' },
        ].map((row,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
            <span style={{ fontSize:'0.82rem', fontWeight:700, color:MUTED, fontFamily:SANS, textTransform:'uppercase', letterSpacing:'0.06em' }}>{row.label}</span>
            <span style={{ fontSize:'0.9rem', fontWeight:600, color:SLATE, fontFamily:SANS }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:SERIF, fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:'1.25rem' }}>Change Password</h3>

        <form onSubmit={handleChangePassword}>
          <div style={{ display:'grid', gap:'0.85rem' }}>
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordInput('currentPassword', e.target.value)}
              style={{ width:'100%', padding:'11px 12px', border:'1.5px solid #E2E8F0', borderRadius:10, fontFamily:SANS, fontSize:'0.86rem', outline:'none' }}
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordInput('newPassword', e.target.value)}
              style={{ width:'100%', padding:'11px 12px', border:'1.5px solid #E2E8F0', borderRadius:10, fontFamily:SANS, fontSize:'0.86rem', outline:'none' }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordInput('confirmPassword', e.target.value)}
              style={{ width:'100%', padding:'11px 12px', border:'1.5px solid #E2E8F0', borderRadius:10, fontFamily:SANS, fontSize:'0.86rem', outline:'none' }}
            />
          </div>

          {passwordMessage.text && (
            <p style={{ marginTop:'0.85rem', fontSize:'0.8rem', fontWeight:600, color: passwordMessage.type === 'success' ? '#059669' : '#DC2626', fontFamily:SANS }}>
              {passwordMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            style={{ marginTop:'1rem', width:'100%', padding:'12px', border:'none', borderRadius:10, cursor: savingPassword ? 'not-allowed' : 'pointer', background: savingPassword ? '#94A3B8' : `linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', fontWeight:700, fontSize:'0.85rem', fontFamily:SANS }}
          >
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width:'100%', padding:'13px', borderRadius:12, border:'1.5px solid #FCA5A5', background:'rgba(239,68,68,0.05)', color:'#DC2626', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:SANS, transition:'background 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.05)'}>
        🚪 Sign Out
      </button>
    </div>
  );
};

export default UserProfilePage;
