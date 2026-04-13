import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  List, 
  ChevronDown, 
  ChevronUp,
  Move,
  PlayCircle,
  FileText,
  Music,
  Type,
  Eye,
  Sparkles
} from 'lucide-react';
import LessonList from './LessonList';

const ModuleList = ({ 
  modules, 
  onAddModule, 
  onEditModule, 
  onDeleteModule, 
  onAddLesson, 
  onEditLesson, 
  onDeleteLesson,
  onSaveModules 
}) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [draggingModule, setDraggingModule] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
//   const [draggingLesson, setDraggingLesson] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };



  // Module Drag & Drop
  const handleModuleDragStart = (e, index) => {
    setDraggingModule(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleModuleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleModuleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggingModule === null || draggingModule === targetIndex) return;

    const updatedModules = [...modules];
    const [movedModule] = updatedModules.splice(draggingModule, 1);
    updatedModules.splice(targetIndex, 0, movedModule);

    // Update positions
    const reorderedModules = updatedModules.map((module, index) => ({
      ...module,
      position: index
    }));

    onSaveModules(reorderedModules);
    setDraggingModule(null);
  };

  const calculateModuleStats = (module) => {
    const totalLessons = module.lessons?.length || 0;
    
    let totalDuration = 0;
    module.lessons?.forEach(lesson => {
      if (lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        totalDuration += (minutes * 60) + (seconds || 0);
      }
    });
    
    const minutes = Math.floor(totalDuration / 60);
    
    return {
      totalLessons,
      duration: `${minutes}m`
    };
  };

  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center animate-fadeIn">
        <div className="max-w-md mx-auto">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-amber-100 to-amber-600 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg">
              <List size={32} className="text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No modules yet</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Start building your course by creating your first module. Modules help organize your content into logical sections.
          </p>
          <button
            onClick={onAddModule}
            className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center mx-auto font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={24} className="mr-2 relative z-10" />
            <span className="relative z-10">Create First Module</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Header */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
              <List className="mr-2 sm:mr-3 text-amber-600" size={24} />
              Course Content
            </h2>
            <p className="text-gray-600 mt-1 flex items-center text-sm sm:text-base">
              <Sparkles size={16} className="mr-2 text-amber-500" />
              {modules.length} modules • {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
            </p>
          </div>
          <button
            onClick={onAddModule}
            className="relative w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="mr-2 relative z-10" />
            <span className="relative z-10">Add Module</span>
          </button>
        </div>
      </div>

      {/* Enhanced Modules List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const stats = calculateModuleStats(module);
          const isExpanded = expandedModules[moduleIndex];
          
          return (
            <div
              key={moduleIndex}
              className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                draggingModule === moduleIndex ? 'opacity-50 scale-95' : 'hover:-translate-y-1'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${moduleIndex * 100}ms` }}
              draggable
              onDragStart={(e) => handleModuleDragStart(e, moduleIndex)}
              onDragOver={(e) => handleModuleDragOver(e, moduleIndex)}
              onDrop={(e) => handleModuleDrop(e, moduleIndex)}
            >
              {/* Enhanced Module Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:from-amber-50 hover:to-yellow-50 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-amber-600 p-2 cursor-move hover:bg-amber-50 rounded-lg transition-all duration-300 hover:scale-110"
                        title="Drag to reorder"
                      >
                        <Move size={18} />
                      </button>
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="text-gray-400 hover:text-amber-600 p-2 hover:bg-amber-50 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-100 to-amber-600 text-amber-600 p-3 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300">
                      <List size={22} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg hover:text-amber-600 transition-colors duration-300 truncate">{module.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {module.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{stats.totalLessons} lessons</span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">{stats.duration}</span>
                        {module.lessons?.some(lesson => lesson.isFreePreview) && (
                          <span className="text-green-600 flex items-center bg-green-100 px-3 py-1 rounded-full font-bold">
                            <Eye size={14} className="mr-1" />
                            Free preview
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAddLesson(moduleIndex)}
                      className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-blue-500/50"
                      title="Add Lesson"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => onEditModule(module, moduleIndex)}
                      className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-green-500/50"
                      title="Edit Module"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteModule(moduleIndex)}
                      className="text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-amber-400/50"
                      title="Delete Module"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Lessons List */}
              {isExpanded && (
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 animate-fadeIn">
                  <LessonList
                    lessons={module.lessons || []}
                    moduleIndex={moduleIndex}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                    onSaveLessons={(updatedLessons) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].lessons = updatedLessons;
                      onSaveModules(updatedModules);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ModuleList;