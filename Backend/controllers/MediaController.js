import Album from '../models/AlbumSchema.js';
import Artist from '../models/ArtistSchema.js';
import Playlist from '../models/PlaylistSchema.js';
import Music from '../models/MusicSchema.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/ApiResponse.js';

export const createAlbum = async (req, res, next) => {
  try {
    const {
      title, artist, genre, releaseYear, totalTracks, 
      status, label, upcCode, description, coverUrl, coverMetadata
    } = req.body;

    // Validation
    if (!title || !artist || !genre) {
      return errorResponse(res, 'Title, artist, and genre are required', 400);
    }

    const album = new Album({
      title,
      artist,
      genre,
      releaseYear,
      totalTracks,
      status,
      label,
      upcCode,
      description,
      coverUrl,
      coverFileName: coverMetadata?.originalName,
      coverMetadata,
      createdBy: req.user.id
    });

    await album.save();
    return successResponse(res, album, 'Album created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllAlbums = async (req, res, next) => {
  try {
    const { search, status, genre, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (status) {
      query.status = status;
    }
    if (genre) {
      query.genre = genre;
    }

    const albums = await Album.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Album.countDocuments(query);

    return successResponse(res, {
      albums,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }, 'Albums fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate('tracks', 'title artist duration');
    
    if (!album) {
      return notFoundResponse(res, 'Album not found');
    }

    return successResponse(res, album, 'Album fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const album = await Album.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!album) {
      return notFoundResponse(res, 'Album not found');
    }

    return successResponse(res, album, 'Album updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findByIdAndDelete(id);
    
    if (!album) {
      return notFoundResponse(res, 'Album not found');
    }

    return successResponse(res, null, 'Album deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const {
      name, genre, country, debutYear, email, website, 
      status, monthlyListeners, bio, socialLinks
    } = req.body;

    // Validation
    if (!name || !genre) {
      return errorResponse(res, 'Name and genre are required', 400);
    }

    const artist = new Artist({
      name,
      genre,
      country,
      debutYear,
      email,
      website,
      status,
      monthlyListeners,
      bio,
      socialLinks,
      createdBy: req.user.id
    });

    await artist.save();
    return successResponse(res, artist, 'Artist created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllArtists = async (req, res, next) => {
  try {
    const { search, status, genre, country, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (status) {
      query.status = status;
    }
    if (genre) {
      query.genre = genre;
    }
    if (country) {
      query.country = country;
    }

    const artists = await Artist.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Artist.countDocuments(query);

    return successResponse(res, {
      artists,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }, 'Artists fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id)
      .populate('songs', 'title duration')
      .populate('albums', 'title releaseYear');
    
    if (!artist) {
      return notFoundResponse(res, 'Artist not found');
    }

    return successResponse(res, artist, 'Artist fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const artist = await Artist.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!artist) {
      return notFoundResponse(res, 'Artist not found');
    }

    return successResponse(res, artist, 'Artist updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByIdAndDelete(id);
    
    if (!artist) {
      return notFoundResponse(res, 'Artist not found');
    }

    return successResponse(res, null, 'Artist deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const {
      name, genre, visibility, status, description, 
      coverImageUrl, coverMetadata, songs, tags
    } = req.body;

    // Validation
    if (!name || !genre) {
      return errorResponse(res, 'Name and genre are required', 400);
    }

    const playlist = new Playlist({
      name,
      genre,
      visibility,
      status,
      description,
      coverImageUrl,
      coverImageFileName: coverMetadata?.originalName,
      coverImageMetadata,
      songs: songs || [],
      creator: req.user.id,
      creatorName: req.user.name || req.user.email,
      tags
    });

    await playlist.save();
    return successResponse(res, playlist, 'Playlist created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllPlaylists = async (req, res, next) => {
  try {
    const { search, status, genre, visibility, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (status) {
      query.status = status;
    }
    if (genre) {
      query.genre = genre;
    }
    if (visibility) {
      query.visibility = visibility;
    }

    const playlists = await Playlist.find(query)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Playlist.countDocuments(query);

    return successResponse(res, {
      playlists,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }, 'Playlists fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id)
      .populate('songs', 'title artist duration');
    
    if (!playlist) {
      return notFoundResponse(res, 'Playlist not found');
    }

    return successResponse(res, playlist, 'Playlist fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const playlist = await Playlist.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!playlist) {
      return notFoundResponse(res, 'Playlist not found');
    }

    return successResponse(res, playlist, 'Playlist updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByIdAndDelete(id);
    
    if (!playlist) {
      return notFoundResponse(res, 'Playlist not found');
    }

    return successResponse(res, null, 'Playlist deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const addToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return notFoundResponse(res, 'Playlist not found');
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    return successResponse(res, playlist, 'Song added to playlist successfully');
  } catch (error) {
    next(error);
  }
};

export const removeFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return notFoundResponse(res, 'Playlist not found');
    }

    playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
    await playlist.save();

    return successResponse(res, playlist, 'Song removed from playlist successfully');
  } catch (error) {
    next(error);
  }
};
