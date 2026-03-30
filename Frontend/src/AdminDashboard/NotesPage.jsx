import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Edit3, 
  Trash2, 
  Tag,
  Music,
  Sparkles,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const deleteMusicNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this music note?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/admin/music-notes/${id}`, getAxiosConfig());
      
      setMusicNotes(prev => prev.filter(note => note._id !== id));
      
      alert('Music note deleted successfully!');
    } catch (error) {
      console.error('Error deleting music note:', error);
      alert('Failed to delete music note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicNotes();
  }, []);

  const getCategoryBadge = (category) => {
    const categoryColors = {
      guitar: { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', shadow: 'shadow-blue-500/50' },
      piano: { bg: 'bg-gradient-to-r from-green-500 to-green-600', shadow: 'shadow-green-500/50' },
      violin: { bg: 'bg-gradient-to-r from-purple-500 to-purple-600', shadow: 'shadow-purple-500/50' },
      drums: { bg: 'bg-gradient-to-r from-orange-500 to-orange-600', shadow: 'shadow-orange-500/50' },
      vocal: { bg: 'bg-gradient-to-r from-pink-500 to-pink-600', shadow: 'shadow-pink-500/50' },
      bass: { bg: 'bg-gradient-to-r from-amber-400 to-amber-500', shadow: 'shadow-amber-400/50' },
      ukulele: { bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600', shadow: 'shadow-yellow-500/50' }
    };
    
    const colors = categoryColors[category?.toLowerCase()] || { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', shadow: 'shadow-gray-500/50' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white ${colors.bg} shadow-lg ${colors.shadow} hover:scale-110 transition-transform duration-300`}>
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

  const categories = [...new Set(musicNotes.map(note => note.category).filter(Boolean))];

  if (loading && musicNotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
              <Music className="mr-3 text-amber-600 animate-pulse" size={32} />
              Music Notes
            </h2>
            <p className="text-gray-600 mt-1 flex items-center">
              <Sparkles size={16} className="mr-2 text-amber-500" />
              Manage your music notation and tabs
            </p>
          </div>
          <button 
            onClick={openNoteForm}
            className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="mr-2 relative z-10" />
            <span className="relative z-10">New Note</span>
          </button>
        </div>
        <div className="flex items-center justify-center h-64 animate-fadeIn">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-t-4 border-amber-500 rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-6 h-6 text-amber-600 animate-pulse" />
            </div>
          </div>
          <span className="ml-4 text-gray-600 font-semibold text-lg">Loading music notes...</span>
        </div>
      </div>
    );
  }

  if (error && musicNotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
              <Music className="mr-3 text-amber-600 animate-pulse" size={32} />
              Music Notes
            </h2>
            <p className="text-gray-600 mt-1">Manage your music notation and tabs</p>
          </div>
          <button 
            onClick={openNoteForm}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center font-bold shadow-lg hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            New Note
          </button>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-8 text-center shadow-lg animate-shake">
          <AlertCircle size={64} className="mx-auto text-amber-500 mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-amber-800 mb-2">Error Loading Notes</h3>
          <p className="text-amber-600 mb-6 text-lg">{error}</p>
          <button
            onClick={fetchMusicNotes}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Animated Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
            <Music className="mr-3 text-amber-600 animate-pulse" size={32} />
            Music Notes
          </h2>
          <p className="text-gray-600 mt-1 flex items-center">
            <Sparkles size={16} className="mr-2 text-amber-500" />
            {musicNotes.length} note{musicNotes.length !== 1 ? 's' : ''} total
            {filteredNotes.length !== musicNotes.length && `, ${filteredNotes.length} filtered`}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchMusicNotes}
            disabled={loading}
            className="px-5 py-2.5 border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 flex items-center disabled:opacity-50 font-semibold hover:scale-105 hover:shadow-lg"
          >
            <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={openNoteForm}
            className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="mr-2 relative z-10" />
            <span className="relative z-10">New Note</span>
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" size={20} />
            <input
              type="text"
              placeholder="Search by title, category, lyrics..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 font-semibold hover:border-amber-300 transition-all duration-300 cursor-pointer min-w-[160px]"
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
                className="border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-300 transition-all duration-300 flex items-center font-semibold hover:scale-105"
              >
                <Filter size={20} className="mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && musicNotes.length > 0 && (
        <div className="flex items-center justify-center py-8 animate-fadeIn">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-amber-200 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-t-4 border-amber-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <span className="ml-4 text-gray-600 font-semibold">Updating...</span>
        </div>
      )}

      {/* Enhanced Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => {
          const isHovered = hoveredCard === note._id;
          
          return (
            <div 
              key={note._id} 
              className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(note._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Thumbnail */}
              {note.thumbnail ? (
                <div className="h-48 bg-gray-200 rounded-t-2xl overflow-hidden relative">
                  <img 
                    src={note.thumbnail} 
                    alt={note.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center absolute inset-0">
                    <FileText size={64} className="text-white opacity-50" />
                  </div>
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                  <FileText size={64} className="text-white opacity-50 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              )}
              
              <div className="p-6 relative">
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2 transition-colors duration-300 ${
                      isHovered ? 'text-amber-600' : ''
                    }`}>
                      {note.title}
                    </h3>
                    <div className={`flex items-center space-x-1 transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <button 
                        onClick={() => editMusicNote(note)}
                        className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-green-500/50"
                        title="Edit note"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMusicNote(note._id)}
                        className="text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-amber-400/50"
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
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500 font-semibold">
                      <Calendar size={14} className="mr-1.5 text-amber-500" />
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold">
                      <FileText size={14} className="mr-1.5" />
                      {note.sections?.length || 0} section{note.sections?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-amber-100/50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Empty States */}
      {filteredNotes.length === 0 && musicNotes.length > 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200 animate-fadeIn">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <Search size={64} className="relative mx-auto text-amber-500 mb-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching notes found</h3>
          <p className="text-gray-500 mb-6 text-lg">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setNoteSearch('');
              setNoteCategoryFilter('all');
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
          >
            Clear filters
          </button>
        </div>
      )}

      {musicNotes.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200 animate-fadeIn">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <Music size={64} className="relative mx-auto text-amber-500 mb-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No music notes yet</h3>
          <p className="text-gray-500 mb-8 text-lg">Get started by creating your first music notation or tab.</p>
          <button
            onClick={openNoteForm}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center mx-auto font-bold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={24} className="mr-2" />
            Create Your First Note
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default NotesPage;
