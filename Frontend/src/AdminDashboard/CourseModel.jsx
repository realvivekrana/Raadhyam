import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BookOpen, DollarSign, User, Settings, Eye,
  Plus, Trash2, Save, X, Upload, EyeOff,
  AlertCircle, RefreshCw, Sparkles
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Initial form state
───────────────────────────────────────────── */
const getInitialCourseForm = () => ({
  title: '',
  subtitle: '',
  shortDescription: '',
  description: '',
  category: '',
  tags: [''],
  level: 'Beginner',
  language: 'English',
  thumbnailUrl: '',
  promoVideoUrl: '',
  price: 0,
  currency: 'INR',
  isFree: false,
  offerPrice: '',
  prerequisites: [''],
  whatYouWillLearn: [''],
  requirements: [''],
  modules: [],
  instructor: {
    name: '',
    bio: '',
    email: '',
    profileImage: '',
  },
  publish: {
    status: 'draft',
    visibility: 'public',
  },
  stats: {
    enrolledStudents: 0,
    totalLessons: 0,
    totalRatings: 0,
    averageRating: 0,
  },
});

/* ─────────────────────────────────────────────
   Main Modal Component
───────────────────────────────────────────── */
const CourseFormModal = ({
  editingCourse,
  setShowCourseForm,
  createCourse,
  updateCourse,
  uploadFile,
  onCourseCreated,
  refreshCourses,
}) => {
  const [courseForm, setCourseForm] = useState(
    editingCourse ? { ...getInitialCourseForm(), ...editingCourse } : getInitialCourseForm()
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState(null);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ── helpers ── */
  const getAxiosConfig = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    };
  };

  const handleClose = () => {
    if (!loading) setShowCourseForm(false);
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    setCourseForm(prev => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (field, index, value) => {
    setCourseForm(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) =>
    setCourseForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));

  const removeArrayItem = (field, index) =>
    setCourseForm(prev => ({
      ...prev,
      [field]: prev[field].length > 1 ? prev[field].filter((_, i) => i !== index) : prev[field],
    }));

  /* ── file upload ── */
  const handleFileChange = async (path, file) => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      let url;
      if (uploadFile) {
        url = await uploadFile(file, path.includes('video') ? 'video' : 'image');
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', path.includes('video') ? 'video' : 'image');
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const res = await axios.post('/api/admin/upload', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        url = res.data.url;
      }
      if (url) updateField(path, url);
    } catch (err) {
      setError('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!courseForm.title.trim()) { setError('Course title is required'); return; }
    if (!courseForm.category.trim()) { setError('Course category is required'); return; }

    try {
      setLoading(true);
      setError(null);

      // Build payload — only include fields with actual values
      const courseData = {};

      // Required
      courseData.title = courseForm.title.trim();
      courseData.category = courseForm.category.trim();

      // Optional strings — only if non-empty
      if (courseForm.subtitle?.trim())          courseData.subtitle = courseForm.subtitle.trim();
      if (courseForm.shortDescription?.trim())  courseData.shortDescription = courseForm.shortDescription.trim();
      if (courseForm.description?.trim())       courseData.description = courseForm.description.trim();
      if (courseForm.thumbnailUrl?.trim())      courseData.thumbnailUrl = courseForm.thumbnailUrl.trim();
      if (courseForm.promoVideoUrl?.trim())     courseData.promoVideoUrl = courseForm.promoVideoUrl.trim();

      // Enums
      courseData.level    = courseForm.level    || 'Beginner';
      courseData.language = courseForm.language || 'English';

      // Pricing
      courseData.isFree = Boolean(courseForm.isFree);
      if (!courseForm.isFree) {
        const p = parseFloat(courseForm.price);
        if (!isNaN(p) && p >= 0) courseData.price = p;
        const op = parseFloat(courseForm.offerPrice);
        if (!isNaN(op) && op > 0) courseData.offerPrice = op;
      }

      // Arrays — only if they have real entries
      const tags = courseForm.tags.filter(t => t?.trim());
      if (tags.length) courseData.tags = tags;

      const prereqs = courseForm.prerequisites.filter(t => t?.trim());
      if (prereqs.length) courseData.prerequisites = prereqs;

      const learn = courseForm.whatYouWillLearn.filter(t => t?.trim());
      if (learn.length) courseData.whatYouWillLearn = learn;

      const reqs = courseForm.requirements.filter(t => t?.trim());
      if (reqs.length) courseData.requirements = reqs;

      // Publish
      courseData.publish = {
        status: courseForm.publish?.status || 'draft',
      };

      // Instructor — only if name provided
      if (courseForm.instructor?.name?.trim()) {
        courseData.instructor = { name: courseForm.instructor.name.trim() };
        if (courseForm.instructor.bio?.trim())          courseData.instructor.bio = courseForm.instructor.bio.trim();
        if (courseForm.instructor.email?.trim())        courseData.instructor.email = courseForm.instructor.email.trim();
        if (courseForm.instructor.profileImage?.trim()) courseData.instructor.profileImage = courseForm.instructor.profileImage.trim();
      }

      let result;
      if (editingCourse) {
        result = updateCourse
          ? await updateCourse(editingCourse._id, courseData)
          : (await axios.put(`/api/admin/courses/${editingCourse._id}`, courseData, getAxiosConfig())).data;
      } else {
        result = createCourse
          ? await createCourse(courseData)
          : (await axios.post('/api/admin/courses', courseData, getAxiosConfig())).data;
        if (onCourseCreated && result) onCourseCreated(result);
      }

      if (refreshCourses) refreshCourses();
      setShowCourseForm(false);
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.error
        || err?.message
        || 'Error saving course';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── tabs ── */
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'instructor', label: 'Instructor', icon: User },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  /* ── input helpers ── */
  const inputCls = 'w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-200 hover:border-amber-300 text-sm';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  /* ── tab content ── */
  const renderTab = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Course Title *</label>
                <input className={inputCls} placeholder="e.g. Guitar for Beginners"
                  value={courseForm.title}
                  onChange={e => updateField('title', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input className={inputCls} placeholder="Brief tagline"
                  value={courseForm.subtitle}
                  onChange={e => updateField('subtitle', e.target.value)} />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className={labelCls}>Short Description</label>
              <textarea rows={2} className={inputCls} placeholder="Brief overview"
                value={courseForm.shortDescription}
                onChange={e => updateField('shortDescription', e.target.value)} />
            </div>

            {/* Full Description */}
            <div>
              <label className={labelCls}>Full Description</label>
              <textarea rows={4} className={inputCls} placeholder="Detailed course description"
                value={courseForm.description}
                onChange={e => updateField('description', e.target.value)} />
            </div>

            {/* Category / Level / Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Category *</label>
                <input className={inputCls} placeholder="e.g. Guitar, Piano"
                  value={courseForm.category}
                  onChange={e => updateField('category', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Level</label>
                <select className={inputCls} value={courseForm.level}
                  onChange={e => updateField('level', e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Language</label>
                <select className={inputCls} value={courseForm.language}
                  onChange={e => updateField('language', e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>Tags</label>
              {courseForm.tags.map((tag, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={inputCls} placeholder={`Tag ${i + 1}`} value={tag}
                    onChange={e => updateArrayItem('tags', i, e.target.value)} />
                  {courseForm.tags.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('tags', i)}
                      className="text-amber-500 hover:text-amber-700 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('tags')}
                className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-semibold mt-1">
                <Plus size={16} className="mr-1" /> Add Tag
              </button>
            </div>

            {/* What You'll Learn */}
            <div>
              <label className={labelCls}>What Students Will Learn</label>
              {courseForm.whatYouWillLearn.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={inputCls} placeholder={`Learning outcome ${i + 1}`} value={item}
                    onChange={e => updateArrayItem('whatYouWillLearn', i, e.target.value)} />
                  {courseForm.whatYouWillLearn.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('whatYouWillLearn', i)}
                      className="text-amber-500 hover:text-amber-700 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('whatYouWillLearn')}
                className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-semibold mt-1">
                <Plus size={16} className="mr-1" /> Add Outcome
              </button>
            </div>

            {/* Prerequisites */}
            <div>
              <label className={labelCls}>Prerequisites</label>
              {courseForm.prerequisites.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={inputCls} placeholder={`Prerequisite ${i + 1}`} value={item}
                    onChange={e => updateArrayItem('prerequisites', i, e.target.value)} />
                  {courseForm.prerequisites.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('prerequisites', i)}
                      className="text-amber-500 hover:text-amber-700 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('prerequisites')}
                className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-semibold mt-1">
                <Plus size={16} className="mr-1" /> Add Prerequisite
              </button>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Instructor Name</label>
                <input className={inputCls} placeholder="Full name"
                  value={courseForm.instructor.name}
                  onChange={e => updateField('instructor.name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" placeholder="instructor@email.com"
                  value={courseForm.instructor.email}
                  onChange={e => updateField('instructor.email', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Bio</label>
              <textarea rows={4} className={inputCls} placeholder="Instructor biography"
                value={courseForm.instructor.bio}
                onChange={e => updateField('instructor.bio', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Profile Image URL</label>
              <input className={inputCls} placeholder="https://..."
                value={courseForm.instructor.profileImage}
                onChange={e => updateField('instructor.profileImage', e.target.value)} />
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-green-50 rounded-2xl border-2 border-green-200">
              <input type="checkbox" id="isFree" className="h-5 w-5 text-green-600 rounded cursor-pointer"
                checked={courseForm.isFree}
                onChange={e => updateField('isFree', e.target.checked)} />
              <label htmlFor="isFree" className="ml-3 font-bold text-green-700 cursor-pointer">
                Free Course
              </label>
            </div>

            {!courseForm.isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Price (₹)</label>
                  <input className={inputCls} type="number" min="0" placeholder="0"
                    value={courseForm.price}
                    onChange={e => updateField('price', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Offer Price (₹)</label>
                  <input className={inputCls} type="number" min="0" placeholder="Optional"
                    value={courseForm.offerPrice}
                    onChange={e => updateField('offerPrice', e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <label className={labelCls}>Currency</label>
              <select className={inputCls} value={courseForm.currency}
                onChange={e => updateField('currency', e.target.value)}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Thumbnail Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-300 transition-colors">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">Upload course thumbnail</p>
                <input type="file" accept="image/*" className="hidden" id="thumbnail-upload"
                  onChange={e => handleFileChange('thumbnailUrl', e.target.files[0])}
                  disabled={uploading} />
                <label htmlFor="thumbnail-upload"
                  className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">
                  {uploading ? 'Uploading...' : 'Choose File'}
                </label>
              </div>
              {courseForm.thumbnailUrl && (
                <div className="mt-3">
                  <img src={courseForm.thumbnailUrl} alt="Thumbnail"
                    className="h-32 w-auto rounded-xl object-cover border-2 border-gray-200" />
                </div>
              )}
              <div className="mt-3">
                <label className={labelCls}>Or paste image URL</label>
                <input className={inputCls} placeholder="https://..."
                  value={courseForm.thumbnailUrl}
                  onChange={e => updateField('thumbnailUrl', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Promo Video URL</label>
              <input className={inputCls} placeholder="https://youtube.com/..."
                value={courseForm.promoVideoUrl}
                onChange={e => updateField('promoVideoUrl', e.target.value)} />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Publish Status</label>
              <select className={inputCls} value={courseForm.publish.status}
                onChange={e => updateField('publish.status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Visibility</label>
              <select className={inputCls} value={courseForm.publish.visibility}
                onChange={e => updateField('publish.visibility', e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Requirements</label>
              {courseForm.requirements.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={inputCls} placeholder={`Requirement ${i + 1}`} value={item}
                    onChange={e => updateArrayItem('requirements', i, e.target.value)} />
                  {courseForm.requirements.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('requirements', i)}
                      className="text-amber-500 hover:text-amber-700 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('requirements')}
                className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-semibold mt-1">
                <Plus size={16} className="mr-1" /> Add Requirement
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 48px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen size={22} className="text-amber-600" />
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" />
              Fill in the details below
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 hover:scale-110 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-200 bg-white overflow-x-auto flex-shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-600 bg-amber-50/50'
                    : 'border-transparent text-gray-500 hover:text-amber-500 hover:border-amber-200'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm flex-shrink-0">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-amber-400 hover:text-amber-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
          {renderTab()}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {courseForm.publish.status === 'draft'
              ? <><EyeOff size={13} /> Draft</>
              : <><Eye size={13} className="text-green-600" /><span className="text-green-600">Published</span></>
            }
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="relative px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/40 hover:from-amber-600 hover:to-amber-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading || uploading ? (
                <><RefreshCw size={15} className="animate-spin" />{uploading ? 'Uploading...' : 'Saving...'}</>
              ) : (
                <><Save size={15} className="relative z-10" /><span className="relative z-10">{editingCourse ? 'Update Course' : 'Create Course'}</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFormModal;
