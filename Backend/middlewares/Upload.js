import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary.js";

// File type validation - safe MIME types for production
const ALLOWED_MIME_TYPES = {
  // Images
  "image/jpeg": { ext: "jpg|jpeg", folder: "uploads/images", resource: "image", maxSize: 10 * 1024 * 1024 },
  "image/png": { ext: "png", folder: "uploads/images", resource: "image", maxSize: 10 * 1024 * 1024 },
  "image/gif": { ext: "gif", folder: "uploads/images", resource: "image", maxSize: 10 * 1024 * 1024 },
  "image/webp": { ext: "webp", folder: "uploads/images", resource: "image", maxSize: 10 * 1024 * 1024 },
  
  // Videos
  "video/mp4": { ext: "mp4", folder: "uploads/videos", resource: "video", maxSize: 100 * 1024 * 1024 },
  "video/quicktime": { ext: "mov", folder: "uploads/videos", resource: "video", maxSize: 100 * 1024 * 1024 },
  "video/webm": { ext: "webm", folder: "uploads/videos", resource: "video", maxSize: 100 * 1024 * 1024 },
  
  // Audio (for music creation)
  "audio/mpeg": { ext: "mp3", folder: "uploads/audio", resource: "video", maxSize: 50 * 1024 * 1024 },
  "audio/wav": { ext: "wav", folder: "uploads/audio", resource: "video", maxSize: 50 * 1024 * 1024 },
  "audio/ogg": { ext: "ogg", folder: "uploads/audio", resource: "video", maxSize: 50 * 1024 * 1024 },
  "audio/flac": { ext: "flac", folder: "uploads/audio", resource: "video", maxSize: 50 * 1024 * 1024 },
  
  // Documents
  "application/pdf": { ext: "pdf", folder: "uploads/pdfs", resource: "raw", maxSize: 20 * 1024 * 1024 },
};

// File filter function for multer
const fileFilter = (req, file, cb) => {
  const allowedType = ALLOWED_MIME_TYPES[file.mimetype];
  
  if (!allowedType) {
    const error = new Error(`File type '${file.mimetype}' is not allowed. Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}`);
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }
  
  // Attach allowed config to file object for later use
  file.allowedConfig = allowedType;
  cb(null, true);
};

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const config = file.allowedConfig || {
      folder: "uploads/others",
      resource_type: "auto"
    };

    // Generate safe public_id
    const safeFilename = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")
      .toLowerCase();

    return {
      folder: config.folder || "uploads/others",
      resource_type: config.resource_type || "auto",
      public_id: `${Date.now()}-${safeFilename}`,
      // Override format for better compatibility
      format: file.mimetype.includes("pdf") ? "pdf" : undefined,
    };
  },
});

// Multer upload middleware with reasonable limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max - actual limits enforced by type
    files: 1, // Single file per request
  },
});

// Helper function to validate file size after upload config
export const validateFileSize = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const config = req.file.allowedConfig;
  if (config && req.file.size > config.maxSize) {
    return res.status(400).json({
      success: false,
      message: `File too large. Maximum size for ${config.ext} is ${config.maxSize / (1024 * 1024)}MB`,
      code: "FILE_TOO_LARGE",
      maxSize: config.maxSize,
      actualSize: req.file.size,
    });
  }

  next();
};

// Export allowed types for documentation
export { ALLOWED_MIME_TYPES };

export default upload;
