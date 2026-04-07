/**
 * Course Controller
 * 
 * Handles all course-related operations including CRUD operations.
 * Uses mongoose for MongoDB operations.
 */

import mongoose from 'mongoose';
import { Course } from '../models/CourseSchema.js';

/**
 * Validate MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

/**
 * Build course query filters from query parameters
 */
const buildCourseQuery = (query) => {
  const filters = {};
  
  // Filter by category
  if (query.category) {
    filters.category = query.category;
  }
  
  // Filter by level
  if (query.level) {
    filters.level = query.level;
  }
  
  // Filter by publish status (default to published for public access)
  if (query.status) {
    filters['publish.status'] = query.status;
  }
  
  // Filter by visibility
  if (query.visibility) {
    filters.visibility = query.visibility;
  } else {
    // Default to public courses only for public endpoints
    filters.visibility = 'public';
  }
  
  // Filter by instructor name
  if (query.instructor) {
    filters['instructor.name'] = { $regex: query.instructor, $options: 'i' };
  }
  
  // Filter free courses
  if (query.free === 'true') {
    filters.isFree = true;
  }
  
  return filters;
};

/**
 * GET /api/courses
 * Get all courses (public endpoint)
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - category: Filter by category
 * - level: Filter by level (Beginner, Intermediate, Advanced)
 * - status: Filter by publish status (draft, published, archived)
 * - instructor: Filter by instructor name
 * - free: Filter free courses (true/false)
 * - search: Search in title and description
 * - sort: Sort field (createdAt, title, price, stats.rating)
 * - order: Sort order (asc, desc)
 */
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query filters
    const filters = buildCourseQuery(req.query);
    
    // Search functionality
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { shortDescription: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sorting
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    // Execute query
    const courses = await Course.find(filters)
      .select('-modules.lessons -reviews') // Exclude heavy nested data for list view
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Course.countDocuments(filters);
    
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

/**
 * GET /api/courses/:id
 * Get course by ID (public endpoint)
 * 
 * Route params:
 * - id: Course ID
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    // Find course
    const course = await Course.findById(id)
      .populate('createdBy', 'name email')
      .lean();
    
    // Check if course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Increment view count (analytics)
    await Course.findByIdAndUpdate(id, { 
      $inc: { 'analytics.views': 1 } 
    });
    
    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course
    });
    
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

/**
 * POST /api/courses
 * Create a new course (admin only)
 * 
 * Required fields:
 * - title: Course title
 * 
 * Optional fields:
 * - description: Course description
 * - duration: Course duration
 * - instructor: Instructor object with name, bio, email
 * - subtitle, shortDescription, category, level, language
 * - thumbnailUrl, promoVideoUrl, price, currency, isFree, offerPrice
 * - prerequisites, whatYouWillLearn, requirements
 * - tags, visibility, publish.status
 */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      shortDescription,
      description,
      category,
      tags,
      level,
      language,
      thumbnailUrl,
      promoVideoUrl,
      price,
      currency,
      isFree,
      offerPrice,
      duration,
      prerequisites,
      whatYouWillLearn,
      requirements,
      instructor,
      visibility,
      publish
    } = req.body;
    
    // Validation: Title is required
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required'
      });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check for duplicate slug
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'A course with similar title already exists. Please choose a different title.'
      });
    }
    
    // Create course object
    const courseData = {
      title: title.trim(),
      slug,
      subtitle: subtitle?.trim(),
      shortDescription: shortDescription?.trim(),
      description: description?.trim(),
      category,
      tags: tags || [],
      level,
      language: language || 'English',
      thumbnailUrl,
      promoVideoUrl,
      price: price || 0,
      currency: currency || 'INR',
      isFree: isFree || false,
      offerPrice,
      duration,
      prerequisites: prerequisites || [],
      whatYouWillLearn: whatYouWillLearn || [],
      requirements: requirements || [],
      instructor: instructor || {},
      visibility: visibility || 'public',
      publish: publish || { status: 'draft' },
      createdBy: req.user._id
    };
    
    // Create and save course
    const course = new Course(courseData);
    const savedCourse = await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: savedCourse
    });
    
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

/**
 * PUT /api/courses/:id
 * Update a course (admin only)
 * 
 * Route params:
 * - id: Course ID
 * 
 * Body: Fields to update (all fields optional except validation)
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // If title is being updated, generate new slug and check for duplicates
    if (updateData.title && updateData.title !== existingCourse.title) {
      const newSlug = updateData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check for duplicate slug (excluding current course)
      const duplicateSlug = await Course.findOne({ 
        slug: newSlug,
        _id: { $ne: id }
      });
      
      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: 'A course with similar title already exists. Please choose a different title.'
        });
      }
      
      updateData.slug = newSlug;
    }
    
    // Remove fields that should not be updated directly
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData['stats.enrolledStudents'];
    
    // Update timestamp
    updateData.updatedAt = new Date();
    
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
    
  } catch (error) {
    console.error('Error updating course:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

/**
 * DELETE /api/courses/:id
 * Delete a course (admin only)
 * 
 * Route params:
 * - id: Course ID
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    // Find and delete course
    const deletedCourse = await Course.findByIdAndDelete(id);
    
    // Check if course existed
    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        _id: deletedCourse._id,
        title: deletedCourse.title
      }
    });
    
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
