import React, { useState, useEffect } from 'react';
import { X, PlayCircle, FileText, Type, CheckCircle, Loader2, AlertCircle, Eye, Sparkles, Clock } from 'lucide-react';

const LessonFormModal = ({ lesson, onSave, onClose, uploadFile }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    pdfUrl: '',
    content: '',
    thumbnailUrl: '',
    duration: '',
    isFreePreview: false
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        type: lesson.type || 'video',
        videoUrl: lesson.videoUrl || '',
        pdfUrl: lesson.pdfUrl || '',
        content: lesson.content || '',
        thumbnailUrl: lesson.thumbnailUrl || '',
        duration: lesson.duration || '',
        isFreePreview: lesson.isFreePreview || false
      });
      // Set file selected if editing and file already exists
      if ((lesson.type === 'video' && lesson.videoUrl) ||
          (lesson.type === 'pdf' && lesson.pdfUrl)) {
        setFileSelected(true);
      }
    }
  }, [lesson]);

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      setFileSelected(true);
      
      console.log(`📤 Starting ${type} upload:`, file.name);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const fileUrl = await uploadFile(file, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% progress
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          [`${type}Url`]: fileUrl
        }));
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
      setUploadProgress(0);
      setFileSelected(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Lesson title is required');
      return;
    }
  // Validate that file/content exists based on selected type.
  // For editing, existing saved values are also accepted.
    const hasExistingVideo = lesson && lesson.type === 'video' && lesson.videoUrl;
    const hasExistingPdf = lesson && lesson.type === 'pdf' && lesson.pdfUrl;
    const hasExistingContent = lesson && lesson.type === 'text' && lesson.content;
    
    if (formData.type === 'video' && !formData.videoUrl && !hasExistingVideo) {
      alert('Please upload a video file before saving the lesson');
      return;
    }
    
    if (formData.type === 'pdf' && !formData.pdfUrl && !hasExistingPdf) {
      alert('Please upload a PDF file before saving the lesson');
      return;
    }
    
    if (formData.type === 'text' && !formData.content.trim() && !hasExistingContent) {
      alert('Please add text content before saving the lesson');
      return;
    }
    const cleanLessonData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      duration: formData.duration || '',
      isFreePreview: formData.isFreePreview || false,
    };

    // Preserve lesson _id when editing so backend updates existing lesson.
    if (lesson && lesson._id) {
      cleanLessonData._id = lesson._id;
    }

    // Only include relevant fields based on lesson type.
    if (formData.type === 'video') {
      cleanLessonData.videoUrl = formData.videoUrl || (lesson && lesson.videoUrl) || '';
      cleanLessonData.pdfUrl = undefined;
      cleanLessonData.content = undefined;
    } else if (formData.type === 'pdf') {
      cleanLessonData.pdfUrl = formData.pdfUrl || (lesson && lesson.pdfUrl) || '';
      cleanLessonData.videoUrl = undefined;
      cleanLessonData.content = undefined;
    } else if (formData.type === 'text') {
      cleanLessonData.content = formData.content || (lesson && lesson.content) || '';
      cleanLessonData.videoUrl = undefined;
      cleanLessonData.pdfUrl = undefined;
    }

    // Remove undefined fields from payload.
    Object.keys(cleanLessonData).forEach(key => {
      if (cleanLessonData[key] === undefined) {
        delete cleanLessonData[key];
      }
    });

    console.log('✅ Saving lesson data:', cleanLessonData);
    onSave(cleanLessonData);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, fileType);
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType
    }));
    setFileSelected(false);
    setUploadError(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'text': return <Type size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getFileRequirements = (type) => {
    switch (type) {
      case 'video':
        return 'MP4, MOV, or other video formats (max 5MB)';
      case 'pdf':
        return 'PDF files only (max 2MB)';
      case 'text':
        return 'Write your lesson content in the text area below';
      default:
        return '';
    }
  };

  const renderFileUploadSection = () => {
    switch (formData.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Video URL (YouTube, direct link)</label>
              <input
                type="url"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300"
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or direct video URL"
              />
              {formData.videoUrl && <p className="text-xs text-green-600 mt-1">✓ Video URL set</p>}
            </div>
            <div className="text-center text-gray-400 text-sm font-medium">— OR upload a file —</div>
            <div>
              <input type="file" accept="video/*"
                onChange={e => handleFileChange(e, 'video')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={uploading} />
              <p className="text-xs text-gray-500 mt-1">MP4, MOV etc. (max 5MB via Cloudinary)</p>
              {uploading && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width:`${uploadProgress}%` }} /></div>
                </div>
              )}
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File *
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              
              <p className="text-xs text-gray-500">
                {getFileRequirements('pdf')}
              </p>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading PDF...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Upload Error */}
              {uploadError && (
                <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  <AlertCircle size={16} className="mr-2" />
                  {uploadError}
                </div>
              )}
              
              {/* Success Message */}
              {formData.pdfUrl && !uploading && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  PDF uploaded successfully
                </p>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="space-y-2">
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your lesson content here... You can use markdown formatting for better presentation."
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                {getFileRequirements('text')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    if (!formData.title.trim() || uploading) return false;
    if (formData.type === 'text') return !!formData.content.trim();
    return true; // video URL is optional — title alone is enough
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
            <PlayCircle className="mr-2 text-amber-600" size={24} />
            {lesson && lesson._id ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-all duration-300 hover:scale-110"
            disabled={uploading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enhanced Lesson Type Selection */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl shadow-inner">
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <Sparkles size={18} className="mr-2 text-amber-500" />
              Lesson Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'video', label: 'Video', icon: PlayCircle },
                { value: 'pdf', label: 'PDF', icon: FileText },
                { value: 'text', label: 'Text', icon: Type }
              ].map((typeOption) => {
                const Icon = typeOption.icon;
                const isSelected = formData.type === typeOption.value;
                const isDisabled = uploading;
                
                return (
                  <button
                    key={typeOption.value}
                    type="button"
                    onClick={() => handleTypeChange(typeOption.value)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-400 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/50 scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  >
                    <Icon size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-bold">{typeOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-amber-500" />
                Lesson Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Scales"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <Clock size={16} className="mr-2 text-amber-500" />
                Duration (MM:SS)
              </label>
              <input
                type="text"
                placeholder="15:30"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                disabled={uploading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Type size={16} className="mr-2 text-amber-500" />
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this lesson covers..."
              disabled={uploading}
            />
          </div>

          {/* Enhanced Free Preview Toggle */}
          <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all duration-300">
            <input
              type="checkbox"
              id="isFreePreview"
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              checked={formData.isFreePreview}
              onChange={(e) => setFormData({ ...formData, isFreePreview: e.target.checked })}
              disabled={uploading}
            />
            <label htmlFor="isFreePreview" className="ml-4 block text-sm text-gray-700 cursor-pointer">
              <span className="font-bold text-green-700 flex items-center">
                <Eye size={16} className="mr-2" />
                Free Preview Lesson
              </span>
              <p className="text-gray-600 text-xs mt-1">
                Students can access this lesson without enrolling in the course
              </p>
            </label>
          </div>

          {/* Content Section based on type */}
          <div className="border-t pt-6">
            {renderFileUploadSection()}
          </div>

          {/* Enhanced Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              className="relative px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden group"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {getTypeIcon(formData.type)}
                  <span className="ml-2 relative z-10">
                    {lesson && lesson._id ? 'Update Lesson' : 'Add Lesson'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Enhanced Validation Help Text */}
          {!canSubmit() && !uploading && (
            <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border-2 border-amber-200 flex items-start">
              <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <div>
                {!formData.title.trim() ? (
                  <p className="font-semibold">⚠️ Please enter a lesson title</p>
                ) : formData.type === 'video' && !formData.videoUrl ? (
                  <p className="font-semibold">⚠️ Please upload a video file to continue</p>
                ) : formData.type === 'pdf' && !formData.pdfUrl ? (
                  <p className="font-semibold">⚠️ Please upload a PDF file to continue</p>
                ) : formData.type === 'text' && !formData.content.trim() ? (
                  <p className="font-semibold">⚠️ Please add text content to continue</p>
                ) : null}
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default LessonFormModal;