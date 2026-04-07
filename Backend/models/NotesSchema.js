import mongoose from "mongoose";

const MusicNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String
    },

    sections: [
      {
        lyrics: {
          type: String,
          default: ""
        },

        notation: {
          tabs: { type: String, default: "" },
          string: { type: String, default: "" },
          level: { type: String, default: "" },
          playingTechniques: { type: [String], default: [] }
        },
      },
    ],
    explanation: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

export default mongoose.model("MusicNote", MusicNoteSchema);
//...
