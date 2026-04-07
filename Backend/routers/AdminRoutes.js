import express from 'express';
import upload from '../middlewares/Upload.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';
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
  uploadThumbnail
} from '../controllers/AdminController.js';


const router = express.Router();


router.post('/admin/courses', verifyToken, createCourse);
router.get('/admin/courses', verifyToken, getAllCoursesAdmin);
router.get('/admin/courses/:id', verifyToken, getCourseByIdAdmin);
router.put('/admin/courses/:id', verifyToken, updateCourse);
router.delete('/admin/courses/:id', verifyToken, deleteCourseAdmin);
router.post('/admin/courses/generate-slug', verifyToken, generateCourseSlug);
router.post('/admin/courses/validate', verifyToken, validateCourse);

router.post('/admin/upload', verifyToken, upload.single('file'), uploadFile);
router.post('/admin/upload/thumbnail', verifyToken, upload.single('thumbnail'), uploadThumbnail);
router.get('/admin/music-notes', verifyToken, getAllMusicNotes);
router.post('/admin/music-notes', verifyToken, createMusicNote);
router.get('/admin/music-notes/:id', verifyToken, getMusicNoteById);
router.put('/admin/music-notes/:id', verifyToken, updateMusicNote);
router.delete('/admin/music-notes/:id', verifyToken, deleteMusicNote);
//...

export default router;