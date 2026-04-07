/**
 * User Management Controller - Admin-only user operations
 * 
 * Implements:
 * - GET /api/users: List all users (admin only)
 * - POST /api/users: Create new user (admin only)
 * - DELETE /api/users/:id: Delete user (admin only)
 * 
 * Security:
 * - All endpoints protected by verifyToken + isAdmin
 * - Passwords never returned in responses
 * - Input validation for all user creation fields
 * - Duplicate checks for email and username
 * - Role validation against allowed enum values
 */

import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import mongoose from 'mongoose';

// Reuse validation logic from AuthController
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

const ALLOWED_ROLES = ['user', 'admin'];
const ALLOWED_PLANS = ['Free', 'Monthly Premium', 'Annual Premium'];
const ALLOWED_STATUSES = ['Active', 'Inactive', 'Suspended'];

/**
 * GET /api/users - Get all users
 * Admin only
 * Returns: List of users without password hashes
 */
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, plan } = req.query;
    
    const query = { status: { $ne: 'Deleted' } };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && ALLOWED_ROLES.includes(role)) {
      query.role = role;
    }
    
    if (status && ALLOWED_STATUSES.includes(status)) {
      query.status = status;
    }
    
    if (plan && ALLOWED_PLANS.includes(plan)) {
      query.plan = plan;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password -currentToken -resetPasswordToken -resetPasswordExpires');

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * POST /api/users - Create new user
 * Admin only
 * Request body:
 * - username: required, unique, 3-30 alphanumeric
 * - email: required, unique, valid format
 * - password: required, min 8 chars with letter + number
 * - name: optional (defaults to username)
 * - role: optional, must be 'user' or 'admin' (default: 'user')
 * - plan: optional, plan type (default: 'Free')
 * - status: optional, user status (default: 'Active')
 * - phone: optional
 * - country: optional
 */
export const createNewUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      name, 
      role, 
      plan, 
      status, 
      phone, 
      country 
    } = req.body;

    // Required fields validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Format validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-30 alphanumeric characters'
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with one letter and one number'
      });
    }

    // Role validation
    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(', ')}`
      });
    }

    // Plan validation
    if (plan && !ALLOWED_PLANS.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: `Plan must be one of: ${ALLOWED_PLANS.join(', ')}`
      });
    }

    // Status validation
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    // Check for existing user (email or username)
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() }, 
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || username,
      role: role || 'user',
      plan: plan || 'Free',
      status: status || 'Active',
      phone,
      country
    });

    // Remove sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.currentToken;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Create User Error:', error);
    
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

/**
 * DELETE /api/users/:id - Delete user
 * Admin only
 * Soft delete: sets status to "Deleted" instead of removing from database
 */
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete - mark as deleted instead of removing
    await User.findByIdAndUpdate(id, { 
      status: 'Deleted',
      currentToken: null // Invalidate any active sessions
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};