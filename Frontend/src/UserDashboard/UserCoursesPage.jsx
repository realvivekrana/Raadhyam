import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Clock, BookOpen, Users, Star, CheckCircle } from 'lucide-react';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

/* ── Course Detail Modal ─────────────────────────────────────────── */
const CourseModal = ({ course, enrolled, enrolling, onEnroll, onClose }) => {
  if (!course) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', position:'relative' }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:10, background:'rgba(0,0,0,0.08)', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={18} color={SLATE} />
        </button>

        {/* Thumbnail */}
        {course.thumbnailUrl
          ? <img src={course.thumbnailUrl} alt={course.title} style={{ width:'100%', height:220, objectFit:'cover', borderRadius:'20px 20px 0 0' }} />
          : <div style={{ width:'100%', height:220, background:`linear-gradient(135deg,${AMBER},#B45309)`, borderRadius:'20px 20px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem' }}>🎵</div>
        }

        {/* Promo Video */}
        {course.promoVideoUrl && (() => {
          const videoId = course.promoVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
          if (!videoId) return null;
          return (
            <div style={{ padding:'1rem 1.5rem', background:'#F8FAFC', borderBottom:'1px solid #F1F5F9' }}>
              <div style={{ fontWeight:700, color:SLATE, fontSize:'0.85rem', fontFamily:SANS, marginBottom:8 }}>🎬 Promo Video</div>
              <div style={{ position:'relative', paddingBottom:'56.25%', height:0, overflow:'hidden', borderRadius:12 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Promo Video"
                />
              </div>
            </div>
          );
        })()}

        <div style={{ padding:'1.5rem' }}>
          {/* Badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            {course.level && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'3px 12px', fontFamily:SANS }}>{course.level}</span>}
            {course.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#8B5CF6', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'3px 12px', fontFamily:SANS }}>{course.category}</span>}
            {course.language && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#0EA5E9', background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:20, padding:'3px 12px', fontFamily:SANS }}>{course.language}</span>}
          </div>

          <h2 style={{ fontFamily:SERIF, fontSize:'1.6rem', fontWeight:700, color:SLATE, marginBottom:8 }}>{course.title}</h2>
          {course.subtitle && <p style={{ color:MUTED, fontSize:'0.95rem', fontFamily:SANS, marginBottom:12, fontStyle:'italic' }}>{course.subtitle}</p>}

          {/* Quick stats */}
          <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:16, padding:'12px 0', borderTop:'1px solid #F1F5F9', borderBottom:'1px solid #F1F5F9' }}>
            {course.duration && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:MUTED, fontFamily:SANS }}><Clock size={14} color={AMBER} />{course.duration}</span>}
            {course.modules?.length > 0 && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:MUTED, fontFamily:SANS }}><BookOpen size={14} color={AMBER} />{course.modules.length} modules</span>}
            {course.stats?.enrolledStudents > 0 && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:MUTED, fontFamily:SANS }}><Users size={14} color={AMBER} />{course.stats.enrolledStudents} students</span>}
            {course.stats?.rating > 0 && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:MUTED, fontFamily:SANS }}><Star size={14} color={AMBER} />{course.stats.rating.toFixed(1)}</span>}
            <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', fontWeight:700, color: course.isFree ? '#10B981' : SLATE, fontFamily:SANS }}>
              {course.isFree ? '🎁 Free' : course.offerPrice ? (
                <span>
                  <span style={{ textDecoration:'line-through', color:'#94A3B8', marginRight:6, fontSize:'0.75rem' }}>₹{course.price || 0}</span>
                  <span>₹{course.offerPrice}</span>
                </span>
              ) : `₹${course.price || 0}`}
            </span>
          </div>

          {/* Description */}
          {(course.shortDescription || course.description) && (
            <p style={{ color:'#475569', fontSize:'0.9rem', lineHeight:1.75, fontFamily:SANS, marginBottom:16 }}>
              {course.shortDescription || course.description}
            </p>
          )}

          {/* What you'll learn */}
          {course.whatYouWillLearn?.filter(Boolean).length > 0 && (
            <div style={{ background:'rgba(217,119,6,0.04)', border:'1px solid rgba(217,119,6,0.15)', borderRadius:12, padding:'1rem', marginBottom:16 }}>
              <div style={{ fontWeight:700, color:SLATE, fontSize:'0.88rem', marginBottom:10, fontFamily:SANS }}>✦ What You'll Learn</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 12px' }}>
                {course.whatYouWillLearn.filter(Boolean).map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:7, fontSize:'0.82rem', color:'#475569', fontFamily:SANS, alignItems:'flex-start' }}>
                    <CheckCircle size={13} color='#10B981' style={{ flexShrink:0, marginTop:2 }} />{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:700, color:SLATE, fontSize:'0.88rem', marginBottom:8, fontFamily:SANS }}>Prerequisites</div>
              {course.prerequisites.filter(Boolean).map((p, i) => (
                <div key={i} style={{ fontSize:'0.82rem', color:MUTED, fontFamily:SANS, marginBottom:4 }}>• {p}</div>
              ))}
            </div>
          )}

          {/* Instructor */}
          {course.instructor?.name && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px', background:'#F8FAFC', borderRadius:10, marginBottom:16 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
                {course.instructor.name[0]}
              </div>
              <div>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:SLATE, fontFamily:SANS }}>{course.instructor.name}</div>
                {course.instructor.bio && <div style={{ fontSize:'0.75rem', color:MUTED, fontFamily:SANS }}>{course.instructor.bio.substring(0,80)}...</div>}
              </div>
            </div>
          )}

          {/* Enroll button */}
          <div style={{ display:'flex', gap:12 }}>
            {enrolled ? (
              <div style={{ flex:1, textAlign:'center', padding:'13px', borderRadius:12, background:'#ECFDF5', border:'1px solid #A7F3D0', color:'#065F46', fontWeight:700, fontSize:'0.9rem', fontFamily:SANS }}>
                ✓ Already Enrolled
              </div>
            ) : (
              <button
                onClick={() => onEnroll(course._id, course.title)}
                disabled={enrolling}
                style={{ flex:1, padding:'13px', borderRadius:12, border:'none', background: enrolling ? '#94A3B8' : `linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', fontWeight:700, fontSize:'0.9rem', cursor: enrolling ? 'not-allowed' : 'pointer', fontFamily:SANS }}>
                {enrolling ? 'Enrolling...' : '🎵 Enroll Now'}
              </button>
            )}
            <button onClick={onClose}
              style={{ padding:'13px 20px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', color:SLATE, fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:SANS }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────────────────── */
const UserCoursesPage = () => {
  const [courses, setCourses]           = useState([]);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [enrollingId, setEnrollingId]   = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => { fetchCourses(); fetchEnrolledCourses(); }, []);

  const fetchCourses = () => {
    setLoading(true);
    axios.get('/api/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  const fetchEnrolledCourses = () => {
    axios.get('/api/user/courses', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => {
        if (r.data.success && r.data.data) {
          const ids = new Set(r.data.data.map(c => c.courseId?.toString()));
          setEnrolledCourses(ids);
        }
      })
      .catch(() => setEnrolledCourses(new Set()));
  };

  const handleEnroll = async (courseId, courseTitle) => {
    setEnrollingId(courseId);
    try {
      const res = await axios.post('/api/user/enroll', { courseId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (res.data.success) {
        setEnrolledCourses(prev => new Set([...prev, courseId.toString()]));
        setNotification({ type:'success', message:`Enrolled in "${courseTitle}"! Check My Courses.` });
        setSelectedCourse(null);
        fetchEnrolledCourses();
      }
    } catch (err) {
      if (err.response?.data?.alreadyEnrolled) {
        setEnrolledCourses(prev => new Set([...prev, courseId]));
        setNotification({ type:'success', message:`Already enrolled in "${courseTitle}"` });
      } else {
        setNotification({ type:'error', message: err.response?.data?.message || 'Failed to enroll.' });
      }
    } finally {
      setEnrollingId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Toast */}
      {notification && (
        <div style={{ position:'fixed', top:20, right:20, padding:'14px 20px', borderRadius:10, background: notification.type==='success' ? '#10B981' : '#EF4444', color:'#fff', fontFamily:SANS, fontSize:'0.9rem', fontWeight:500, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', zIndex:9998, maxWidth:320 }}>
          {notification.type==='success' ? '✓ ' : '✕ '}{notification.message}
        </div>
      )}

      {/* Modal */}
      <CourseModal
        course={selectedCourse}
        enrolled={selectedCourse ? enrolledCourses.has(selectedCourse._id?.toString()) : false}
        enrolling={enrollingId === selectedCourse?._id}
        onEnroll={handleEnroll}
        onClose={() => setSelectedCourse(null)}
      />

      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Explore Courses</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Click any course to see details and enroll</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search courses..."
        style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
        onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>No courses found.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {filtered.map((c, i) => {
            const isEnrolled = enrolledCourses.has(c._id?.toString());
            return (
              <div key={i}
                onClick={() => setSelectedCourse(c)}
                style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(217,119,6,0.14)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>

                {/* Thumbnail */}
                {c.thumbnailUrl
                  ? <img src={c.thumbnailUrl} alt={c.title} style={{ width:'100%', height:160, objectFit:'cover', display:'block' }}
                      onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  : null}
                <div style={{ width:'100%', height:160, background:`linear-gradient(135deg,${AMBER},#B45309)`, display: c.thumbnailUrl ? 'none' : 'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🎵</div>

                <div style={{ padding:'1.25rem' }}>
                  <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                    {c.level && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.level}</span>}
                    {c.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#8B5CF6', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.category}</span>}
                    {isEnrolled && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#10B981', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>✓ Enrolled</span>}
                  </div>
                  <h3 style={{ fontFamily:SERIF, fontSize:'1.1rem', fontWeight:700, color:SLATE, marginBottom:6 }}>{c.title}</h3>
                  <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, marginBottom:'1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {c.shortDescription || c.description || 'Click to view details'}
                  </p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>🕐 {c.duration || 'Self-paced'}</span>
                    <span style={{ fontSize:'0.78rem', fontWeight:700, color: c.isFree ? '#10B981' : SLATE, fontFamily:SANS }}>
                      {c.isFree ? 'Free' : c.offerPrice ? (
                        <span>
                          <span style={{ textDecoration:'line-through', color:'#94A3B8', marginRight:4, fontSize:'0.7rem' }}>₹{c.price || 0}</span>
                          <span>₹{c.offerPrice}</span>
                        </span>
                      ) : `₹${c.price || 0}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserCoursesPage;
