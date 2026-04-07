import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

    // Generate JWT token with role and user info
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store current token for session invalidation
    user.currentToken = token;
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
    // In production, this would send an email
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent"
      });
    }

    // Generate reset token (24-hour expiry)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Hash token before storing (never store plain token)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(resetPasswordExpires);
    await user.save();

    // In production, send email with reset link
    // For now, return the plain token (development only)
    // Example reset URL: /reset-password?token=<token>&email=<email>
    
    res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent",
      // Development-only: include token for testing
      // Remove this in production
      ...(process.env.NODE_ENV !== "production" && { 
        resetToken: resetToken,
        resetUrl: `/reset-password?token=${resetToken}&email=${user.email}`
      })
    });

  } catch (err) {
    console.error("Forgot password error:", err.message);
    
    // Always return success to prevent enumeration
    res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent"
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

export const checkAuth = (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: req.user
  });
};