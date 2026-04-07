import Music from "../models/MusicSchema.js";
import mongoose from "mongoose";

export const getAllMusic = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const music = await Music.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Music.countDocuments({ isPublic: true });

    return res.status(200).json({
      success: true,
      data: music,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch music",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getMusicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid music ID format"
      });
    }

    const music = await Music.findById(id).select('-__v');

    if (!music) {
      return res.status(404).json({
        success: false,
        message: "Music not found"
      });
    }

    if (!music.isPublic) {
      return res.status(404).json({
        success: false,
        message: "Music not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: music
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch music",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const createMusic = async (req, res) => {
  try {
    const { title, artist, duration, fileUrl, publicId, thumbnailUrl, album, genre } = req.body;

    if (!title || !artist || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing: [
          !title ? "title" : null,
          !artist ? "artist" : null,
          !fileUrl ? "fileUrl" : null
        ].filter(Boolean)
      });
    }

    if (title.trim().length < 2 || title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 2 and 200 characters"
      });
    }

    if (artist.trim().length < 2 || artist.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Artist name must be between 2 and 100 characters"
      });
    }

    if (!fileUrl.startsWith('http')) {
      return res.status(400).json({
        success: false,
        message: "fileUrl must be a valid HTTP/HTTPS URL"
      });
    }

    if (duration !== undefined) {
      if (typeof duration !== 'number' || duration < 0 || duration > 86400) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a valid number in seconds (max 24 hours)"
        });
      }
    }

    const newMusic = new Music({
      title: title.trim(),
      artist: artist.trim(),
      duration: duration || null,
      fileUrl: fileUrl,
      publicId: publicId || null,
      thumbnailUrl: thumbnailUrl || null,
      album: album ? album.trim() : null,
      genre: genre ? genre.trim() : null,
      createdBy: req.user._id,
      isPublic: true
    });

    await newMusic.save();

    return res.status(201).json({
      success: true,
      message: "Music created successfully",
      data: newMusic.toObject({ versionKey: false })
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create music entry",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid music ID format"
      });
    }

    const music = await Music.findById(id);

    if (!music) {
      return res.status(404).json({
        success: false,
        message: "Music not found"
      });
    }

    await Music.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Music deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete music",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
