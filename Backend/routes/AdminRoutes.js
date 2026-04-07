import express from 'express';
import { upload } from '../middlewares/Upload.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  createCourse,
  updateCourse,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getCourseByIdAdmin,
  generateCourseSlug,
  validateCourse,
  uploadFile,
  getAllMusicNotes,
  createMusicNote,
  updateMusicNote,
  deleteMusicNote,
  getMusicNoteById,
  uploadThumbnail,
  getDashboardStats,
  getAllUsersAdmin,
  createUser,
  getUserByIdAdmin,
  updateUser,
  deleteUser,
  updateUserStatus
} from '../controllers/AdminController.js';


const router = express.Router();
router.get('/dashboard/stats', verifyToken, isAdmin, getDashboardStats);

router.post('/courses', verifyToken, isAdmin, createCourse);
router.get('/courses', getAllCoursesAdmin);
router.get('/courses/:id', verifyToken, isAdmin, getCourseByIdAdmin);
router.put('/courses/:id', verifyToken, isAdmin, updateCourse);
router.delete('/courses/:id', verifyToken, isAdmin, deleteCourseAdmin);
router.post('/courses/generate-slug', verifyToken, isAdmin, generateCourseSlug);
router.post('/courses/validate', verifyToken, isAdmin, validateCourse);

router.post('/upload', verifyToken, isAdmin, upload, uploadFile);
router.post('/upload/thumbnail', verifyToken, isAdmin, upload, uploadThumbnail);
router.get('/music-notes', verifyToken, isAdmin, getAllMusicNotes);
router.post('/music-notes', verifyToken, isAdmin, createMusicNote);
router.get('/music-notes/:id', verifyToken, isAdmin, getMusicNoteById);
router.put('/music-notes/:id', verifyToken, isAdmin, updateMusicNote);
router.delete('/music-notes/:id', verifyToken, isAdmin, deleteMusicNote);

router.get('/users', verifyToken, isAdmin, getAllUsersAdmin);
router.post('/users', verifyToken, isAdmin, createUser);
router.get('/users/:id', verifyToken, isAdmin, getUserByIdAdmin);
router.put('/users/:id', verifyToken, isAdmin, updateUser);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);
router.put('/users/:id/status', verifyToken, isAdmin, updateUserStatus);


export default router;
