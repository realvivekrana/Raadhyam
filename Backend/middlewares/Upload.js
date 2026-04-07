import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    let folder = "uploads/others";
    let resource_type = "auto";
//...

    // IMAGE
    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
      resource_type = "image";
    }

    // PDF
    else if (file.mimetype === "application/pdf") {
      folder = "uploads/pdfs";
      resource_type = "raw";
    }

    // VIDEO
    else if (file.mimetype.startsWith("video/")) {
      folder = "uploads/videos";
      resource_type = "video";
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "")}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // ✅ 2GB (safe for videos)
  },
});

export default upload;
