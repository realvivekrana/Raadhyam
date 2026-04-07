import express from 'express';
const router = express.Router();
import courseController from '../controllers/CourseController.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

export default router;
