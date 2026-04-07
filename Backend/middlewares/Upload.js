import formidable from "formidable";
import cloudinary from "../config/Cloudinary.js";

// File type validation - safe MIME types for production
const ALLOWED_MIME_TYPES = {
  // Images
  "image/jpeg": { ext: "jpg|jpeg", folder: "uploads/images", resource_type: "image", maxSize: 10 * 1024 * 1024 },
  "image/png": { ext: "png", folder: "uploads/images", resource_type: "image", maxSize: 10 * 1024 * 1024 },
  "image/gif": { ext: "gif", folder: "uploads/images", resource_type: "image", maxSize: 10 * 1024 * 1024 },
  "image/webp": { ext: "webp", folder: "uploads/images", resource_type: "image", maxSize: 10 * 1024 * 1024 },
  
  // Videos
  "video/mp4": { ext: "mp4", folder: "uploads/videos", resource_type: "video", maxSize: 100 * 1024 * 1024 },
  "video/quicktime": { ext: "mov", folder: "uploads/videos", resource_type: "video", maxSize: 100 * 1024 * 1024 },
  "video/webm": { ext: "webm", folder: "uploads/videos", resource_type: "video", maxSize: 100 * 1024 * 1024 },
  
  // Audio (for music creation)
  "audio/mpeg": { ext: "mp3", folder: "uploads/audio", resource_type: "video", maxSize: 50 * 1024 * 1024 },
  "audio/wav": { ext: "wav", folder: "uploads/audio", resource_type: "video", maxSize: 50 * 1024 * 1024 },
  "audio/ogg": { ext: "ogg", folder: "uploads/audio", resource_type: "video", maxSize: 50 * 1024 * 1024 },
  "audio/flac": { ext: "flac", folder: "uploads/audio", resource_type: "video", maxSize: 50 * 1024 * 1024 },
  
  // Documents
  "application/pdf": { ext: "pdf", folder: "uploads/pdfs", resource_type: "raw", maxSize: 20 * 1024 * 1024 },
};

// Disable body parsing for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parse multipart form data and attach files to request
 * Returns middleware that handles file upload
 */
export const upload = (req, res, next) => {
  const form = formidable({
    maxFileSize: 100 * 1024 * 1024, // 100MB max
    maxFiles: 1,
    filter: ({ mimetype }) => {
      const allowed = !!ALLOWED_MIME_TYPES[mimetype];
      if (!allowed) {
        console.warn(`Blocked file type: ${mimetype}`);
      }
      return allowed;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(400).json({
        success: false,
        message: "File upload failed: " + err.message,
        code: "PARSE_ERROR",
      });
    }

    // Get the file from the parsed files object
    const fileField = files.file;
    if (!fileField || fileField.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        code: "NO_FILE",
      });
    }

    const file = fileField[0];
    const config = ALLOWED_MIME_TYPES[file.mimetype] || {
      folder: "uploads/others",
      resource_type: "auto"
    };

    // Attach file info to request for controller
    req.file = {
      ...file,
      allowedConfig: config,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalFilename || file.name,
    };

    next();
  });
};

// Helper function to validate file size
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
