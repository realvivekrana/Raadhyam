import { body, param, validationResult } from 'express-validator';

/**
 * Validation rules for course creation
 */
const validateCreateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
    
  body('duration')
    .optional()
    .isString()
    .withMessage('Duration must be a string'),
    
  body('instructor.name')
    .optional()
    .notEmpty()
    .withMessage('Instructor name is required'),
    
  body('instructor.email')
    .optional()
    .isEmail()
    .withMessage('Instructor email must be valid'),
    
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
    
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),
    
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),
    
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string'),
    
  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('IsFree must be a boolean'),
    
  body('duration')
    .optional()
    .isString()
    .withMessage('Duration must be a string'),
    
  // Handle instructor object
  body('instructor')
    .optional()
    .isObject()
    .withMessage('Instructor must be an object')
];

/**
 * Validation rules for course update
 */
const validateUpdateCourse = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 100 characters'),
    
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
    
  body('duration')
    .optional()
    .isString()
    .withMessage('Duration must be a string'),
    
  body('instructor.name')
    .optional()
    .notEmpty()
    .withMessage('Instructor name cannot be empty'),
    
  body('instructor.email')
    .optional()
    .isEmail()
    .withMessage('Instructor email must be valid'),
    
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
    
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),
    
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),
    
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string'),
    
  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('IsFree must be a boolean'),
    
  body('duration')
    .optional()
    .isString()
    .withMessage('Duration must be a string'),
    
  // Handle instructor object
  body('instructor')
    .optional()
    .isObject()
    .withMessage('Instructor must be an object')
];

/**
 * Validation result handler - checks for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateCourse = [...validateCreateCourse, validate];

// =====================================================
// MUSIC VALIDATION RULES
// =====================================================

/**
 * Validation rules for music creation
 * Required: title, artist, fileUrl
 * Optional: duration, album, genre, thumbnailUrl, publicId
 */
const validateCreateMusic = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  
  body('artist')
    .trim()
    .notEmpty()
    .withMessage('Artist is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Artist name must be between 2 and 100 characters'),
  
  body('fileUrl')
    .trim()
    .notEmpty()
    .withMessage('File URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('File URL must be a valid HTTP/HTTPS URL'),
  
  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number (in seconds)')
    .custom((value) => {
      if (value < 0 || value > 86400) {
        throw new Error('Duration must be between 0 and 86400 seconds (max 24 hours)');
      }
      return true;
    }),
  
  body('album')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Album name must be at most 100 characters'),
  
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Genre must be at most 50 characters'),
  
  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Thumbnail URL must be a valid HTTP/HTTPS URL'),
  
  body('publicId')
    .optional()
    .trim()
    .isString()
    .withMessage('Public ID must be a string')
];

/**
 * Validation rules for music ID parameter
 */
const validateMusicId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Music ID is required')
    .isMongoId()
    .withMessage('Invalid music ID format')
];

export const validateMusic = [...validateCreateMusic, validate];
export const validateMusicById = [...validateMusicId, validate];

export {
  validateCreateCourse,
  validateUpdateCourse,
  validateCreateMusic,
  validateMusicId,
  validate
};

// =====================================================
// USER DASHBOARD VALIDATION RULES
// =====================================================

/**
 * Validation rules for creating a user note
 * Required: courseId (MongoDB ObjectId), content (string)
 * Optional: title (string)
 */
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
];

/**
 * Validation rules for note ID parameter
 */
const validateNoteId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Note ID is required')
    .isMongoId()
    .withMessage('Invalid note ID format'),
];

export {
  validateCreateNote,
  validateNoteId
};
