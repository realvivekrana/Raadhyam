import { Course, Enrollment, Progress } from "../models/CourseSchema.js";
import MusicNote from "../models/NotesSchema.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const getAllMusicNotes = async (req, res) => {
  try {
    const notes = await MusicNote.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });

  } catch (error) {
    console.error("Get MusicNotes Error:", error);
    res.status(500).json({ message: "Failed to fetch music notes" });
  }
};

export const createMusicNote = async (req, res) => {
  try {
    const {
      title,
      category,
      thumbnail,
      explanation,
      sections
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: "At least one section is required" });
    }

    const musicNote = await MusicNote.create({
      title,
      category,
      thumbnail,
      sections,
      explanation
    });

    res.status(201).json({
      success: true,
      message: "Music note created successfully",
      data: musicNote
    });

  } catch (error) {
    console.error("Create MusicNote Error:", error);
    res.status(500).json({ message: "Failed to create music note" });
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

    res.status(200).json({
      success: true,
      url: req.file.path,
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

    const fileUrl = req.file.path || `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl
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
//...

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
    }

    const totalLessons = updateData.modules.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0
    );

    const totalDurationSeconds = updateData.modules.reduce((total, module) => {
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
    const courses = await Course.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
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