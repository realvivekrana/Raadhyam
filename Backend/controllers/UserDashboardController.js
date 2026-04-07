import mongoose from 'mongoose';
import { Course, Enrollment } from '../models/CourseSchema.js';
import MusicNote from '../models/NotesSchema.js';

export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id;

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

export const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.publish?.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This course is not available for enrollment'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      if (existingEnrollment.isActive) {
        return res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course',
          alreadyEnrolled: true
        });
      } else {
        existingEnrollment.isActive = true;
        existingEnrollment.enrolledAt = new Date();
        await existingEnrollment.save();

        return res.status(200).json({
          success: true,
          message: 'Enrollment reactivated successfully',
          data: {
            enrollmentId: existingEnrollment._id,
            courseId: course._id,
            courseTitle: course.title,
            enrolledAt: existingEnrollment.enrolledAt,
            isReactivated: true
          }
        });
      }
    }

    const enrollment = new Enrollment({
      course: courseId,
      user: userId,
      purchasedPrice: course.isFree ? 0 : course.price,
      purchaseCurrency: course.currency || 'INR'
    });

    await enrollment.save();

    await Course.findByIdAndUpdate(courseId, {
      $inc: { 'stats.enrolledStudents': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: {
        enrollmentId: enrollment._id,
        courseId: course._id,
        courseTitle: course.title,
        thumbnailUrl: course.thumbnailUrl,
        enrolledAt: enrollment.enrolledAt
      }
    });

  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, content, title } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const noteTitle = title || `Note for ${course.title} - ${new Date().toLocaleDateString()}`;

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

export const getNoteById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const note = await MusicNote.findById(id).populate('course');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

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
