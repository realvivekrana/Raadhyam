import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Move, 
  Eye,
  PlayCircle,
  FileText,
  Music,
  Type,
  Clock
} from 'lucide-react';

const LessonList = ({ 
  lessons, 
  moduleIndex, 
  onEditLesson, 
  onDeleteLesson, 
  onSaveLessons 
}) => {
  const [draggingLesson, setDraggingLesson] = useState(null);

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} className="text-amber-600" />;
      case 'audio': return <Music size={16} className="text-purple-600" />;
      case 'pdf': return <FileText size={16} className="text-orange-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-amber-100 text-amber-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'pdf': return 'bg-orange-100 text-orange-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Lesson Drag & Drop
  const handleLessonDragStart = (e, index) => {
    setDraggingLesson(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLessonDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleLessonDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggingLesson === null || draggingLesson === targetIndex) return;

    const updatedLessons = [...lessons];
    const [movedLesson] = updatedLessons.splice(draggingLesson, 1);
    updatedLessons.splice(targetIndex, 0, movedLesson);

    // Update positions
    const reorderedLessons = updatedLessons.map((lesson, index) => ({
      ...lesson,
      position: index
    }));

    onSaveLessons(reorderedLessons);
    setDraggingLesson(null);
  };

  const moveLesson = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= lessons.length) return;

    const updatedLessons = [...lessons];
    [updatedLessons[index], updatedLessons[newIndex]] = [updatedLessons[newIndex], updatedLessons[index]];
    
    // Update positions
    const reorderedLessons = updatedLessons.map((lesson, idx) => ({
      ...lesson,
      position: idx
    }));

    onSaveLessons(reorderedLessons);
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-amber-100 to-amber-600 p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
            <PlayCircle size={28} className="text-amber-600" />
          </div>
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">No lessons yet</h4>
        <p className="text-gray-600 mb-4 text-lg">Add lessons to start building your module content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-900 flex items-center">
          <PlayCircle size={18} className="mr-2 text-amber-600" />
          Lessons ({lessons.length})
        </h4>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, lessonIndex) => (
          <div
            key={lessonIndex}
            className={`bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg hover:border-amber-300 transition-all duration-300 ${
              draggingLesson === lessonIndex ? 'opacity-50 scale-95' : 'hover:-translate-y-1'
            }`}
            draggable
            onDragStart={(e) => handleLessonDragStart(e, lessonIndex)}
            onDragOver={(e) => handleLessonDragOver(e, lessonIndex)}
            onDrop={(e) => handleLessonDrop(e, lessonIndex)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Enhanced Drag and Reorder Controls */}
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveLesson(lessonIndex, -1)}
                    disabled={lessonIndex === 0}
                    className="text-gray-400 hover:text-amber-600 p-1 disabled:opacity-30 hover:bg-amber-50 rounded transition-all duration-300 hover:scale-110"
                    title="Move up"
                  >
                    <Move size={16} className="rotate-90" />
                  </button>
                  <button
                    onClick={() => moveLesson(lessonIndex, 1)}
                    disabled={lessonIndex === lessons.length - 1}
                    className="text-gray-400 hover:text-amber-600 p-1 disabled:opacity-30 hover:bg-amber-50 rounded transition-all duration-300 hover:scale-110"
                    title="Move down"
                  >
                    <Move size={16} className="-rotate-90" />
                  </button>
                </div>

                {/* Enhanced Lesson Icon */}
                <div className={`p-3 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300 ${getLessonTypeColor(lesson.type)}`}>
                  {getLessonIcon(lesson.type)}
                </div>

                {/* Enhanced Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h5 className="font-bold text-gray-900 hover:text-amber-600 transition-colors duration-300">{lesson.title}</h5>
                    {lesson.isFreePreview && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center font-bold shadow-lg shadow-green-500/50 hover:scale-110 transition-transform duration-300">
                        <Eye size={12} className="mr-1" />
                        Free Preview
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="capitalize font-semibold bg-gray-100 px-2 py-1 rounded-lg">{lesson.type}</span>
                    {lesson.duration && (
                      <span className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-semibold">
                        <Clock size={14} className="mr-1" />
                        {lesson.duration}
                      </span>
                    )}
                    {lesson.description && (
                      <span className="truncate text-gray-500">{lesson.description}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditLesson(lesson, moduleIndex, lessonIndex)}
                  className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-green-500/50"
                  title="Edit Lesson"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteLesson(moduleIndex, lessonIndex)}
                  className="text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-amber-400/50"
                  title="Delete Lesson"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Add Lesson Button */}
      <div className="pt-4 border-t-2 border-gray-200">
        <button
          onClick={() => onEditLesson(null, moduleIndex, null)}
          className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-bold hover:bg-amber-50 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          <Plus size={18} className="mr-2" />
          Add Lesson to this Module
        </button>
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

export default LessonList;