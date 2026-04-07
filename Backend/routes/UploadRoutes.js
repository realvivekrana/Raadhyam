/**
 * Upload Routes
 * Handles file uploads to Cloudinary using formidable
 * 
 * Endpoints:
 * - POST /api/upload - Upload file (requires auth)
 * - POST /api/upload/validate - Validate file without uploading (requires auth)
 * 
 * Access Control:
 * - All endpoints require authentication
 * - Both authenticated users and admins can upload
 */

import express from 'express';
import { protect } from '../middlewares/AuthmiddleWare.js';
import { upload, ALLOWED_MIME_TYPES } from '../middlewares/Upload.js';
import { uploadFile, validateFile } from '../controllers/UploadController.js';

const router = express.Router();

// POST /api/upload - Upload file (requires auth)
router.post(
  '/',
  protect, // Authentication required
  upload, // Formidable upload middleware
  uploadFile // Controller handler
);

// POST /api/upload/validate - Validate file without uploading (requires auth)
// This is useful for pre-upload checks
router.post(
  '/validate',
  protect, // Authentication required
  upload, // Formidable upload middleware
  validateFile // Controller handler
);

// GET /api/upload/types - Get allowed file types
router.get('/types', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      allowedTypes: Object.keys(ALLOWED_MIME_TYPES),
      categories: {
        images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        videos: ["video/mp4", "video/quicktime", "video/webm"],
        audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
        documents: ["application/pdf"],
      },
      limits: {
        images: "10MB",
        videos: "100MB",
        audio: "50MB",
        documents: "20MB",
      },
    },
  });
});

export default router;
