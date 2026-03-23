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
  AlertCircle
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
  // fetchCourses // Optional: if you want to use parent's fetch function
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localCourses, setLocalCourses] = useState([]);

  // Get axios config with auth headers
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
      published: { color: 'bg-green-100 text-green-800', icon: <Eye size={14} /> },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: <EyeOff size={14} /> },
      archived: { color: 'bg-gray-100 text-gray-800', icon: <BookOpen size={14} /> }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const calculateCourseStats = (course) => {
    const totalModules = course.modules?.length || 0;
    const totalLessons = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
    return { totalModules, totalLessons };
  };

  // NEW: API function to fetch courses using Axios
  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/admin/courses', getAxiosConfig());
      setLocalCourses(response.data.courses || []);
      return response.data.courses || [];
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
      setLocalCourses([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // NEW: API function to delete course using Axios
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        await axios.delete(`/api/admin/courses/${courseId}`, getAxiosConfig());
        
        // Refresh the courses list
        await fetchCoursesData();
        
        // Also call parent's delete function if provided
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

  // NEW: Load courses on component mount
  useEffect(() => {
    fetchCoursesData();
  }, []);

  // Use local courses if parent doesn't provide courses, otherwise use parent's courses
  const displayCourses = courses && courses.length > 0 ? courses : localCourses;

  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
                         course.category?.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesStatus = courseStatusFilter === 'all' || course.publish?.status === courseStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Create and manage your music courses</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchCoursesData}
            disabled={loading}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center disabled:opacity-50"
            title="Refresh courses"
          >
            <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin text-red-600' : 'text-red-600'}`} />
            Refresh
          </button>
          <button 
            onClick={openCourseForm}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-red-800 transition-colors flex items-center disabled:opacity-50"
          >
            <Plus size={20} className="mr-2" />
            New Course
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by title or category..."
              className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={courseStatusFilter}
              onChange={(e) => setCourseStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <button 
              className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              onClick={fetchCoursesData}
            >
              <Filter size={20} className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && filteredCourses.map((course) => {
                const { totalModules, totalLessons } = calculateCourseStats(course);
                
                return (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                          {course.thumbnailUrl ? (
                            <img 
                              src={course.thumbnailUrl} 
                              alt={course.title} 
                              className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <BookOpen size={20} className="text-red-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-red-500">{course.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.publish?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {totalModules} modules • {totalLessons} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users size={16} className="mr-1" />
                        {course.stats?.enrolledStudents || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewCourseDetail(course)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Manage Content"
                          disabled={loading}
                        >
                          <Settings size={16} />
                        </button>
                        <button 
                          onClick={() => editCourse(course)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Edit Course"
                          disabled={loading}
                        >
                          <Edit3 size={16} />
                        </button>

                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete Course"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-2">
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
                className="mt-4 text-red-600 hover:text-red-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;