import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Search, Users, Eye, Trash2, EyeOff, Settings, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';

const CoursesPage = ({
  courses, courseSearch, setCourseSearch,
  courseStatusFilter, setCourseStatusFilter,
  openCourseForm, editCourse, deleteCourse, viewCourseDetail,
}) => {
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [localCourses, setLocalCourses] = useState([]);
  const [stats, setStats]               = useState({ total:0, published:0, draft:0, totalStudents:0 });

  const cfg = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' } };
  };

  const getStatusBadge = (status) => {
    const map = {
      published: 'bg-green-100 text-green-700 border-green-200',
      draft:     'bg-yellow-100 text-yellow-700 border-yellow-200',
      archived:  'bg-gray-100 text-gray-600 border-gray-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${map[status] || map.draft}`}>
        {status || 'draft'}
      </span>
    );
  };

  const calcStats = (course) => ({
    totalModules: course.modules?.length || 0,
    totalLessons: course.modules?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0,
  });

  const fetchCoursesData = async () => {
    try {
      setLoading(true); setError(null);
      const res = await axios.get('/api/admin/courses', cfg());
      const data = res.data.courses || [];
      setLocalCourses(data);
      setStats({
        total:         data.length,
        published:     data.filter(c => c.publish?.status === 'published').length,
        draft:         data.filter(c => c.publish?.status === 'draft').length,
        totalStudents: data.reduce((s, c) => s + (c.stats?.enrolledStudents || 0), 0),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      setLocalCourses([]);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      setLoading(true);
      await axios.delete(`/api/admin/courses/${id}`, cfg());
      await fetchCoursesData();
      deleteCourse?.(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCoursesData(); }, []);

  const display  = courses?.length > 0 ? courses : localCourses;
  const filtered = display.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
                        c.category?.toLowerCase().includes(courseSearch.toLowerCase());
    const matchStatus = courseStatusFilter === 'all' || c.publish?.status === courseStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} course{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCoursesData} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCourseForm} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
            <Plus size={15} /> New Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Total',    value: stats.total,         icon: BookOpen, color:'text-blue-600',   bg:'bg-blue-50' },
          { label:'Published',value: stats.published,     icon: Eye,      color:'text-green-600',  bg:'bg-green-50' },
          { label:'Drafts',   value: stats.draft,         icon: EyeOff,   color:'text-yellow-600', bg:'bg-yellow-50' },
          { label:'Students', value: stats.totalStudents, icon: Users,    color:'text-purple-600', bg:'bg-purple-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={14} className={s.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search courses..." value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <select value={courseStatusFilter} onChange={e => setCourseStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10 gap-3 text-gray-500 text-sm">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          Loading courses...
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="block md:hidden divide-y divide-gray-100">
          {!loading && filtered.map(course => {
            const { totalModules, totalLessons } = calcStats(course);
            return (
              <div key={course._id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {course.thumbnailUrl
                      ? <img src={course.thumbnailUrl} alt={course.title} className="w-11 h-11 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                      : <BookOpen size={18} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => viewCourseDetail(course)}
                      className="font-semibold text-gray-900 text-sm truncate text-left hover:text-amber-600 transition-colors"
                      title="Open course modules"
                    >
                      {course.title}
                    </button>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500">{course.category}</span>
                      {getStatusBadge(course.publish?.status)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{totalModules}M x {totalLessons}L x {course.stats?.enrolledStudents || 0} students</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => viewCourseDetail(course)} className="flex-1 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 py-1.5 rounded-lg transition-colors">Manage</button>
                  <button onClick={() => editCourse(course)} className="flex-1 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 py-1.5 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => handleDelete(course._id)} className="flex-1 text-xs font-semibold text-white bg-red-400 hover:bg-red-500 py-1.5 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Content</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Students</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && filtered.map(course => {
                const { totalModules, totalLessons } = calcStats(course);
                return (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {course.thumbnailUrl
                            ? <img src={course.thumbnailUrl} alt={course.title} className="w-10 h-10 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                            : <BookOpen size={16} className="text-amber-600" />}
                        </div>
                        <div>
                          <button
                            onClick={() => viewCourseDetail(course)}
                            className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors text-left"
                            title="Open course modules"
                          >
                            {course.title}
                          </button>
                          <div className="text-xs text-gray-400">{course.category} - {course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(course.publish?.status)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{totalModules}M - {totalLessons}L</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{course.stats?.enrolledStudents || 0}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => viewCourseDetail(course)} title="Manage" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Settings size={15} /></button>
                        <button onClick={() => editCourse(course)} title="Edit" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"><Edit3 size={15} /></button>
                        <button onClick={() => handleDelete(course._id)} title="Delete" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-14">
            <BookOpen size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No courses found</p>
            <p className="text-gray-400 text-sm mt-1">
              {courseSearch || courseStatusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first course'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
