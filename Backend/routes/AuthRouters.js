/**
 * Auth Routes
 * 
 * Provides authentication endpoints:
 * - POST /api/auth/register - Register a new user
 * - POST /api/auth/login - Login user
 * - POST /api/auth/forgot-password - Request password reset
 * - POST /api/auth/reset-password - Reset password with token
 * - GET /api/auth/check-auth - Check authentication status (protected)
 * 
 * Routes follow RESTful conventions with proper status codes
 */

import express from "express";
import { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  checkAuth 
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";

const router = express.Router();

// POST /api/auth/register - Register a new user
// Request: { email, username, password }
// Response: 201 Created or 400 Bad Request
router.post("/register", registerUser);

// POST /api/auth/login - Login user
// Request: { email, password }
// Response: 200 OK with token or 400 Bad Request
router.post("/login", loginUser);

// POST /api/auth/forgot-password - Request password reset
// Request: { email }
// Response: 200 OK (always, to prevent enumeration)
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password - Reset password with token
// Request: { token, email, newPassword }
// Response: 200 OK or 400 Bad Request
router.post("/reset-password", resetPassword);

// GET /api/auth/check-auth - Check authentication status (protected)
// Requires valid JWT token
// Response: 200 OK or 401 Unauthorized
router.get("/check-auth", verifyToken, checkAuth);

export default router;