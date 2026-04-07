import express from 'express';
import { protect } from '../middlewares/AuthmiddleWare.js';
import { upload, ALLOWED_MIME_TYPES } from '../middlewares/Upload.js';
import { uploadFile, validateFile } from '../controllers/UploadController.js';

const router = express.Router();

router.post(
  '/',
  protect,
  upload,
  uploadFile
);

router.post(
  '/validate',
  protect,
  upload,
  validateFile
);

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