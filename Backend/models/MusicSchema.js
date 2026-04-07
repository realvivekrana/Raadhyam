import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  album: { type: String, trim: true },
  genre: { type: String, trim: true },
  duration: { type: Number }, // in seconds
  fileUrl: { type: String, required: true }, // URL to the uploaded audio file
  thumbnailUrl: { type: String }, // URL to the album art/thumbnail
  publicId: { type: String }, // Cloudinary public ID for file management
  isPublic: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Optional: Reference to a course if this music is part of a course
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
}, { timestamps: true });

// Indexes for efficient querying
musicSchema.index({ title: "text", artist: "text" });
musicSchema.index({ createdBy: 1 });
musicSchema.index({ course: 1 });
musicSchema.index({ genre: 1 });

const Music = mongoose.model("Music", musicSchema);
export default Music;