import mongoose from 'mongoose';
import { Course } from '../models/CourseSchema.js';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

const buildCourseQuery = (query) => {
  const filters = {};
  
  if (query.category) {
    filters.category = query.category;
  }
  
  if (query.level) {
    filters.level = query.level;
  }
  
  if (query.status) {
    filters['publish.status'] = query.status;
  } else {
      filters['publish.status'] = 'published';
  }
  
  if (query.visibility) {
    filters.visibility = query.visibility;
  } else {
      filters.visibility = 'public';
  }
  
  if (query.instructor) {
    filters['instructor.name'] = { $regex: query.instructor, $options: 'i' };
  }
  
  if (query.free === 'true') {
    filters.isFree = true;
  }
  
  return filters;
};

export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filters = buildCourseQuery(req.query);
    
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { shortDescription: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
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

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    const course = await Course.findById(id)
      .populate('createdBy', 'name email')
      .lean();
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (course.publish?.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
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
    
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required'
      });
    }
    
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'A course with similar title already exists. Please choose a different title.'
      });
    }
    
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
    
    const course = new Course(courseData);
    const savedCourse = await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: savedCourse
    });
    
  } catch (error) {
    console.error('Error creating course:', error);
    
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

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (updateData.title && updateData.title !== existingCourse.title) {
      const newSlug = updateData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
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
    
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData['stats.enrolledStudents'];
    
    updateData.updatedAt = new Date();
    
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

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }
    
    const deletedCourse = await Course.findByIdAndDelete(id);
    
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
