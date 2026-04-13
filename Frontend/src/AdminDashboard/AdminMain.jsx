import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Layout
import DashboardLayout from './DashboardLayout';

// Pages
import DashboardPage from './DashboardPage';
import CoursesPage from './CoursePage';
import CourseDetailPage from './CourseDetailPage';
import NotesPage from './NotesPage';
import StudentsPage from './StudentPage';

// Modals
import CourseFormModal from './CourseModel';
import NoteFormModal from './NotesModel';
import ModuleFormModal from './ModuleFormModal';
import LessonFormModal from './LessonFormModal';

const MainDashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCourseView, setCurrentCourseView] = useState('list'); // 'list', 'detail'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Dashboard Data
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    totalNotes: 0,
    recentEnrollments: [],
    popularCourses: []
  });

  // Courses State
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Course Content State
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);

  // Music Notes State (REMOVED to fix errors)
  const [musicNotes, setMusicNotes] = useState([]);
  const [noteSearch, setNoteSearch] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState('all');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // ADDED THIS

  // Get axios config with auth headers
  const getAxiosConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  // File upload function
  const uploadFile = async (file, type = 'image') => {
    if (!file) return null;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file. Please try again.');
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchDashboardStats();
    fetchCourses();
    fetchMusicNotes();
  }, []);

  // Dashboard APIs
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard/stats', getAxiosConfig());
      const d = response.data;
      setDashboardStats({
        totalCourses:     d.stats?.totalCourses     || 0,
        publishedCourses: d.stats?.publishedCourses || 0,
        totalEnrollments: d.stats?.totalEnrollments || 0,
        totalNotes:       d.stats?.totalNotes       || 0,
        totalUsers:       d.stats?.totalUsers       || 0,
        monthlyRevenue:   d.stats?.monthlyRevenue   || 0,
        recentEnrollments: d.recentEnrollments      || [],
        popularCourses:    d.popularCourses         || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Course APIs
  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses', getAxiosConfig());
      setCourses(response.data.courses || []);
      return response.data.courses || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      return [];
    }
  };

  const createCourse = async (courseData) => {
    try {
      const response = await axios.post('/api/admin/courses', courseData, getAxiosConfig());
      await fetchCourses();
      await fetchDashboardStats();
      return response.data.course || response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error creating course';
      throw new Error(msg);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const response = await axios.put(`/api/admin/courses/${id}`, courseData, getAxiosConfig());
      await fetchCourses();
      await fetchDashboardStats();
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error updating course';
      throw new Error(msg);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        console.log('🗑️ Deleting course with ID:', id);
        await axios.delete(`/api/admin/courses/${id}`, getAxiosConfig());
        await fetchCourses();
        await fetchDashboardStats();
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  // FIXED: Course Content APIs - ADD THIS FUNCTION
  // const updateCourseModules = async (courseId, modules) => {
  //   try {
  //     const response = await axios.put(
  //       `/api/admin/courses/${courseId}/modules`,
  //       { modules },
  //       getAxiosConfig()
  //     );
  //     await fetchCourses();
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error updating course modules:', error);
  //     throw new Error('Error updating course content. Please try again.');
  //   }
  // };

  // Music Notes APIs - ADD THESE FUNCTIONS
  const fetchMusicNotes = async () => {
    try {
      const response = await axios.get('/api/admin/music-notes', getAxiosConfig());
      // Handle both { notes: [] } and { data: [] } response formats
      const notesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.notes || response.data.data || []);
      setMusicNotes(notesData);
    } catch (error) {
      console.error('Error fetching music notes:', error);
      setMusicNotes([]);
    }
  };

  const createMusicNote = async (noteData) => {
    try {
      const response = await axios.post('/api/admin/music-notes', noteData, getAxiosConfig());
      await fetchMusicNotes();
      await fetchDashboardStats();
      return response.data;
    } catch (error) {
      console.error('Error creating music note:', error);
      throw new Error('Error creating music note. Please try again.');
    }
  };

  const updateMusicNote = async (id, noteData) => {
    try {
      const response = await axios.put(`/api/admin/music-notes/${id}`, noteData, getAxiosConfig());
      await fetchMusicNotes();
      await fetchDashboardStats();
      return response.data;
    } catch (error) {
      console.error('Error updating music note:', error);
      throw new Error('Error updating music note. Please try again.');
    }
  };

  const deleteMusicNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this music note?')) {
      try {
        await axios.delete(`/api/admin/music-notes/${id}`, getAxiosConfig());
        await fetchMusicNotes();
        await fetchDashboardStats();
        alert('Music note deleted successfully!');
      } catch (error) {
        console.error('Error deleting music note:', error);
        alert('Error deleting music note. Please try again.');
      }
    }
  };

  // FIXED: Music Notes Handlers - ADD THESE
  const openNoteForm = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  const editMusicNote = (note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleTabChange = (tab) => {
    // Close all modals when switching tabs
    setShowCourseForm(false);
    setShowNoteForm(false);
    setShowModuleForm(false);
    setShowLessonForm(false);
    setEditingCourse(null);
    setEditingNote(null);
    // Reset course detail view when switching away from courses
    if (tab !== 'courses') {
      setCurrentCourseView('list');
      setSelectedCourse(null);
    }
    setActiveTab(tab);
  };

  // Course Navigation Handlers
  const openCourseForm = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const viewCourseDetail = async (course) => {
    if (!course?._id) return;

    try {
      const response = await axios.get(`/api/admin/courses/${course._id}`, getAxiosConfig());
      const fullCourse = response.data?.course || response.data?.data || course;
      setSelectedCourse(fullCourse);
    } catch (error) {
      console.error('Error fetching course detail:', error);
      // Fallback to list item payload so user can still navigate.
      setSelectedCourse(course);
    } finally {
      setCurrentCourseView('detail');
      setActiveTab('courses');
    }
  };

  const backToCoursesList = () => {
    setCurrentCourseView('list');
    setSelectedCourse(null);
  };

  // Module & Lesson Handlers
  const openModuleForm = (module = null, moduleIndex = null) => {
    setEditingModule(module);
    setCurrentModuleIndex(moduleIndex);
    setShowModuleForm(true);
  };

  const openLessonForm = (lesson = null, moduleIndex = null, lessonIndex = null, moduleId = null) => {
    console.log('📝 openLessonForm called with:', { lesson, moduleIndex, lessonIndex, moduleId });
    console.log('📦 Lesson object properties:', lesson ? Object.keys(lesson) : 'null');
    const editingLessonData = {
      ...(lesson || {}),
      moduleIndex,
      lessonIndex,
      moduleId
    };
    console.log('✅ Final editingLesson data:', editingLessonData);
    setEditingLesson(editingLessonData);
    setShowLessonForm(true);
  };

  const saveCourseContent = async (updatedModules) => {
    if (!selectedCourse?._id) {
      throw new Error('No course selected');
    }

    try {
      // Prefer dedicated modules endpoint if available.
      await axios.post(
        `/api/admin/courses/${selectedCourse._id}/modules`,
        { modules: updatedModules },
        getAxiosConfig()
      );
    } catch (postError) {
      // Fallback for older API shape.
      await axios.put(
        `/api/admin/courses/${selectedCourse._id}`,
        { modules: updatedModules },
        getAxiosConfig()
      );
    }

    const getRes = await axios.get(`/api/admin/courses/${selectedCourse._id}`, getAxiosConfig());
    const refreshed = getRes.data.course || getRes.data.data || { ...selectedCourse, modules: updatedModules };
    setSelectedCourse(refreshed);
    await fetchCourses();
    return refreshed;
  };

  const handleSaveModule = async (moduleData) => {
    if (!selectedCourse) return;

    try {
      const updatedModules = selectedCourse.modules ? [...selectedCourse.modules] : [];
      
      if (editingModule && currentModuleIndex !== null) {
        // Update existing module
        updatedModules[currentModuleIndex] = {
          ...updatedModules[currentModuleIndex],
          ...moduleData
        };
      } else {
        // Add new module
        const newModule = {
          ...moduleData,
          position: updatedModules.length,
          lessons: [],
          createdAt: new Date().toISOString()
        };
        updatedModules.push(newModule);
      }

      const updatedCourse = await saveCourseContent(updatedModules);
      setSelectedCourse(updatedCourse);
      setShowModuleForm(false);
      setEditingModule(null);
      setCurrentModuleIndex(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveLesson = async (lessonData) => {
    if (!selectedCourse) return;
    try {
      const updatedModules = (selectedCourse.modules || []).map((m) => ({
        ...m,
        lessons: m.lessons || []
      }));

      if (!editingLesson || editingLesson.moduleIndex === undefined || editingLesson.moduleIndex === null) {
        alert('Module context missing for lesson save');
        return;
      }

      const mi = editingLesson.moduleIndex;
      if (!updatedModules[mi]) {
        alert('Module not found');
        return;
      }

      if (editingLesson.lessonIndex !== undefined && editingLesson.lessonIndex !== null) {
        updatedModules[mi].lessons[editingLesson.lessonIndex] = {
          ...updatedModules[mi].lessons[editingLesson.lessonIndex],
          ...lessonData
        };
      } else {
        updatedModules[mi].lessons = [
          ...updatedModules[mi].lessons,
          { ...lessonData, position: updatedModules[mi].lessons.length, createdAt: new Date().toISOString() }
        ];
      }

      await saveCourseContent(updatedModules);
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteModule = async (moduleIndex) => {
    if (window.confirm('Delete this module and all its lessons?')) {
      try {
        const updatedModules = (selectedCourse.modules || []).filter((_, i) => i !== moduleIndex);
        await saveCourseContent(updatedModules);
      } catch (error) { alert(error.message); }
    }
  };

  const handleDeleteLesson = async (moduleIndex, lessonIndex) => {
    if (window.confirm('Delete this lesson?')) {
      try {
        const updatedModules = (selectedCourse.modules || []).map(m => ({ ...m, lessons: m.lessons || [] }));
        updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
        await saveCourseContent(updatedModules);
      } catch (error) { alert(error.message); }
    }
  };

  // Render content based on active tab and course view
  const renderContent = () => {
    if (activeTab === 'courses' && currentCourseView === 'detail' && selectedCourse) {
      return (
        <CourseDetailPage
          course={selectedCourse}
          onBack={backToCoursesList}
          onOpenModuleForm={openModuleForm}
          onOpenLessonForm={openLessonForm}
          onDeleteModule={handleDeleteModule}
          onDeleteLesson={handleDeleteLesson}
          onSaveContent={saveCourseContent}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            dashboardStats={dashboardStats}
            loading={loading}
            onOpenStudent={(userId) => {
              setActiveTab('students');
              // StudentPage will handle opening detail via selectedStudentId
              window._dashboardOpenStudent = userId;
            }}
            onOpenCourse={(courseId) => {
              const course = courses.find(c => c._id === courseId);
              if (course) { viewCourseDetail(course); setActiveTab('courses'); }
              else { setActiveTab('courses'); }
            }}
          />
        );
      case 'courses':
        return (
          <CoursesPage
            courses={courses}
            courseSearch={courseSearch}
            setCourseSearch={setCourseSearch}
            courseStatusFilter={courseStatusFilter}
            setCourseStatusFilter={setCourseStatusFilter}
            openCourseForm={openCourseForm}
            editCourse={editCourse}
            deleteCourse={deleteCourse}
            viewCourseDetail={viewCourseDetail}
          />
        );
      case 'notes':
        return (
          <NotesPage
            musicNotes={musicNotes}
            noteSearch={noteSearch}
            setNoteSearch={setNoteSearch}
            noteCategoryFilter={noteCategoryFilter}
            setNoteCategoryFilter={setNoteCategoryFilter}
            openNoteForm={openNoteForm}
            editMusicNote={editMusicNote}
            deleteMusicNote={deleteMusicNote}
          />
        );
      case 'students':
        return <StudentsPage initialStudentId={window._dashboardOpenStudent} onStudentOpened={() => { window._dashboardOpenStudent = null; }} />;
      default:
        return <DashboardPage dashboardStats={dashboardStats} loading={loading} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {renderContent()}
      
      {/* Course Modals */}
      {showCourseForm && (
        <CourseFormModal
          editingCourse={editingCourse}
          setShowCourseForm={setShowCourseForm}
          createCourse={createCourse}
          updateCourse={updateCourse}
          uploadFile={uploadFile}
          onCourseCreated={viewCourseDetail}
        />
      )}
      
      {showModuleForm && (
        <ModuleFormModal
          module={editingModule}
          onSave={handleSaveModule}
          onClose={() => {
            setShowModuleForm(false);
            setEditingModule(null);
            setCurrentModuleIndex(null);
          }}
        />
      )}
      
      {showLessonForm && (
        <LessonFormModal
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onClose={() => {
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
          uploadFile={uploadFile}
        />
      )}
      
      {/* Notes Modal */}
      {showNoteForm && (
        <NoteFormModal
          editingNote={editingNote}
          setShowNoteForm={setShowNoteForm}
          createMusicNote={createMusicNote}
          updateMusicNote={updateMusicNote}
          uploadFile={uploadFile}
        />
      )}
    </DashboardLayout>
  );
};

export default MainDashboardAdmin;