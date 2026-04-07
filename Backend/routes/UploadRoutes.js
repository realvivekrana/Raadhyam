/**
 * Upload Routes
 * Handles file uploads to Cloudinary
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
import upload from '../middlewares/Upload.js';
import { uploadFile, validateFile } from '../controllers/UploadController.js';

const router = express.Router();

// Error handling wrapper for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof Error) {
    console.error('Multer error:', err.message);
    
    // Handle specific error codes
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 100MB',
        code: 'FILE_TOO_LARGE',
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file per request is allowed',
        code: 'TOO_MANY_FILES',
      });
    }
    
    if (err.code === 'INVALID_FILE_TYPE') {
      return res.status(400).json({
        success: false,
        message: err.message,
        code: 'INVALID_FILE_TYPE',
      });
    }
    
    // Generic multer error
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
      code: 'UPLOAD_ERROR',
    });
  }
  
  next(err);
};

// POST /api/upload - Upload file (requires auth)
router.post(
  '/',
  protect, // Authentication required
  upload.single('file'), // Single file upload, field name: 'file'
  handleMulterError, // Handle multer errors
  uploadFile // Controller handler
);

// POST /api/upload/validate - Validate file without uploading (requires auth)
// This is useful for pre-upload checks
router.post(
  '/validate',
  protect, // Authentication required
  upload.single('file'), // Single file upload, field name: 'file'
  handleMulterError, // Handle multer errors
  validateFile // Controller handler
);

export default router;
