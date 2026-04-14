import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Music, CheckCircle, X, Clock, BarChart3, ArrowRight, Sparkles, BookOpen, Users, Star } from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Forum&family=Manrope:wght@400;500;600;700;800&display=swap');

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(26px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes shimmer {
      0%, 100% { background-position: 200% center; }
      50% { background-position: -200% center; }
    }
    @keyframes cardPulse {
      0%, 100% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04); }
      50% { box-shadow: 0 12px 48px rgba(239, 126, 26, 0.12); }
    }
    @keyframes borderRotate {
      0% { border-color: rgba(239, 126, 26, 0.18); }
      50% { border-color: rgba(239, 126, 26, 0.35); }
      100% { border-color: rgba(239, 126, 26, 0.18); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(2deg) scale(1.05); }
    }

    .cp-fade-up { animation: revealUp 0.8s ease both; }
    .cp-fade-up-d1 { animation: revealUp 0.8s ease 0.12s both; }
    .cp-fade-up-d2 { animation: revealUp 0.8s ease 0.24s both; }
    .cp-scale-in { animation: scaleIn 0.6s ease both; }
    .cp-float { animation: float 3.5s ease-in-out infinite; }
    .cp-pulse { animation: cardPulse 2.5s ease-in-out infinite; }

    .cp-glass {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .cp-glass-border {
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(239, 126, 26, 0.15);
      box-shadow: 0 8px 32px rgba(239, 126, 26, 0.08);
      backdrop-filter: blur(12px);
    }

    .cp-card {
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(239, 126, 26, 0.18);
      border-radius: 24px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .cp-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(239, 126, 26, 0.1) 0%, rgba(244, 161, 79, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .cp-card:hover {
      transform: translateY(-12px);
      border-color: rgba(239, 126, 26, 0.35);
      box-shadow: 0 20px 60px rgba(239, 126, 26, 0.15), 0 0 40px rgba(239, 126, 26, 0.08);
    }

    .cp-card:hover::before {
      opacity: 1;
    }

    .cp-btn-primary {
      background: linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%);
      color: #ffffff;
      font-weight: 700;
      border-radius: 12px;
      border: none;
      box-shadow: 0 12px 28px rgba(239, 126, 26, 0.28);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .cp-btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 36px rgba(239, 126, 26, 0.38);
    }

    .cp-btn-secondary {
      background: rgba(255, 255, 255, 0.7);
      border: 1.5px solid rgba(239, 126, 26, 0.25);
      color: #1f2937;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .cp-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(239, 126, 26, 0.4);
      box-shadow: 0 12px 28px rgba(239, 126, 26, 0.12);
    }

    .cp-gradient-text {
      background: linear-gradient(130deg, #ef7e1a 0%, #f4a14f 60%, #ef7e1a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cp-accent-border {
      position: relative;
      border-top: 2px solid transparent;
      border-image: linear-gradient(90deg, rgba(239, 126, 26, 0), rgba(239, 126, 26, 0.5), rgba(239, 126, 26, 0)) 1;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Forum', Georgia, serif;
      letter-spacing: 0.02em;
    }

    body {
      font-family: 'Manrope', sans-serif;
      background: #fafaf9;
    }

    .cp-shell {
      background: #fdfdfd;
    }
  `}</style>
);

const CourseCard = ({ course, delay, onOpen }) => {
  const { ref, inView } = useInView(0.12);
  const [hovered, setHovered] = useState(false);

  // Map API data to display format with fallback icons and images
  const courseData = {
    name: course.title || course.name || 'Course',
    icon: course.icon || '🎵',
    image: course.thumbnailUrl || course.thumbnail || course.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    tag: course.category || course.tag || 'Course',
    level: course.level || 'All Levels',
    duration: course.duration || 'Self-paced',
    desc: course.shortDescription || course.description || course.desc || 'Learn this exciting course.',
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(course)}
      className="cp-card overflow-hidden cursor-pointer group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        animation: inView ? `cardPulse 2.5s ease-in-out infinite` : 'none',
      }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        <img
          src={courseData.image}
          alt={courseData.name}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
        
        {/* Tag Badge */}
        <div className="absolute top-4 left-4" style={{
          animation: hovered ? 'slideInLeft 0.4s ease' : 'none',
        }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cp-gradient-text bg-white/70 backdrop-blur-sm border border-white/50 group-hover:shadow-lg group-hover:bg-white/90 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
            {courseData.tag}
          </span>
        </div>

        {/* Icon Circle */}
        <div className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
          {courseData.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:bg-clip-text transition-all duration-300">
          {courseData.name}
        </h3>

        {/* Meta Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100/60 text-orange-700 border border-orange-200/50 backdrop-blur group-hover:bg-orange-100 group-hover:shadow-md transition-all duration-300"
            style={{
              animation: hovered ? 'slideInUp 0.3s ease 0.05s both' : 'none',
            }}
          >
            <BarChart3 className="w-3 h-3" /> {courseData.level}
          </span>
          <span 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100/60 text-slate-600 border border-slate-200/50 backdrop-blur group-hover:bg-slate-100 group-hover:shadow-md transition-all duration-300"
            style={{
              animation: hovered ? 'slideInUp 0.3s ease 0.1s both' : 'none',
            }}
          >
            <Clock className="w-3 h-3" /> {courseData.duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
          {courseData.desc}
        </p>

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-3 cp-accent-border group-hover:border-orange-300 transition-all duration-300">
          <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-300">
            Explore Course
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 text-orange-600 flex items-center justify-center font-bold group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-amber-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" style={{
            animation: hovered ? 'wiggle 0.5s ease' : 'none',
          }}>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || null;
};

const CourseModal = ({ course, onClose, onEnroll, enrolled, enrolling, isLoggedIn }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const courseData = {
    id: course._id,
    title: course.title || course.name || 'Course',
    subtitle: course.subtitle,
    icon: course.icon || '🎵',
    image: course.thumbnailUrl || course.thumbnail || course.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    category: course.category || course.tag || 'Course',
    level: course.level || 'All Levels',
    language: course.language,
    duration: course.duration || 'Self-paced',
    description: course.shortDescription || course.description || 'Learn this exciting course.',
    fullDescription: course.description,
    details: (course.whatYouWillLearn && course.whatYouWillLearn.length > 0)
      ? course.whatYouWillLearn
      : (course.modules?.map((m) => m.title).filter(Boolean) || ['Course content available']),
    prerequisites: course.prerequisites || [],
    modulesCount: course.modules?.length || 0,
    students: course.stats?.enrolledStudents || 0,
    rating: course.stats?.rating || 0,
    isFree: Boolean(course.isFree),
    price: course.price || 0,
    offerPrice: course.offerPrice,
    instructor: course.instructor,
    promoVideoUrl: course.promoVideoUrl,
  };

  const videoId = extractYouTubeVideoId(courseData.promoVideoUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl cp-glass shadow-2xl border border-white/80 cp-scale-in"
        style={{
          animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Hero Image Section */}
        <div className="relative h-80 overflow-hidden bg-slate-900 flex items-center justify-center">
          <img src={courseData.image} alt={courseData.title} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
          
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="inline-flex items-center gap-2 w-fit mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cp-gradient-text bg-white/70 backdrop-blur-sm border border-white/50">
                <Sparkles className="w-3.5 h-3.5" />
                {courseData.category}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{courseData.icon}</span>
              {courseData.title}
            </h2>
            {courseData.subtitle && (
              <p className="text-slate-200 mt-2 text-sm sm:text-base">{courseData.subtitle}</p>
            )}
          </div>
        </div>

        {videoId && (
          <div className="px-8 sm:px-10 pt-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Promo Video"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-8 sm:p-10">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100/60 text-orange-700 font-semibold text-sm border border-orange-200/50 backdrop-blur">
              <BarChart3 className="w-4 h-4" /> {courseData.level}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/60 text-slate-600 font-semibold text-sm border border-slate-200/50 backdrop-blur">
              <Clock className="w-4 h-4" /> {courseData.duration}
            </span>
            {courseData.language && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-100/70 text-sky-700 font-semibold text-sm border border-sky-200/50 backdrop-blur">
                {courseData.language}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100/60 text-green-700 font-semibold text-sm border border-green-200/50 backdrop-blur">
              <CheckCircle className="w-4 h-4" /> Live Classes
            </span>
            {courseData.modulesCount > 0 && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-100/70 text-indigo-700 font-semibold text-sm border border-indigo-200/50 backdrop-blur">
                <BookOpen className="w-4 h-4" /> {courseData.modulesCount} modules
              </span>
            )}
            {courseData.students > 0 && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-100/70 text-cyan-700 font-semibold text-sm border border-cyan-200/50 backdrop-blur">
                <Users className="w-4 h-4" /> {courseData.students} students
              </span>
            )}
            {courseData.rating > 0 && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100/70 text-amber-700 font-semibold text-sm border border-amber-200/50 backdrop-blur">
                <Star className="w-4 h-4" /> {courseData.rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm">
              {courseData.isFree ? '🎁 Free' : courseData.offerPrice ? (
                <>
                  <span className="line-through text-slate-300">₹{courseData.price}</span>
                  <span>₹{courseData.offerPrice}</span>
                </>
              ) : `₹${courseData.price}`}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-700 leading-relaxed mb-8 font-medium">
            {courseData.description}
          </p>

          {courseData.fullDescription && courseData.fullDescription !== courseData.description && (
            <p className="text-slate-600 leading-relaxed mb-8">
              {courseData.fullDescription}
            </p>
          )}

          {/* Learning Outcomes */}
          <div className="rounded-2xl cp-glass border-2 border-orange-200/30 p-7 mb-8">
            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              What You Will Learn
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {courseData.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 p-2 rounded-lg hover:bg-white/40 transition-colors" style={{
                  animation: `revealUp 0.5s ease ${100 + idx * 50}ms both`,
                }}>
                  <CheckCircle className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" />
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {courseData.prerequisites.filter(Boolean).length > 0 && (
            <div className="rounded-2xl cp-glass border border-slate-200 p-7 mb-8">
              <h4 className="text-lg font-bold text-slate-900 mb-3">Prerequisites</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                {courseData.prerequisites.filter(Boolean).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {courseData.instructor?.name && (
            <div className="rounded-2xl cp-glass border border-slate-200 p-5 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-lg flex items-center justify-center">
                {courseData.instructor.name[0]}
              </div>
              <div>
                <p className="text-slate-900 font-semibold">{courseData.instructor.name}</p>
                {courseData.instructor.bio && (
                  <p className="text-slate-600 text-sm">{courseData.instructor.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {enrolled ? (
              <div className="flex-1 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold text-lg px-6 py-4 text-center">
                ✓ Already Enrolled
              </div>
            ) : isLoggedIn ? (
              <button
                className="flex-1 cp-btn-primary px-6 py-4 font-semibold text-lg rounded-xl inline-flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => onEnroll(courseData.id, courseData.title)}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                {!enrolling && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            ) : (
              <Link to="/login" className="flex-1">
                <button className="w-full cp-btn-primary px-6 py-4 font-semibold text-lg rounded-xl inline-flex items-center justify-center gap-2 group">
                  Login to Enroll
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            )}
            <Link to="/Contact-Us" className="flex-1">
              <button className="w-full cp-btn-secondary px-6 py-4 font-semibold text-lg rounded-xl hover:shadow-lg transition-all">
                Free Counselling
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [selected, setSelected] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [enrollingId, setEnrollingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    fetchCourses();
    if (isLoggedIn) {
      fetchEnrolledCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courses');
      // Handle both array response and { courses: [] } or { data: [] } response
      const coursesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.courses || response.data.data || []);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get('/api/user/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success && res.data.data) {
        const ids = new Set(res.data.data.map((c) => c.courseId?.toString() || c._id?.toString()));
        setEnrolledCourses(ids);
      }
    } catch (err) {
      setEnrolledCourses(new Set());
    }
  };

  const handleEnroll = async (courseId, courseTitle) => {
    if (!courseId) return;

    setEnrollingId(courseId);
    try {
      const res = await axios.post(
        '/api/user/enroll',
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data.success) {
        setEnrolledCourses((prev) => new Set([...prev, courseId.toString()]));
        setNotification({ type: 'success', message: `Enrolled in "${courseTitle}" successfully!` });
        fetchEnrolledCourses();
      }
    } catch (err) {
      if (err.response?.data?.alreadyEnrolled) {
        setEnrolledCourses((prev) => new Set([...prev, courseId.toString()]));
        setNotification({ type: 'success', message: `Already enrolled in "${courseTitle}".` });
      } else {
        setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to enroll in course.' });
      }
    } finally {
      setEnrollingId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden cp-shell">
        <GlobalStyles />
        <NavBarpage />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading courses...</p>
          </div>
        </div>
        <FooterPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden cp-shell">
      <GlobalStyles />
      <NavBarpage />

      {notification && (
        <div className={`fixed top-5 right-5 z-[10000] px-5 py-3 rounded-xl text-white font-semibold shadow-xl ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={`${import.meta.env.BASE_URL}Video_of_Slow_Moving_Waves.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-400/30 bg-orange-500/10 text-orange-300 text-xs sm:text-sm font-bold tracking-wide cp-fade-up backdrop-blur-sm"
          >
            <Music className="w-4 h-4" />
            Explore Our Programs
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mt-6 mb-5 cp-fade-up-d1 text-white leading-tight"
          >
            Master Your <span className="cp-gradient-text">Musical Journey</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-slate-300/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto cp-fade-up-d2 font-medium"
          >
            Learn from world-class instructors with personalized guidance, live performances, and certification programs. Your next musical breakthrough starts here.
          </p>

          {/* Quick Stats */}
          <div
            className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-10 cp-fade-up-d2"
          >
            {[
              { icon: Music, label: '25+ Instruments' },
              { icon: BarChart3, label: 'All Levels' },
              { icon: CheckCircle, label: 'Online & Offline' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-200">
                <stat.icon className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="relative mt-0 z-20 px-4 pt-16 sm:pt-20 pb-16 sm:pb-20">
        <div className="container mx-auto max-w-7xl">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No courses available</h3>
              <p className="text-slate-600">Check back soon for new courses!</p>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, i) => (
                  <CourseCard key={course._id || course.id || i} course={course} delay={i * 70} onOpen={setSelected} />
                ))}
              </div>
            </>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="cp-glass cp-glass-border rounded-3xl p-10 sm:p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Still Undecided?
              </h3>
              <p className="text-slate-600 mb-8 font-medium">
                Our music experts can help you choose the perfect course to match your goals and experience level.
              </p>
              <Link to="/Contact-Us">
                <button className="cp-btn-primary px-8 py-4 font-semibold text-lg rounded-xl inline-flex items-center gap-2 group">
                  Get Expert Guidance
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterPage />

      {/* Modal */}
      {selected && (
        <CourseModal
          course={selected}
          onClose={() => setSelected(null)}
          onEnroll={handleEnroll}
          enrolled={enrolledCourses.has(selected._id?.toString())}
          enrolling={enrollingId === selected._id}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default CoursesPage;
