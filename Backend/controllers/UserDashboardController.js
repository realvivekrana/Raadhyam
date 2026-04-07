import mongoose from 'mongoose';
import { Course, Enrollment } from '../models/CourseSchema.js';
import MusicNote from '../models/NotesSchema.js';

/**
 * User Dashboard Controller
 * Handles authenticated user operations for courses and notes
 */

/**
 * GET /api/user/courses
 * Returns all courses enrolled by the authenticated user
 * 
 * Auth: Required (JWT middleware)
 * Returns: Array of enrolled courses with enrollment details
 */
export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ user: userId, isActive: true })
      .populate('course')
      .sort({ enrolledAt: -1 });

    if (!enrollments || enrollments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No enrolled courses found',
        data: []
      });
    }

    // Extract course data with enrollment details
    const courses = enrollments.map(enrollment => ({
      courseId: enrollment.course._id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      thumbnailUrl: enrollment.course.thumbnailUrl,
      subtitle: enrollment.course.subtitle,
      shortDescription: enrollment.course.shortDescription,
      category: enrollment.course.category,
      level: enrollment.course.level,
      instructor: enrollment.course.instructor,
      duration: enrollment.course.duration,
      price: enrollment.course.price,
      isFree: enrollment.course.isFree,
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        isActive: enrollment.isActive,
        lastAccessedLesson: enrollment.lastAccessedLesson
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Enrolled courses retrieved successfully',
      count: courses.length,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: error.message
    });
  }
};

/**
 * POST /api/user/notes
 * Creates a new note for the authenticated user
 * 
 * Auth: Required (JWT middleware)
 * Body: courseId (required), content (required), title (optional)
 * Validation: courseId must be valid MongoDB ID, course must exist
 * 
 * Ownership: Note is automatically linked to the authenticated user
 */
export const createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, content, title } = req.body;

    // Validate courseId is provided
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Validate content is provided
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    // Validate courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Generate title if not provided
    const noteTitle = title || `Note for ${course.title} - ${new Date().toLocaleDateString()}`;

    // Create the note
    const note = new MusicNote({
      title: noteTitle,
      createdBy: userId,
      course: courseId,
      content: content, // Store content in the explanation field or create a simple structure
      explanation: content, // Using explanation field for the content
      category: course.category || 'other'
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        id: note._id,
        title: note.title,
        courseId: note.course,
        content: note.explanation,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });

  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
};

/**
 * GET /api/user/notes/:id
 * Returns a specific note only if it belongs to the authenticated user
 * 
 * Auth: Required (JWT middleware)
 * Ownership: User can only access their own notes
 * 
 * Error Cases:
 * - 400: Invalid note ID format
 * - 403: Note belongs to another user
 * - 404: Note not found
 */
export const getNoteById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Validate note ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    // Find the note
    const note = await MusicNote.findById(id).populate('course');

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Ownership check: Ensure the note belongs to the authenticated user
    if (note.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this note'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: {
        id: note._id,
        title: note.title,
        category: note.category,
        content: note.explanation,
        course: note.course ? {
          id: note.course._id,
          title: note.course.title,
          slug: note.course.slug
        } : null,
        sections: note.sections,
        thumbnail: note.thumbnail,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch note',
      error: error.message
    });
  }
};
