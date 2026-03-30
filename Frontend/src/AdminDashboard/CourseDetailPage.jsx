import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  Eye, 
  Edit3,
  PlayCircle,
  FileText,
  BarChart3,
  CheckCircle,
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import ModuleList from './ModuleList';

const CourseDetailPage = ({ 
  course, 
  onBack, 
  onSaveContent, 
  onOpenModuleForm, 
  onOpenLessonForm 
}) => {
  const [courseData, setCourseData] = useState(course);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate course statistics
  const calculateStats = () => {
    const totalModules = courseData.modules?.length || 0;
    const totalLessons = courseData.modules?.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0) || 0;
    
    let totalDuration = 0;
    courseData.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number);
          totalDuration += (minutes * 60) + (seconds || 0);
        }
      });
    });
    
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    return {
      totalModules,
      totalLessons,
      totalDuration: `${hours}h ${minutes}m`,
      totalDurationSeconds: totalDuration
    };
  };

  const stats = calculateStats();

  // Module and Lesson handlers
  const handleAddModule = () => {
    onOpenModuleForm();
  };

  const handleEditModule = (module, index) => {
    onOpenModuleForm({ ...module, index });
  };

  const handleDeleteModule = async (index) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
      const updatedModules = courseData.modules.filter((_, i) => i !== index);
      await onSaveContent(updatedModules);
      setCourseData(prev => ({ ...prev, modules: updatedModules }));
    }
  };

  const handleAddLesson = (moduleIndex) => {
    onOpenLessonForm({ moduleIndex });
  };

  const handleEditLesson = (lesson, moduleIndex, lessonIndex) => {
    onOpenLessonForm({ ...lesson, moduleIndex, lessonIndex });
  };

  const handleDeleteLesson = async (moduleIndex, lessonIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedModules = [...courseData.modules];
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      await onSaveContent(updatedModules);
      setCourseData(prev => ({ ...prev, modules: updatedModules }));
    }
  };

  const handleSaveModules = async (updatedModules) => {
    await onSaveContent(updatedModules);
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Animation */}
      <div className={`flex items-center justify-between transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
              <BookOpen className="mr-3 text-amber-600 animate-pulse" size={32} />
              {courseData.title}
            </h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <Sparkles size={16} className="mr-2 text-amber-500" />
              {courseData.subtitle}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center font-semibold hover:scale-105 hover:shadow-lg">
            <Eye size={18} className="mr-2" />
            Preview
          </button>
          <button className="relative px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Edit3 size={18} className="mr-2 relative z-10" />
            <span className="relative z-10">Edit Course</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Course Overview */}
        <div className={`lg:col-span-1 space-y-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`} style={{ transitionDelay: '100ms' }}>
          {/* Enhanced Course Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4 relative">
              <div className="h-16 w-16 bg-gradient-to-br from-amber-100 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                {courseData.thumbnailUrl ? (
                  <img 
                    src={courseData.thumbnailUrl} 
                    alt={courseData.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <BookOpen size={24} className="text-amber-600" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{courseData.title}</h3>
                <p className="text-sm text-amber-600 font-semibold">{courseData.category}</p>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="space-y-3 relative">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300">
                <span className="text-sm text-gray-600 font-semibold">Status</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  courseData.publish?.status === 'published' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/50'
                    : courseData.publish?.status === 'draft'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-500/50'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/50'
                } hover:scale-110 transition-transform duration-300`}>
                  {courseData.publish?.status || 'draft'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300">
                <span className="text-sm text-gray-600 font-semibold">Modules</span>
                <span className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">{stats.totalModules}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300">
                <span className="text-sm text-gray-600 font-semibold">Lessons</span>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{stats.totalLessons}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300">
                <span className="text-sm text-gray-600 font-semibold flex items-center">
                  <Clock size={14} className="mr-1.5 text-amber-500" />
                  Duration
                </span>
                <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{stats.totalDuration}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-50 transition-colors duration-300">
                <span className="text-sm text-gray-600 font-semibold">Students</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center">
                  <Users size={14} className="mr-1" />
                  {courseData.stats?.enrolledStudents || 0}
                </span>
              </div>
            </div>

            {/* Enhanced Pricing */}
            <div className="mt-4 pt-4 border-t border-gray-200 relative">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-rose-100 transition-all duration-300">
                <span className="text-sm text-gray-700 font-bold">Price</span>
                <span className="text-xl font-black bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                  {courseData.isFree ? 'FREE' : `₹${courseData.price}`}
                </span>
              </div>
              {courseData.offerPrice && !courseData.isFree && (
                <div className="flex justify-between items-center text-sm mt-2 p-2 rounded-lg bg-green-50">
                  <span className="text-gray-700 font-semibold">Offer Price</span>
                  <span className="text-green-600 font-bold flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    ₹{courseData.offerPrice}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Instructor Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            <h4 className="font-bold text-gray-900 mb-4 flex items-center relative">
              <Users size={18} className="mr-2 text-amber-600" />
              Instructor
            </h4>
            <div className="flex items-center space-x-3 relative">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                {courseData.instructor?.profileImage ? (
                  <img 
                    src={courseData.instructor.profileImage} 
                    alt={courseData.instructor.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <Users size={18} className="text-amber-600" />
                )}
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{courseData.instructor?.name}</p>
                <p className="text-xs text-amber-600 font-semibold">Course Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Course Builder */}
        <div className={`lg:col-span-3 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`} style={{ transitionDelay: '200ms' }}>
          <ModuleList
            modules={courseData.modules || []}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
            onSaveModules={handleSaveModules}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;