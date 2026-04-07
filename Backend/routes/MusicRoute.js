import express from "express";
import {
  getAllMusic,
  getMusicById,
  createMusic,
  deleteMusic
} from "../controllers/MusicController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";
import isAdmin from "../middlewares/isAdmin.js";
import { validateMusic, validateMusicById } from "../middlewares/validationMiddleware.js";

const router = express.Router();

/**
 * Music Endpoints
 * 
 * Public routes:
 * GET /api/music         - List all public music (paginated)
 * GET /api/music/:id     - Get single music entry by ID
 * 
 * Admin protected routes:
 * POST /api/music        - Create new music entry
 * DELETE /api/music/:id  - Delete music entry
 */

// Public routes - no authentication required
router.get('/', getAllMusic);
router.get('/:id', validateMusicById, getMusicById);

// Admin protected routes
router.post('/', verifyToken, isAdmin, validateMusic, createMusic);
router.delete('/:id', verifyToken, isAdmin, validateMusicById, deleteMusic);

export default router;
