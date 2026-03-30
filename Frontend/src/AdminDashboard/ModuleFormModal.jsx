import React, { useState, useEffect } from 'react';
import { X, List, Sparkles, FileText } from 'lucide-react';

const ModuleFormModal = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 0
  });

  useEffect(() => {
    if (module) {
      ({
        title: module.title || '',
        description: module.description || '',
        position: module.position || 0
      });
    }
  }, [module]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Module title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slideUp">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-amber-50 to-yellow-50">
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
            <List size={24} className="mr-2 text-amber-600" />
            {module ? 'Edit Module' : 'Add New Module'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-all duration-300 hover:scale-110">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Sparkles size={16} className="mr-2 text-amber-500" />
              Module Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Music Theory"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <FileText size={16} className="mr-2 text-amber-500" />
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this module..."
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="relative px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">{module ? 'Update Module' : 'Add Module'}</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
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

export default ModuleFormModal;