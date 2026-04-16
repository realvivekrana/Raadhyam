import React from 'react';
import { Link } from 'react-router-dom';

// This route is kept for backward compatibility.
// The OTP-based flow is handled in ForgotPassword.jsx
const ResetPassword = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(130deg,#ef7e1a,#f4a14f)', fontFamily:"'Lato',sans-serif" }}>
    <div style={{ background:'#f6f7fb', borderRadius:20, padding:'2.5rem', maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔐</div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.8rem', color:'#151821', marginBottom:8 }}>Reset Password</h2>
      <p style={{ color:'#7f858f', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
        Please use the Forgot Password flow to reset your password via OTP.
      </p>
      <Link to="/forgot-password" style={{ display:'block', background:'#efb400', color:'#2b2110', borderRadius:999, padding:'11px', fontWeight:800, textDecoration:'none', fontSize:'0.9rem' }}>
        Go to Forgot Password
      </Link>
    </div>
  </div>
);

export default ResetPassword;
