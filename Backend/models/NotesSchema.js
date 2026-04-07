import mongoose from "mongoose";

const MusicNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["guitar", "piano", "vocals", "drums", "other"],
    },
    thumbnail: {
      type: String,
    },
    // Reference to the user who created the note
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Optional reference to a course if the note is tied to a specific course
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    sections: [
      {
        lyrics: {
          type: String,
          default: "",
        },
        notation: {
          tabs: { type: String, default: "" },
          string: { type: String, default: "" },
          level: { type: String, default: "" },
          playingTechniques: { type: [String], default: [] },
        },
      },
    ],
    explanation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index to quickly find notes by creator and optionally by course
MusicNoteSchema.index({ createdBy: 1, course: 1 });

export default mongoose.model("MusicNote", MusicNoteSchema);
