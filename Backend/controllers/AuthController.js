import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetOTP } from "../config/emailService.js";

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}

// Trusted redirect URLs whitelist
const TRUSTED_REDIRECT_URLS = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

// In-memory store for OAuth nonces
const oauthStateStore = new Map();
const STATE_TTL = 10 * 60 * 1000; // 10 minutes

// Clean up expired states periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of oauthStateStore.entries()) {
    if (now - value.timestamp > STATE_TTL) {
      oauthStateStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate redirect URL against whitelist
const isValidRedirectUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return TRUSTED_REDIRECT_URLS.some(trusted => {
      const trustedUrl = new URL(trusted);
      return parsedUrl.origin === trustedUrl.origin;
    });
  } catch {
    return false;
  }
};

// Safe decodeURIComponent wrapper
const safeDecodeURIComponent = (str) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return null;
  }
};

const isStrongPassword = (password) => {
  // At least 8 characters, one letter, one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidUsername = (username) => {
  // Alphanumeric and underscore, 3-30 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Input validation with detailed messages for development
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, name, and password are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters"
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with one letter and one number"
      });
    }

    // Generate a unique username from the name
    const baseUsername = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    let username = baseUsername;
    let counter = 1;
    
    // Ensure username is unique
    while (await User.findOne({ username })) {
      username = `${baseUsername}_${counter}`;
      counter++;
    }

    // Check for existing user by email
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      name: name.trim()
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    
    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Email or username already exists" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Same error message regardless of whether user exists or password is wrong
    // This prevents user enumeration
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      return res.status(400).json({ 
        success: false, 
        message: "Use Google Sign-In for this account" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check user status
    if (user.status !== "Active") {
      return res.status(403).json({ 
        success: false, 
        message: "Account is not active" 
      });
    }

    // Generate session ID for token invalidation
    const sessionId = crypto.randomBytes(32).toString('hex');

    // Generate JWT token with role and user info
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name,
        sessionId
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store session ID for invalidation (instead of whole token)
    user.sessionId = sessionId;
    await user.save();

    // Set HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Find user - do NOT reveal whether email exists
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, an OTP has been sent to your email"
      });
    }

    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, an OTP has been sent to your email"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP and expiry
    user.otp = otp;
    user.otpExpires = new Date(otpExpires);
    await user.save();

    // Send OTP email via Brevo
    try {
      await sendPasswordResetOTP(user.email, otp, user.name);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
      // In development, return OTP in response for testing
      if (process.env.NODE_ENV !== "production") {
        return res.status(200).json({
          success: true,
          message: "If that email exists, an OTP has been sent to your email",
          // Development-only: include OTP for testing
          ...(process.env.NODE_ENV !== "production" && { 
            otp: otp,
            note: "OTP included for development testing only"
          })
        });
      }
      // In production, still return success to prevent enumeration
      return res.status(200).json({
        success: true,
        message: "If that email exists, an OTP has been sent to your email"
      });
    }

    res.status(200).json({
      success: true,
      message: "If that email exists, an OTP has been sent to your email"
    });

  } catch (err) {
    console.error("Forgot password error:", err.message);
    
    // Always return success to prevent enumeration
    res.status(200).json({
      success: true,
      message: "If that email exists, an OTP has been sent to your email"
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Find user with valid OTP
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      otp: otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // OTP is valid, generate a temporary reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Hash token before storing
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save reset token and clear OTP
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(resetPasswordExpires);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken: resetToken,
      email: user.email
    });

  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // Input validation
    if (!token || !email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Token, email, and new password are required" 
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters with one letter and one number" 
      });
    }

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters with one letter and one number" 
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      return res.status(400).json({ 
        success: false, 
        message: "Use Google Sign-In for this account" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be different from current password" 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const checkAuth = (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: req.user
  });
};

// Google OAuth - Initiate
export const googleAuth = async (req, res, next) => {
  console.log('[Google OAuth] Initiating Google login...');
  const passport = (await import('passport')).default;
  
  // Validate and get redirect URL
  const redirect = req.query.redirect || process.env.CLIENT_URL + '/login';
  console.log('[Google OAuth] Redirect URL:', redirect);
  
  if (!isValidRedirectUrl(redirect)) {
    console.log('[Google OAuth] Invalid redirect URL:', redirect);
    return res.status(400).json({
      success: false,
      message: 'Invalid redirect URL'
    });
  }

  // Generate nonce for CSRF protection
  const nonce = crypto.randomBytes(32).toString('hex');
  const stateId = crypto.randomBytes(16).toString('hex');
  
  // Store nonce with redirect URL and timestamp
  oauthStateStore.set(stateId, {
    nonce,
    redirect,
    timestamp: Date.now()
  });
  console.log('[Google OAuth] State stored, stateId:', stateId);

  // Encode state with nonce and stateId
  const state = encodeURIComponent(JSON.stringify({ nonce, stateId }));
  console.log('[Google OAuth] Authenticating with Google...');
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state
  })(req, res, next);
};

