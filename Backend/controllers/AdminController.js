import { Course, Enrollment, Progress } from "../models/CourseSchema.js";
import MusicNote from "../models/NotesSchema.js";
import User from "../models/users.js";
import slugify from "slugify";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cloudinary from "../config/Cloudinary.js";
import fs from "fs";

export const getAllMusicNotes = async (req, res) => {
  try {
    const notes = await MusicNote.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Music notes retrieved successfully',
      count: notes.length,
      data: notes
    });

  } catch (error) {
    console.error("Get MusicNotes Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch music notes",
      code: "INTERNAL_ERROR"
    });
  }
};

export const createMusicNote = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized",
        code: "UNAUTHORIZED"
      });
    }

    const {
      title,
      category,
      thumbnail,
      explanation,
      sections,
      course
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ 
        success: false,
        message: "Title and category are required",
        code: "VALIDATION_ERROR"
      });
    }

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "At least one section is required",
        code: "VALIDATION_ERROR"
      });
    }

    const musicNote = await MusicNote.create({
      title,
      category,
      thumbnail,
      sections,
      explanation,
      course,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      message: "Music note created successfully",
      data: musicNote
    });

  } catch (error) {
    console.error("Create MusicNote Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create music note",
      code: "INTERNAL_ERROR"
    });
  }
};

export const updateMusicNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const updatedNote = await MusicNote.findByIdAndUpdate(
      noteId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Music note not found" });
    }

    res.status(200).json({
      success: true,
      message: "Music note updated successfully",
      data: updatedNote
    });

  } catch (error) {
    console.error("Update MusicNote Error:", error);
    res.status(500).json({ message: "Failed to update music note" });
  }
};

export const getMusicNoteById = async (req, res) => {
  try {
    const note = await MusicNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Music note not found" });
    }

    res.status(200).json({
      success: true,
      data: note
    });

  } catch (error) {
    console.error("Get Single MusicNote Error:", error);
    res.status(500).json({ message: "Failed to fetch music note" });
  }
};

export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.filepath, {
      folder: "uploads/images",
      resource_type: "image",
      public_id: `${Date.now()}-${req.file.originalFilename || req.file.name}`.replace(/\s+/g, "-"),
    });

    try {
      fs.unlinkSync(req.file.filepath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError.message);
    }

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Thumbnail upload failed" });
  }
};

