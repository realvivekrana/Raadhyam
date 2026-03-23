import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Calendar, Edit3, Trash2, Tag, Loader } from 'lucide-react';
import axios from 'axios';

const NotesPage = ({
  openNoteForm,
  editMusicNote
}) => {
  const [musicNotes, setMusicNotes] = useState([]);
  const [noteSearch, setNoteSearch] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch music notes from backend API
  const fetchMusicNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/music-notes', getAxiosConfig());
      setMusicNotes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching music notes:', error);
      setError('Failed to load music notes. Please try again.');
      setMusicNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete music note API
  const deleteMusicNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this music note?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/admin/music-notes/${id}`, getAxiosConfig());
      
      // Remove the note from local state
      setMusicNotes(prev => prev.filter(note => note._id !== id));
      
      alert('Music note deleted successfully!');
    } catch (error) {
      console.error('Error deleting music note:', error);
      alert('Failed to delete music note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load music notes on component mount
  useEffect(() => {
    fetchMusicNotes();
  }, []);

  const getCategoryBadge = (category) => {
    const categoryColors = {
      guitar: 'bg-blue-100 text-blue-800',
      piano: 'bg-green-100 text-green-800',
      violin: 'bg-purple-100 text-purple-800',
      drums: 'bg-orange-100 text-orange-800',
      vocal: 'bg-pink-100 text-pink-800',
      bass: 'bg-red-100 text-red-800',
      ukulele: 'bg-yellow-100 text-yellow-800'
    };
    
    const color = categoryColors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Tag size={12} className="mr-1" />
        {category?.charAt(0).toUpperCase() + category?.slice(1)}
      </span>
    );
  };

  const filteredNotes = musicNotes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(noteSearch.toLowerCase()) ||
                         note.category?.toLowerCase().includes(noteSearch.toLowerCase()) ||
                         note.sections?.some(section => 
                           section.sectionTitle?.toLowerCase().includes(noteSearch.toLowerCase()) ||
                           section.lyrics?.toLowerCase().includes(noteSearch.toLowerCase())
                         );
    const matchesCategory = noteCategoryFilter === 'all' || note.category === noteCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get all unique categories from notes
  const categories = [...new Set(musicNotes.map(note => note.category).filter(Boolean))];

  if (loading && musicNotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Music Notes</h2>
            <p className="text-gray-600">Manage your music notation and tabs</p>
          </div>
          <button 
            onClick={openNoteForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Note
          </button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading music notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && musicNotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Music Notes</h2>
            <p className="text-gray-600">Manage your music notation and tabs</p>
          </div>
          <button 
            onClick={openNoteForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Note
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FileText size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Notes</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMusicNotes}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Music Notes</h2>
          <p className="text-gray-600">
            {musicNotes.length} note{musicNotes.length !== 1 ? 's' : ''} total
            {filteredNotes.length !== musicNotes.length && `, ${filteredNotes.length} filtered`}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchMusicNotes}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <Loader size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={openNoteForm}
            className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-red-800 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Note
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, category, lyrics..."
              className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[140px]"
              value={noteCategoryFilter}
              onChange={(e) => setNoteCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            {(noteSearch || noteCategoryFilter !== 'all') && (
              <button 
                onClick={() => {
                  setNoteSearch('');
                  setNoteCategoryFilter('all');
                }}
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Filter size={20} className="mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin h-6 w-6 text-red-600 mr-2" />
          <span className="text-gray-600">Updating...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            {note.thumbnail ? (
              <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                <img 
                  src={note.thumbnail} 
                  alt={note.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                  <FileText size={48} className="text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-xl flex items-center justify-center">
                <FileText size={48} className="text-gray-400" />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => editMusicNote(note)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Edit note"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteMusicNote(note._id)}
                    className="text-gray-400 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete note"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">{getCategoryBadge(note.category)}</div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p className="line-clamp-3">
                  {note.sections?.[0]?.explanation || 
                   note.sections?.[0]?.lyrics?.substring(0, 100) + '...' || 
                   'No description available'}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FileText size={14} className="mr-1" />
                    {note.sections?.length || 0} section{note.sections?.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty States */}
      {filteredNotes.length === 0 && musicNotes.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching notes found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setNoteSearch('');
              setNoteCategoryFilter('all');
            }}
            className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-red-800 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {musicNotes.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No music notes yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first music notation or tab.</p>
          <button
            onClick={openNoteForm}
            className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-red-800 transition-colors flex items-center mx-auto"
          >
            <Plus size={20} className="mr-2" />
            Create Your First Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesPage;