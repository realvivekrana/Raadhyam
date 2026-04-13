import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Course, Enrollment, Progress } from '../models/CourseSchema.js';
import MusicNote from '../models/NotesSchema.js';

const toId = (value) => value?.toString?.() || String(value || '');

const getCourseLessonIdSet = (course) => {
  const ids = new Set();
  (course?.modules || []).forEach((module) => {
    (module?.lessons || []).forEach((lesson) => {
      if (lesson?._id) ids.add(toId(lesson._id));
    });
  });
  return ids;
};

const computeProgressForEnrollment = async ({ enrollmentId, course }) => {
  const lessonIds = getCourseLessonIdSet(course);
  const totalLessons = lessonIds.size;

  if (totalLessons === 0) {
    return {
      completedCount: 0,
      totalLessons: 0,
      progressPercentage: 0,
      completedLessonIds: []
    };
  }

  const completedProgress = await Progress.find({
    enrollment: enrollmentId,
    completed: true
  }).select('lesson').lean();

  const completedLessonIds = completedProgress
    .map((item) => toId(item.lesson))
    .filter((lessonId) => lessonIds.has(lessonId));

  const uniqueCompletedLessonIds = [...new Set(completedLessonIds)];
  const completedCount = uniqueCompletedLessonIds.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  return {
    completedCount,
    totalLessons,
    progressPercentage,
    completedLessonIds: uniqueCompletedLessonIds
  };
};

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

    const courses = enrollments
      .filter(enrollment => enrollment.course) // skip if course was deleted
      .map(enrollment => ({
        courseId: enrollment.course._id.toString(),
        _id: enrollment.course._id.toString(),
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
      purchaseCurrency: course.currency || 'INR',
      isActive: true
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

export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found for this course'
      });
    }

    const course = await Course.findById(courseId).select('modules.lessons._id').lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const progressData = await computeProgressForEnrollment({
      enrollmentId: enrollment._id,
      course
    });

    if (enrollment.progress !== progressData.progressPercentage) {
      enrollment.progress = progressData.progressPercentage;
      await enrollment.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Course progress retrieved successfully',
      data: {
        courseId,
        enrollmentId: enrollment._id,
        progress: progressData.progressPercentage,
        completedCount: progressData.completedCount,
        totalLessons: progressData.totalLessons,
        completedLessonIds: progressData.completedLessonIds,
        lastAccessedLesson: enrollment.lastAccessedLesson || null
      }
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course progress',
      error: error.message
    });
  }
};

export const updateLessonProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;
    const { lessonId, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson ID format'
      });
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found for this course'
      });
    }

    const course = await Course.findById(courseId).select('modules.lessons._id').lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const validLessonIds = getCourseLessonIdSet(course);
    if (!validLessonIds.has(toId(lessonId))) {
      return res.status(400).json({
        success: false,
        message: 'Lesson does not belong to this course'
      });
    }

    await Progress.findOneAndUpdate(
      {
        enrollment: enrollment._id,
        lesson: lessonId
      },
      {
        $set: {
          completed: Boolean(completed),
          completedAt: completed ? new Date() : null
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    enrollment.lastAccessedLesson = lessonId;

    const progressData = await computeProgressForEnrollment({
      enrollmentId: enrollment._id,
      course
    });

    enrollment.progress = progressData.progressPercentage;
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      data: {
        courseId,
        lessonId,
        completed: Boolean(completed),
        progress: progressData.progressPercentage,
        completedCount: progressData.completedCount,
        totalLessons: progressData.totalLessons,
        completedLessonIds: progressData.completedLessonIds,
        lastAccessedLesson: enrollment.lastAccessedLesson
      }
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lesson progress',
      error: error.message
    });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirm password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with one letter and one number'
      });
    }

    const user = req.user;
    if (!user?.password) {
      return res.status(400).json({
        success: false,
        message: 'Password change is not available for this account'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.constructor.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message
    });
  }
};
