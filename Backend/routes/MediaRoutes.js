import express from 'express';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist
} from '../controllers/MediaController.js';

const router = express.Router();

// Albums
router.post('/albums', verifyToken, isAdmin, createAlbum);
router.get('/albums', getAllAlbums);
router.get('/albums/:id', getAlbumById);
router.put('/albums/:id', verifyToken, isAdmin, updateAlbum);
router.delete('/albums/:id', verifyToken, isAdmin, deleteAlbum);

// Artists
router.post('/artists', verifyToken, isAdmin, createArtist);
router.get('/artists', getAllArtists);
router.get('/artists/:id', getArtistById);
router.put('/artists/:id', verifyToken, isAdmin, updateArtist);
router.delete('/artists/:id', verifyToken, isAdmin, deleteArtist);

// Playlists
router.post('/playlists', verifyToken, createPlaylist);
router.get('/playlists', getAllPlaylists);
router.get('/playlists/:id', getPlaylistById);
router.put('/playlists/:id', verifyToken, updatePlaylist);
router.delete('/playlists/:id', verifyToken, deletePlaylist);
router.post('/playlists/:id/songs', verifyToken, addToPlaylist);
router.delete('/playlists/:id/songs/:songId', verifyToken, removeFromPlaylist);

export default router;