export const deleteMusicNote = async (req, res) => {
  try {
    const deletedNote = await MusicNote.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Music note not found" });
    }

    res.status(200).json({
      success: true,
      message: "Music note deleted successfully"
    });

  } catch (error) {
    console.error("Delete MusicNote Error:", error);
    res.status(500).json({ message: "Failed to delete music note" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let resource_type = "auto";
    if (req.file.mimetype.startsWith("image/")) resource_type = "image";
    else if (req.file.mimetype.startsWith("video/")) resource_type = "video";
    else if (req.file.mimetype.startsWith("audio/")) resource_type = "video";

    const result = await cloudinary.uploader.upload(req.file.filepath, {
      folder: "uploads/files",
      resource_type: resource_type,
      public_id: `${Date.now()}-${req.file.originalFilename || req.file.name}`.replace(/\s+/g, "-"),
    });

    try {
      fs.unlinkSync(req.file.filepath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError.message);
    }

    res.json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const generateCourseSlug = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let baseSlug = slugify(title, { 
      lower: true, 
      strict: true,
      trim: true
    });

    let slug = baseSlug;
    let counter = 1;
    
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    res.json({ slug });
  } catch (error) {
    console.error("Generate Slug Error:", error);
    res.status(500).json({ message: "Failed to generate slug" });
  }
};

export const validateCourse = async (req, res) => {
  try {
    const { title, category, modules } = req.body;

    const errors = [];

    if (!title?.trim()) {
      errors.push("Course title is required");
    }

    if (!category?.trim()) {
      errors.push("Course category is required");
    }

    if (!modules || !Array.isArray(modules) || modules.length === 0) {
      errors.push("At least one module is required");
    } else {
      modules.forEach((module, index) => {
        if (!module.title?.trim()) {
          errors.push(`Module ${index + 1}: Title is required`);
        }
        
        if (module.lessons && Array.isArray(module.lessons)) {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title?.trim()) {
              errors.push(`Module ${index + 1}, Lesson ${lessonIndex + 1}: Title is required`);
            }
            
            if (lesson.type === 'video' && !lesson.videoUrl) {
              errors.push(`Module ${index + 1}, Lesson ${lessonIndex + 1}: Video URL is required for video lessons`);
            }
            
            if (lesson.type === 'pdf' && !lesson.pdfUrl) {
              errors.push(`Module ${index + 1}, Lesson ${lessonIndex + 1}: PDF URL is required for PDF lessons`);
            }
            
            if (lesson.type === 'text' && !lesson.content?.trim()) {
              errors.push(`Module ${index + 1}, Lesson ${lessonIndex + 1}: Content is required for text lessons`);
            }
          });
        }
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        valid: false,
        errors: errors
      });
    }

    res.json({ 
      valid: true,
      message: "Course data is valid" 
    });

  } catch (error) {
    console.error("Validate Course Error:", error);
    res.status(500).json({ 
      valid: false,
      message: "Validation failed" 
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log('📥 Received course data:', {
      title: req.body.title,
      modules: req.body.modules?.length,
      lessons: req.body.modules?.reduce((total, mod) => total + (mod.lessons?.length || 0), 0)
    });

    const courseData = {
      ...req.body,
      createdBy: userId,
      price: Number(req.body.price) || 0,
      offerPrice: req.body.offerPrice ? Number(req.body.offerPrice) : undefined,
      tags: (req.body.tags || []).filter(tag => tag && tag.trim() !== ''),
      prerequisites: (req.body.prerequisites || []).filter(item => item && item.trim() !== ''),
      whatYouWillLearn: (req.body.whatYouWillLearn || []).filter(item => item && item.trim() !== ''),
      requirements: (req.body.requirements || []).filter(item => item && item.trim() !== ''),
      status: req.body.publish?.status || 'draft',
      visibility: req.body.visibility || 'public'
    };

    if (req.body.modules && Array.isArray(req.body.modules)) {
      courseData.modules = req.body.modules.map((module, moduleIndex) => {
        const processedModule = {
          title: module.title || `Module ${moduleIndex + 1}`,
          description: module.description || '',
          position: moduleIndex,
          createdAt: module.createdAt || new Date(),
          updatedAt: new Date()
        };

        if (module.lessons && Array.isArray(module.lessons)) {
          processedModule.lessons = module.lessons.map((lesson, lessonIndex) => {
            const processedLesson = {
              title: lesson.title || `Lesson ${lessonIndex + 1}`,
              description: lesson.description || '',
              type: lesson.type || 'video',
              duration: lesson.duration || '00:00',
              position: lessonIndex,
              isFreePreview: Boolean(lesson.isFreePreview),
              createdAt: lesson.createdAt || new Date(),
              updatedAt: new Date()
            };

            if (lesson.type === 'video') {
              processedLesson.videoUrl = lesson.videoUrl || '';
              processedLesson.thumbnailUrl = lesson.thumbnailUrl || '';
            } else if (lesson.type === 'pdf') {
              processedLesson.pdfUrl = lesson.pdfUrl || '';
            } else if (lesson.type === 'text') {
              processedLesson.content = lesson.content || '';
            }

            return processedLesson;
          });
        } else {
          processedModule.lessons = [];
        }

        return processedModule;
      });
    } else {
      courseData.modules = [];
    }

    if (!courseData.slug) {
      courseData.slug = slugify(courseData.title, { 
        lower: true, 
        strict: true,
        trim: true 
      });
    }

    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      return res.status(400).json({
        message: "A course with this title already exists"
      });
    }

    const totalLessons = courseData.modules.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0
    );

    const totalDurationSeconds = courseData.modules.reduce((total, module) => {
      return total + (module.lessons?.reduce((lessonTotal, lesson) => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number);
          return lessonTotal + (minutes * 60) + (seconds || 0);
        }
        return lessonTotal;
      }, 0) || 0);
    }, 0);

    courseData.stats = {
      totalLessons,
      totalDurationSeconds,
      enrolledStudents: 0,
      rating: 0,
      totalReviews: 0
    };

    console.log('💾 Creating course with processed data:', {
      title: courseData.title,
      modules: courseData.modules.length,
      lessons: totalLessons,
      totalDuration: totalDurationSeconds
    });

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });

  } catch (error) {
    console.error("❌ COURSE CREATE ERROR:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Course with this title already exists"
      });
    }
    
    res.status(500).json({
      message: "Course creation failed",
      error: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log('📥 Updating course:', id, {
      title: req.body.title,
      modules: req.body.modules?.length
    });

    const updateData = {
      ...req.body,
      price: Number(req.body.price) || 0,
      offerPrice: req.body.offerPrice ? Number(req.body.offerPrice) : undefined,
      tags: (req.body.tags || []).filter(tag => tag && tag.trim() !== ''),
      prerequisites: (req.body.prerequisites || []).filter(item => item && item.trim() !== ''),
      whatYouWillLearn: (req.body.whatYouWillLearn || []).filter(item => item && item.trim() !== ''),
      requirements: (req.body.requirements || []).filter(item => item && item.trim() !== ''),
      status: req.body.publish?.status || existingCourse.status,
      visibility: req.body.visibility || existingCourse.visibility,
      updatedAt: new Date()
    };

    if (req.body.modules && Array.isArray(req.body.modules)) {
      updateData.modules = req.body.modules.map((module, moduleIndex) => {
        const processedModule = {
          _id: module._id || new mongoose.Types.ObjectId(),
          title: module.title || `Module ${moduleIndex + 1}`,
          description: module.description || '',
          position: moduleIndex,
          updatedAt: new Date()
        };

        if (module._id) {
          const existingModule = existingCourse.modules.id(module._id);
          if (existingModule) {
            processedModule.createdAt = existingModule.createdAt;
          } else {
            processedModule.createdAt = new Date();
          }
        } else {
          processedModule.createdAt = new Date();
        }

        if (module.lessons && Array.isArray(module.lessons)) {
          processedModule.lessons = module.lessons.map((lesson, lessonIndex) => {
            const processedLesson = {
              _id: lesson._id || new mongoose.Types.ObjectId(),
              title: lesson.title || `Lesson ${lessonIndex + 1}`,
              description: lesson.description || '',
              type: lesson.type || 'video',
              duration: lesson.duration || '00:00',
              position: lessonIndex,
              isFreePreview: Boolean(lesson.isFreePreview),
              updatedAt: new Date()
            };

            if (lesson._id) {
              const existingLesson = existingCourse.modules
                .id(module._id)
                ?.lessons.id(lesson._id);
              if (existingLesson) {
                processedLesson.createdAt = existingLesson.createdAt;
              } else {
                processedLesson.createdAt = new Date();
              }
            } else {
              processedLesson.createdAt = new Date();
            }

            if (lesson.type === 'video') {
              processedLesson.videoUrl = lesson.videoUrl || '';
              processedLesson.thumbnailUrl = lesson.thumbnailUrl || '';
              processedLesson.pdfUrl = undefined;
              processedLesson.content = undefined;
            } else if (lesson.type === 'pdf') {
              processedLesson.pdfUrl = lesson.pdfUrl || '';
              processedLesson.videoUrl = undefined;
              processedLesson.content = undefined;
            } else if (lesson.type === 'text') {
              processedLesson.content = lesson.content || '';
              processedLesson.videoUrl = undefined;
              processedLesson.pdfUrl = undefined;
            }

            return processedLesson;
          });
        } else {
          processedModule.lessons = [];
        }

        return processedModule;
      });
    } else {
        updateData.modules = existingCourse.modules || [];
    }

    const modules = updateData.modules || [];
    const totalLessons = modules.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0
    );

    const totalDurationSeconds = modules.reduce((total, module) => {
      return total + (module.lessons?.reduce((lessonTotal, lesson) => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number);
          return lessonTotal + (minutes * 60) + (seconds || 0);
        }
        return lessonTotal;
      }, 0) || 0);
    }, 0);

    updateData.stats = {
      ...existingCourse.stats,
      totalLessons,
      totalDurationSeconds
    };

    console.log('💾 Updating course with:', {
      modules: updateData.modules.length,
      lessons: totalLessons
    });

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: "Course updated successfully",
      course
    });

  } catch (error) {
    console.error("❌ COURSE UPDATE ERROR:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }
    
    res.status(500).json({
      message: "Course update failed",
      error: error.message
    });
  }
};

