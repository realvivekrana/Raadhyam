/**
 * User Routes - Admin-only user management
 * 
 * Endpoints:
 * - GET /api/users - Get all users (admin only)
 * - POST /api/users - Create user (admin only)
 * - DELETE /api/users/:id - Delete user (admin only)
 * 
 * Protection:
 * - All routes require both verifyToken and isAdmin middleware
 * - verifyToken: verifies user is authenticated
 * - isAdmin: verifies user has admin role
 */

import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import { 
  getAllUsers, 
  createNewUser, 
  deleteUserById 
} from '../controllers/UserManagementController.js';

const router = express.Router();

// GET /api/users - Get all users (admin only)
// Returns users without password hash
router.get('/', verifyToken, isAdmin, getAllUsers);

// POST /api/users - Create user (admin only)
// Validates input, checks duplicates, hashes password
router.post('/', verifyToken, isAdmin, createNewUser);

// DELETE /api/users/:id - Delete user (admin only)
// Soft delete by setting status to "Deleted"
router.delete('/:id', verifyToken, isAdmin, deleteUserById);

export default router;
