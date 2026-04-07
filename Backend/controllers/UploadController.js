/**
 * Upload Controller
 * Handles file uploads to Cloudinary with proper validation and error handling
 * Uses formidable for parsing multipart form data
 */

import cloudinary from "../config/Cloudinary.js";
import fs from "fs";

/**
 * POST /api/upload
 * Upload a single file to Cloudinary
 * 
 * @middleware - Auth required, formidable upload middleware applied before this handler
 * @param {Object} req - Express request object with req.file from formidable
 * @param {Object} res - Express response object
 */
export const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        code: "NO_FILE",
      });
    }

    const file = req.file;
    const config = file.allowedConfig || {};

    // Generate safe public_id
    const safeFilename = (file.originalname || file.name)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")
      .toLowerCase();

    const publicId = `${Date.now()}-${safeFilename}`;

    // Upload to Cloudinary using the file's filepath
    const cloudinaryResult = await cloudinary.uploader.upload(file.filepath, {
      folder: config.folder || "uploads/others",
      public_id: publicId,
      resource_type: config.resource_type || "auto",
      use_filename: false,
      unique_filename: false,
      overwrite: false,
    });

    // Clean up temp file after upload
    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError.message);
    }

    // Build response with Cloudinary URL and metadata
    const response = {
      success: true,
      message: "File uploaded successfully",
      data: {
        // Primary URL for frontend use
        url: cloudinaryResult.secure_url,
        
        // Cloudinary-specific details
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          url: cloudinaryResult.secure_url,
          secure_url: cloudinaryResult.secure_url,
          resource_type: cloudinaryResult.resource_type,
          format: cloudinaryResult.format,
          folder: cloudinaryResult.folder,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          duration: cloudinaryResult.duration,
        },
        
        // File metadata (safe for frontend and other services)
        metadata: {
          originalName: file.originalname || file.name,
          mimetype: file.mimetype,
          size: file.size,
          // Size in human-readable format
          sizeFormatted: formatBytes(file.size),
          // File category based on MIME type
          category: getFileCategory(file.mimetype),
        },
        
        // Timestamps
        uploadedAt: new Date().toISOString(),
      },
    };

    // Add dimensions for images
    if (cloudinaryResult.width && cloudinaryResult.height) {
      response.data.metadata.dimensions = {
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
      };
    }

    // Add duration for audio/video
    if (cloudinaryResult.duration) {
      response.data.metadata.duration = cloudinaryResult.duration;
      response.data.metadata.durationFormatted = formatDuration(cloudinaryResult.duration);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error("Upload error:", error);
    
    // Handle Cloudinary-specific errors
    if (error.http_code) {
      return res.status(error.http_code).json({
        success: false,
        message: error.message || "Cloudinary upload failed",
        code: "CLOUDINARY_ERROR",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }

    // Handle other upload errors
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      code: "UPLOAD_ERROR",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * POST /api/upload/validate
 * Validate file without uploading (for pre-upload checks)
 * 
 * @body - multipart/form-data with file
 */
export const validateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided for validation",
        code: "NO_FILE",
      });
    }

    const file = req.file;
    const config = file.allowedConfig || {};

    return res.status(200).json({
      success: true,
      message: "File is valid",
      data: {
        valid: true,
        metadata: {
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          category: getFileCategory(file.mimetype),
        },
        limits: {
          maxSize: config.maxSize || 100 * 1024 * 1024,
          maxSizeFormatted: formatBytes(config.maxSize || 100 * 1024 * 1024),
        },
        wouldUpload: {
          folder: config.folder || "uploads/others",
          resource_type: config.resource_type || "auto",
        },
      },
    });

  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({
      success: false,
      message: "File validation failed",
      code: "VALIDATION_ERROR",
    });
  }
};

// Helper functions

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format duration from seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get file category from MIME type
 */
function getFileCategory(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype === "application/pdf") return "document";
  return "other";
}

export default { uploadFile, validateFile };
