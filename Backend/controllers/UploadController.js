import cloudinary from "../config/Cloudinary.js";
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        code: "NO_FILE",
      });
    }

    const file = req.file;
    const config = file.allowedConfig || {};

    const safeFilename = (file.originalname || file.name)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")
      .toLowerCase();

    const publicId = `${Date.now()}-${safeFilename}`;

    const cloudinaryResult = await cloudinary.uploader.upload(file.filepath, {
      folder: config.folder || "uploads/others",
      public_id: publicId,
      resource_type: config.resource_type || "auto",
      use_filename: false,
      unique_filename: false,
      overwrite: false,
    });

    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError.message);
    }

    const response = {
      success: true,
      message: "File uploaded successfully",
      data: {
        url: cloudinaryResult.secure_url,
        
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
        
        metadata: {
          originalName: file.originalname || file.name,
          mimetype: file.mimetype,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          category: getFileCategory(file.mimetype),
        },
        
        uploadedAt: new Date().toISOString(),
      },
    };

    if (cloudinaryResult.width && cloudinaryResult.height) {
      response.data.metadata.dimensions = {
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
      };
    }

    if (cloudinaryResult.duration) {
      response.data.metadata.duration = cloudinaryResult.duration;
      response.data.metadata.durationFormatted = formatDuration(cloudinaryResult.duration);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error("Upload error:", error);
    
    if (error.http_code) {
      return res.status(error.http_code).json({
        success: false,
        message: error.message || "Cloudinary upload failed",
        code: "CLOUDINARY_ERROR",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "File upload failed",
      code: "UPLOAD_ERROR",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

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

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getFileCategory(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype === "application/pdf") return "document";
  return "other";
}

export default { uploadFile, validateFile };
