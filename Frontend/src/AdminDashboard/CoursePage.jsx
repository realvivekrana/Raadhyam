import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Edit3, 
  Eye, 
  Trash2,
  EyeOff,
  Settings,
  RefreshCw,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  Star,
  Zap
} from 'lucide-react';

const CoursesPage = ({ 
  courses, 
  courseSearch, 
  setCourseSearch, 
  courseStatusFilter, 
  setCourseStatusFilter,
  openCourseForm,
  editCourse,
  deleteCourse,
  viewCourseDetail,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localCourses, setLocalCourses] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalStudents: 0
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getAxiosConfig = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { 
        color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white', 
        icon: <Eye size={14} />,
        glow: 'shadow-lg shadow-green-500/50'
      },
      draft: { 
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white', 
        icon: <EyeOff size={14} />,
        glow: 'shadow-lg shadow-yellow-500/50'
      },
      archived: { 
        color: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white', 
        icon: <BookOpen size={14} />,
        glow: 'shadow-lg shadow-gray-500/50'
      }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.color} ${config.glow} hover:scale-110 transition-transform duration-300`}>
        {config.icon}
        <span className="ml-1.5 capitalize">{status}</span>
      </span>
    );
  };

  const calculateCourseStats = (course) => {
    const totalModules = course.modules?.length || 0;
    const totalLessons = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
    return { totalModules, totalLessons };
  };

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/admin/courses', getAxiosConfig());
      const coursesData = response.data.courses || [];
      setLocalCourses(coursesData);
      
      // Calculate stats
      const newStats = {
        total: coursesData.length,
        published: coursesData.filter(c => c.publish?.status === 'published').length,
        draft: coursesData.filter(c => c.publish?.status === 'draft').length,
        totalStudents: coursesData.reduce((sum, c) => sum + (c.stats?.enrolledStudents || 0), 0)
      };
      setStats(newStats);
      
      return coursesData;
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
      setLocalCourses([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        await axios.delete(`/api/admin/courses/${courseId}`, getAxiosConfig());
        
        await fetchCoursesData();
        
        if (deleteCourse) {
          deleteCourse(courseId);
        }
        
        alert('Course deleted successfully!');
      } catch (err) {
        console.error('Error deleting course:', err);
        alert(err.response?.data?.message || err.message || 'Failed to delete course');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const displayCourses = courses && courses.length > 0 ? courses : localCourses;

  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
                         course.category?.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesStatus = courseStatusFilter === 'all' || course.publish?.status === courseStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Animated Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
            <BookOpen className="mr-3 text-amber-600 animate-pulse" size={32} />
            Course Management
          </h2>
          <p className="text-gray-600 mt-1 flex items-center">
            <Sparkles size={16} className="mr-2 text-amber-500" />
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} total
            {filteredCourses.length !== displayCourses.length && `, ${displayCourses.length} filtered`}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchCoursesData}
            disabled={loading}
            className="px-5 py-2.5 border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 flex items-center disabled:opacity-50 font-semibold hover:scale-105 hover:shadow-lg"
            title="Refresh courses"
          >
            <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={openCourseForm}
            disabled={loading}
            className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center disabled:opacity-50 font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="mr-2 relative z-10" />
            <span className="relative z-10">New Course</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards - Responsive Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '50ms' }}>
        {/* Total Courses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 md:p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <BookOpen size={20} className="md:w-6 md:h-6 text-blue-600" />
              </div>
              <Zap size={16} className="md:w-5 md:h-5 text-blue-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 counter-animation">{stats.total}</div>
            <div className="text-xs md:text-sm font-semibold text-gray-600">Total Courses</div>
          </div>
        </div>

        {/* Published Courses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 md:p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Eye size={20} className="md:w-6 md:h-6 text-green-600" />
              </div>
              <Star size={16} className="md:w-5 md:h-5 text-green-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 counter-animation">{stats.published}</div>
            <div className="text-xs md:text-sm font-semibold text-gray-600">Published</div>
          </div>
        </div>

        {/* Draft Courses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-2 md:p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <EyeOff size={20} className="md:w-6 md:h-6 text-yellow-600" />
              </div>
              <Clock size={16} className="md:w-5 md:h-5 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 counter-animation">{stats.draft}</div>
            <div className="text-xs md:text-sm font-semibold text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 md:p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Users size={20} className="md:w-6 md:h-6 text-purple-600" />
              </div>
              <TrendingUp size={16} className="md:w-5 md:h-5 text-purple-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 counter-animation">{stats.totalStudents}</div>
            <div className="text-xs md:text-sm font-semibold text-gray-600">Total Students</div>
          </div>
        </div>
      </div>

      {/* Error Alert with animation */}
      {error && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4 animate-shake shadow-lg">
          <div className="flex items-center">
            <AlertCircle size={24} className="text-amber-500 mr-3 animate-pulse" />
            <span className="text-amber-700 font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Enhanced Search and Filter - Responsive */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300 text-sm md:text-base"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 sm:space-x-3">
            <select
              className="flex-1 sm:flex-none border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 font-semibold hover:border-amber-300 transition-all duration-300 cursor-pointer text-sm md:text-base"
              value={courseStatusFilter}
              onChange={(e) => setCourseStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <button 
              className="border-2 border-gray-300 text-gray-700 px-3 md:px-4 py-2.5 md:py-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-300 transition-all duration-300 flex items-center font-semibold hover:scale-105 text-sm md:text-base"
              onClick={fetchCoursesData}
            >
              <Filter size={18} className="md:mr-2" />
              <span className="hidden md:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12 animate-fadeIn">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-t-4 border-amber-500 rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600 animate-pulse" />
            </div>
          </div>
          <span className="ml-4 text-gray-600 font-semibold text-lg">Loading courses...</span>
        </div>
      )}

      {/* Enhanced Courses Table - Responsive */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-gray-50 to-amber-50/30">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BookOpen size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-amber-600" />
                    <span className="hidden sm:inline">Course Details</span>
                    <span className="sm:hidden">Course</span>
                  </div>
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Eye size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-green-600" />
                    Status
                  </div>
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BarChart3 size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-blue-600" />
                    Content
                  </div>
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-purple-600" />
                    <span className="hidden lg:inline">Students & Price</span>
                    <span className="lg:hidden">Info</span>
                  </div>
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-orange-600" />
                    Created
                  </div>
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Settings size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-gray-600" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && filteredCourses.map((course, index) => {
                const { totalModules, totalLessons } = calculateCourseStats(course);
                const isHovered = hoveredRow === course._id;
                
                return (
                  <tr 
                    key={course._id} 
                    className={`hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent transition-all duration-300 cursor-pointer ${
                      isHovered ? 'shadow-lg scale-[1.01]' : ''
                    }`}
                    onMouseEnter={() => setHoveredRow(course._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                      animation: `fadeInUp 0.5s ease ${index * 50}ms both`
                    }}
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 md:h-14 md:w-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden ${
                          isHovered ? 'scale-110 rotate-6 shadow-xl shadow-amber-400/50' : ''
                        }`}>
                          {course.thumbnailUrl ? (
                            <img 
                              src={course.thumbnailUrl} 
                              alt={course.title} 
                              className="h-10 w-10 md:h-14 md:w-14 rounded-xl object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <BookOpen size={20} className="md:w-7 md:h-7 text-white" />
                          )}
                          {/* Shine effect on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
                            isHovered ? 'translate-x-full' : '-translate-x-full'
                          }`}></div>
                        </div>
                        <div className="ml-3 md:ml-4">
                          <div className={`text-xs md:text-sm font-bold text-gray-900 transition-colors duration-300 mb-1 line-clamp-1 ${
                            isHovered ? 'text-amber-600' : ''
                          }`}>{course.title}</div>
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <span className="text-xs text-amber-500 font-semibold flex items-center bg-amber-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                              <Award size={10} className="md:w-3 md:h-3 mr-0.5 md:mr-1" />
                              <span className="hidden sm:inline">{course.category}</span>
                              <span className="sm:hidden">{course.category.substring(0, 3)}</span>
                            </span>
                            {course.level && (
                              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg hidden sm:inline">
                                {course.level}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      {getStatusBadge(course.publish?.status)}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="space-y-1 md:space-y-2">
                        <div className="text-xs md:text-sm font-semibold text-gray-900 flex items-center">
                          <BarChart3 size={14} className="md:w-4 md:h-4 mr-1 md:mr-2 text-blue-500" />
                          <span className="hidden sm:inline">{totalModules} modules • {totalLessons} lessons</span>
                          <span className="sm:hidden">{totalModules}M • {totalLessons}L</span>
                        </div>
                        {course.duration && (
                          <div className="text-xs text-purple-600 font-semibold flex items-center bg-purple-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg w-fit">
                            <Clock size={10} className="md:w-3 md:h-3 mr-0.5 md:mr-1" />
                            {course.duration}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center text-xs md:text-sm font-bold text-gray-900 bg-blue-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full w-fit">
                          <Users size={14} className="md:w-4 md:h-4 mr-1 md:mr-1.5 text-blue-600" />
                          {course.stats?.enrolledStudents || 0}
                        </div>
                        {(course.price || course.isFree) && (
                          <div className={`text-xs font-bold flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg w-fit ${
                            course.isFree 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            <DollarSign size={10} className="md:w-3 md:h-3 mr-0.5 md:mr-1" />
                            {course.isFree ? 'FREE' : `₹${course.price}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <div className="flex items-center font-semibold">
                        <Calendar size={12} className="md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 text-amber-500" />
                        <span className="hidden md:inline">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</span>
                        <span className="md:hidden">{course.createdAt ? new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button 
                          onClick={() => viewCourseDetail(course)}
                          className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-blue-500/50"
                          title="Manage Content"
                          disabled={loading}
                        >
                          <Settings size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={() => editCourse(course)}
                          className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-green-500/50"
                          title="Edit Course"
                          disabled={loading}
                        >
                          <Edit3 size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-amber-400/50"
                          title="Delete Course"
                          disabled={loading}
                        >
                          <Trash2 size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
              <BookOpen size={64} className="relative mx-auto text-amber-500 mb-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mt-2 text-lg">
              {courseSearch || courseStatusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first course.'
              }
            </p>
            {(courseSearch || courseStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setCourseSearch('');
                  setCourseStatusFilter('all');
                }}
                className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes counterUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-out; }
        .counter-animation { animation: counterUp 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default CoursesPage;
