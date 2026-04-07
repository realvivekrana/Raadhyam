import express from 'express';
const router = express.Router();
import courseController from '../controllers/CourseController.js';

// Public routes: get courses
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

export default router;