export const getAllCoursesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    
    // Filter by publish status - default to 'published' to hide draft/archived courses
    if (status) {
      query["publish.status"] = status;
    } else {
      // Default to published courses only (hide draft and archived)
      query["publish.status"] = 'published';
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Course.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: total,
      courses,
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }
};

export const getCourseByIdAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
    });
  }
};

export const deleteCourseAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCourses,
      totalNotes,
      totalUsers,
      totalEnrollments,
      publishedCourses
    ] = await Promise.all([
      Course.countDocuments(),
      MusicNote.countDocuments(),
      User.countDocuments({ status: { $ne: "Deleted" } }),
      Enrollment.countDocuments(),
      Course.countDocuments({ "publish.status": "published" })
    ]);

    const activeSubscriptions = await User.countDocuments({
      plan: { $in: ["Monthly Premium", "Annual Premium"] },
      status: "Active"
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueResult = await Enrollment.aggregate([
      {
        $match: {
          enrolledAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$purchasedPrice" }
        }
      }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    const recentEnrollments = await Enrollment.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .limit(5);

    const popularCourses = await Course.find({ "publish.status": "published" })
      .sort({ "stats.enrolledStudents": -1 })
      .limit(5)
      .select('title stats.enrolledStudents stats.rating');

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalNotes,
        totalUsers,
        totalEnrollments,
        activeSubscriptions,
        monthlyRevenue,
        publishedCourses
      },
      recentEnrollments,
      popularCourses
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status, plan } = req.query;
    const skip = (page - 1) * limit;

    const query = { status: { $ne: "Deleted" } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    // Get enrollment stats for each user
    const userIds = users.map(u => u._id);
    
    // Get all enrollments for these users with course module info
    const enrollments = await Enrollment.find({ user: { $in: userIds } })
      .populate("course", "modules")
      .lean();
    
    // Get all progress records for these enrollments
    const enrollmentIds = enrollments.map(e => e._id);
    const progressRecords = await Progress.find({ 
      enrollment: { $in: enrollmentIds },
      completed: true 
    }).lean();
    
    // Map progress records by enrollment
    const progressByEnrollment = new Map();
    progressRecords.forEach(p => {
      const current = progressByEnrollment.get(p.enrollment.toString()) || 0;
      progressByEnrollment.set(p.enrollment.toString(), current + 1);
    });
    
    // Calculate stats per user
    const userStatsMap = new Map();
    
    enrollments.forEach(enrollment => {
      const userId = enrollment.user.toString();
      const course = enrollment.course;
      
      // Get total lessons in this course
      let totalLessonsInCourse = 0;
      if (course && course.modules) {
        totalLessonsInCourse = course.modules.reduce(
          (sum, module) => sum + (module.lessons?.length || 0), 0
        );
      }
      
      const completedLessonsInCourse = progressByEnrollment.get(enrollment._id.toString()) || 0;
      
      const existing = userStatsMap.get(userId) || {
        enrolledCourses: 0,
        completedCourses: 0,
        completedLessons: 0,
        totalLessons: 0,
        totalProgress: 0
      };
      
      existing.enrolledCourses += 1;
      existing.completedLessons += completedLessonsInCourse;
      existing.totalLessons += totalLessonsInCourse;
      existing.totalProgress += enrollment.progress || 0;
      
      // Consider course completed if progress is 100%
      if (enrollment.progress === 100) {
        existing.completedCourses += 1;
      }
      
      userStatsMap.set(userId, existing);
    });
    
    // Add stats to users
    const usersWithStats = users.map(user => {
      const userId = user._id.toString();
      const stats = userStatsMap.get(userId) || {
        enrolledCourses: 0,
        completedCourses: 0,
        completedLessons: 0,
        totalLessons: 0,
        totalProgress: 0
      };
      
      // Calculate average progress
      let progress = 0;
      if (stats.enrolledCourses > 0) {
        progress = Math.round(stats.totalProgress / stats.enrolledCourses);
      }
      // Fallback: calculate from lessons
      if (progress === 0 && stats.totalLessons > 0) {
        progress = Math.round((stats.completedLessons / stats.totalLessons) * 100);
      }
      
      return {
        ...user.toObject(),
        enrolledCourses: stats.enrolledCourses,
        completedCourses: stats.completedCourses,
        completedLessons: stats.completedLessons,
        totalLessons: stats.totalLessons,
        progress
      };
    });

    res.status(200).json({
      success: true,
      count: total,
      users: usersWithStats
    });

  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, country, plan, status, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      country,
      plan: plan || "Free",
      status: status || "Active",
      role: role || "user"
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });

  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

export const getUserByIdAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, country, plan, status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;
    if (plan) updateData.plan = plan;
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndUpdate(req.params.id, { status: "Deleted" });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Active", "Inactive", "Suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Active, Inactive, or Suspended)'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated',
      user
    });

  } catch (error) {
    console.error('Update User Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};