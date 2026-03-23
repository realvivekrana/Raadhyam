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
  const [activeTab, setActiveTab] = useState('courses');
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
      setDashboardStats(response.data);
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
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Error creating course. Please try again.');
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
      throw new Error('Error updating course. Please try again.');
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
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
      setMusicNotes(response.data.notes || []);
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

  // Course Navigation Handlers
  const openCourseForm = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const viewCourseDetail = (course) => {
    setSelectedCourse(course);
    setCurrentCourseView('detail');
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

  const openLessonForm = (lesson = null, moduleIndex = null, lessonIndex = null) => {
    setEditingLesson({ ...lesson, moduleIndex, lessonIndex });
    setShowLessonForm(true);
  };

  const saveCourseContent = async () => {
    if (!selectedCourse) return;
    
    // try {
    //   await updateCourseModules(selectedCourse._id, updatedModules);
    //   // Refresh the selected course data
    //   const updatedCourses = await fetchCourses();
    //   const updatedCourse = updatedCourses.find(c => c._id === selectedCourse._id);
    //   setSelectedCourse(updatedCourse);
    //   return updatedCourse;
    // } catch (error) {
    //   throw error;
    // }
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
      const updatedModules = selectedCourse.modules ? [...selectedCourse.modules] : [];
      
      if (editingLesson && editingLesson.moduleIndex !== undefined) {
        const moduleIndex = editingLesson.moduleIndex;
        
        if (editingLesson.lessonIndex !== undefined) {
          // Update existing lesson
          updatedModules[moduleIndex].lessons[editingLesson.lessonIndex] = {
            ...updatedModules[moduleIndex].lessons[editingLesson.lessonIndex],
            ...lessonData
          };
        } else {
          // Add new lesson
          const newLesson = {
            ...lessonData,
            position: updatedModules[moduleIndex].lessons.length,
            createdAt: new Date().toISOString()
          };
          updatedModules[moduleIndex].lessons = [
            ...(updatedModules[moduleIndex].lessons || []),
            newLesson
          ];
        }

        const updatedCourse = await saveCourseContent(updatedModules);
        setSelectedCourse(updatedCourse);
        setShowLessonForm(false);
        setEditingLesson(null);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteModule = async (moduleIndex) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      try {
        const updatedModules = selectedCourse.modules.filter((_, i) => i !== moduleIndex);
        const updatedCourse = await saveCourseContent(updatedModules);
        setSelectedCourse(updatedCourse);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteLesson = async (moduleIndex, lessonIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const updatedModules = [...selectedCourse.modules];
        updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
        const updatedCourse = await saveCourseContent(updatedModules);
        setSelectedCourse(updatedCourse);
      } catch (error) {
        alert(error.message);
      }
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
          onSaveModules={saveCourseContent}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage 
            dashboardStats={dashboardStats} 
            loading={loading} 
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
        return <StudentsPage />;
      default:
        return <DashboardPage dashboardStats={dashboardStats} loading={loading} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
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