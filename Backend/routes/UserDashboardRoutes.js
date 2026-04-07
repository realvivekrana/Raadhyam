import express from 'express';
import { body, param, validationResult } from 'express-validator';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import { getUserCourses, enrollInCourse, createNote, getNoteById } from '../controllers/UserDashboardController.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

const validateCreateNote = [
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID format'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  validate
];

const validateNoteId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Note ID is required')
    .isMongoId()
    .withMessage('Invalid note ID format'),
  
  validate
];

const validateEnroll = [
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID format'),
  
  validate
];

router.get('/courses', verifyToken, getUserCourses);
router.post('/enroll', verifyToken, validateEnroll, enrollInCourse);
router.post('/notes', verifyToken, validateCreateNote, createNote);
router.get('/notes/:id', verifyToken, validateNoteId, getNoteById);

export default router;