// Google OAuth - Callback
export const googleAuthCallback = async (req, res, next) => {
  console.log('[Google OAuth Callback] Received callback from Google');
  const passport = (await import('passport')).default;
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    try {
      console.log('[Google OAuth Callback] Authentication result:', { err: err?.message, user: user ? user.email : null, info });
      
      // Parse and validate state
      let redirect = process.env.CLIENT_URL + '/login';
      let stateData = null;
      
      if (req.query.state) {
        console.log('[Google OAuth Callback] State parameter received');
        const decodedState = safeDecodeURIComponent(req.query.state);
        if (decodedState) {
          try {
            stateData = JSON.parse(decodedState);
            console.log('[Google OAuth Callback] Parsed state data:', stateData);
          } catch {
            // Invalid JSON, use default redirect
            console.log('[Google OAuth Callback] Failed to parse state JSON');
          }
        }
      }

      // Validate nonce and get redirect URL from state store
      if (stateData && stateData.nonce && stateData.stateId) {
        const storedState = oauthStateStore.get(stateData.stateId);
        console.log('[Google OAuth Callback] Validating state, storedState exists:', !!storedState);
        
        if (storedState && storedState.nonce === stateData.nonce && Date.now() - storedState.timestamp < STATE_TTL) {
          // Valid nonce, use stored redirect URL
          redirect = storedState.redirect;
          // Delete used state to prevent replay
          oauthStateStore.delete(stateData.stateId);
          console.log('[Google OAuth Callback] State validated successfully, redirecting to:', redirect);
        } else {
          // Invalid or expired nonce
          console.log('[Google OAuth Callback] Invalid or expired nonce');
          return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent('Invalid or expired authentication state')}`);
        }
      }

      // Ensure redirect URL is trusted
      if (!isValidRedirectUrl(redirect)) {
        redirect = process.env.CLIENT_URL + '/login';
      }

      if (err || !user) {
        console.log('[Google OAuth Callback] Authentication failed, err:', err?.message, 'user:', user);
        return res.redirect(`${redirect}?error=${encodeURIComponent('Google authentication failed')}`);
      }

      // Check user status
      if (user.status !== "Active") {
        console.log('[Google OAuth Callback] User account not active, status:', user.status);
        return res.redirect(`${redirect}?error=${encodeURIComponent('Account is not active')}`);
      }

      // Generate session ID for token invalidation
      const sessionId = crypto.randomBytes(32).toString('hex');
      console.log('[Google OAuth Callback] Generating JWT token for user:', user.email);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          name: user.name,
          sessionId
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Store session ID for invalidation (instead of whole token)
      user.sessionId = sessionId;
      await user.save();

      // Set HTTP-only secure cookie with token
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect through login page so frontend stores token/user in localStorage.
      // Dashboard data requests depend on Bearer token from localStorage.
      const userPayload = {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      };

      const loginRedirectUrl = `${process.env.CLIENT_URL}/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userPayload))}`;

      console.log('[Google OAuth Callback] Redirecting to login with auth payload for client session hydration');
      res.redirect(loginRedirectUrl);

    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const redirect = process.env.CLIENT_URL + '/login';
      res.redirect(`${redirect}?error=${encodeURIComponent('Authentication failed')}`);
    }
  })(req, res, next);
};

/* ── OTP-based password reset ─────────────────────────────────────── */

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'No account found with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode    = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    try {
      await sendPasswordResetOTP(user.email, otp, user.name || "User");
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
      // Dev fallback — return OTP in response
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({ success: true, message: 'OTP sent (dev mode)', devOtp: otp });
      }
    }

    res.status(200).json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('sendOtp error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (user.otpCode !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    // OTP valid — issue a short-lived reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken   = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    user.otpCode    = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP verified', resetToken });
  } catch (err) {
    console.error('verifyOtp error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters with a letter and number' });
    }

    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken:   hashed,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password             = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    user.currentToken         = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('resetPasswordWithToken error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
