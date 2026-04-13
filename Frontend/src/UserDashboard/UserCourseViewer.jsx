import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserCourseViewer = ({ courseId, courseTitle, onBack }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [progressPercent, setProgressPercent] = useState(0);
  const [savingLessonId, setSavingLessonId] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${courseId}`)
      .then(r => { setCourse(r.data.data); })
      .catch(() => setError('Failed to load course content.'))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`/api/user/courses/${courseId}/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const completedIds = res.data?.data?.completedLessonIds || [];
        setCompletedLessonIds(new Set(completedIds.map((id) => String(id))));
        setProgressPercent(Number(res.data?.data?.progress || 0));
      })
      .catch(() => {
        setCompletedLessonIds(new Set());
        setProgressPercent(0);
      });
  }, [courseId]);

  if (loading) return (
    <div style={{ textAlign:'center', padding:'5rem', color:MUTED, fontFamily:SANS }}>
      <div style={{ width:40, height:40, border:`3px solid ${AMBER}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 1rem' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading course...
    </div>
  );
  if (error) return (
    <div style={{ textAlign:'center', padding:'4rem' }}>
      <p style={{ color:'#EF4444', fontFamily:SANS, marginBottom:'1rem' }}>{error}</p>
      <button onClick={onBack} style={{ background:AMBER, color:'#fff', border:'none', borderRadius:10, padding:'10px 24px', cursor:'pointer', fontFamily:SANS, fontWeight:700 }}>← Back</button>
    </div>
  );

  const modules = (course?.modules || [])
    .map((mod) => {
      const lessons = (mod?.lessons || []).filter((les) => {
        const hasTitle = Boolean(les?.title && String(les.title).trim());
        const hasPlayableContent = Boolean(
          les?.videoUrl ||
          les?.pdfUrl ||
          (les?.content && String(les.content).trim()) ||
          (Array.isArray(les?.resources) && les.resources.length)
        );
        return hasTitle || hasPlayableContent;
      });

      return {
        ...mod,
        lessons,
      };
    })
    .filter((mod) => {
      const hasModuleTitle = Boolean(mod?.title && String(mod.title).trim());
      const hasModuleDescription = Boolean(mod?.description && String(mod.description).trim());
      const hasLessons = (mod?.lessons?.length || 0) > 0;
      return hasModuleTitle || hasModuleDescription || hasLessons;
    });
  const currentLesson = modules[activeModule]?.lessons?.[activeLesson];
  const totalLessonCount = modules.reduce((total, mod) => total + (mod.lessons?.length || 0), 0);
  const completedCount = Array.from(completedLessonIds).length;
  const isCurrentLessonCompleted = Boolean(currentLesson?._id && completedLessonIds.has(String(currentLesson._id)));

  const toggleLessonCompletion = async () => {
    if (!currentLesson?._id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login again to save progress.');
      return;
    }

    const nextCompleted = !isCurrentLessonCompleted;
    setSavingLessonId(String(currentLesson._id));

    try {
      const res = await axios.put(
        `/api/user/courses/${courseId}/progress`,
        {
          lessonId: String(currentLesson._id),
          completed: nextCompleted
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const ids = res.data?.data?.completedLessonIds || [];
      setCompletedLessonIds(new Set(ids.map((id) => String(id))));
      setProgressPercent(Number(res.data?.data?.progress || 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lesson progress.');
    } finally {
      setSavingLessonId(null);
    }
  };

  return (
    <div style={{ fontFamily:SANS }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'8px 16px', cursor:'pointer', fontFamily:SANS, fontWeight:700, color:SLATE, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:6 }}>
          ← Back
        </button>
        <div>
          <h1 style={{ fontFamily:SERIF, fontSize:'1.6rem', fontWeight:700, color:SLATE, margin:0 }}>{course.title}</h1>
          <p style={{ color:MUTED, fontSize:'0.82rem', margin:'2px 0 0', fontFamily:SANS }}>{course.category} · {course.level}</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'1.5rem', alignItems:'start' }} className="cv-grid">

        {/* Sidebar — module/lesson list */}
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', overflow:'hidden' }} className="cv-sidebar">
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid #F1F5F9', background:'linear-gradient(135deg,rgba(217,119,6,0.06),transparent)' }}>
            <div style={{ fontWeight:700, color:SLATE, fontSize:'0.88rem' }}>Course Content</div>
            <div style={{ color:MUTED, fontSize:'0.75rem', marginTop:2 }}>{modules.length} modules · {modules.reduce((t,m)=>t+(m.lessons?.length||0),0)} lessons</div>
            {totalLessonCount > 0 && (
              <div style={{ marginTop:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:MUTED, marginBottom:4 }}>
                  <span>{completedCount}/{totalLessonCount} completed</span>
                  <span>{progressPercent}%</span>
                </div>
                <div style={{ height:6, borderRadius:999, background:'#E2E8F0', overflow:'hidden' }}>
                  <div style={{ width:`${Math.max(0, Math.min(100, progressPercent))}%`, height:'100%', background:`linear-gradient(135deg,${AMBER},#B45309)` }}></div>
                </div>
              </div>
            )}
          </div>

          {modules.length === 0 ? (
            <div style={{ padding:'2rem', textAlign:'center', color:MUTED, fontSize:'0.85rem' }}>No content available yet.</div>
          ) : (
            <div style={{ maxHeight:500, overflowY:'auto' }}>
              {modules.map((mod, mi) => (
                <div key={mi}>
                  {/* Module header */}
                  <button onClick={() => setActiveModule(mi)}
                    style={{ width:'100%', textAlign:'left', padding:'0.85rem 1.25rem', background: activeModule===mi ? 'rgba(217,119,6,0.06)' : 'transparent', border:'none', borderBottom:'1px solid #F8FAFC', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700, color: activeModule===mi ? AMBER : SLATE, fontSize:'0.82rem' }}>
                      {mi+1}. {mod.title || `Module ${mi+1}`}
                    </span>
                    <span style={{ fontSize:'0.7rem', color:MUTED }}>{mod.lessons?.length||0} lessons</span>
                  </button>

                  {/* Lessons */}
                  {activeModule === mi && (mod.lessons||[]).map((les, li) => (
                    <button key={li} onClick={() => setActiveLesson(li)}
                      style={{ width:'100%', textAlign:'left', padding:'0.65rem 1.25rem 0.65rem 2rem', background: activeLesson===li ? `rgba(217,119,6,0.1)` : 'transparent', border:'none', borderBottom:'1px solid #F8FAFC', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:20, height:20, borderRadius:'50%', background: activeLesson===li ? AMBER : '#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color: activeLesson===li ? '#fff' : MUTED, flexShrink:0, fontWeight:700 }}>
                        {completedLessonIds.has(String(les?._id)) ? '✓' : li+1}
                      </span>
                      <span style={{ fontSize:'0.8rem', color: activeLesson===li ? AMBER : SLATE, fontWeight: activeLesson===li ? 700 : 500, lineHeight:1.3 }}>{les.title || `Lesson ${li+1}`}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div>
          {!currentLesson ? (
            /* No lesson selected — show course overview */
            <div style={{ background:'#fff', borderRadius:16, padding:'2rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)' }}>
              {course.thumbnailUrl && (
                <img src={course.thumbnailUrl} alt={course.title} style={{ width:'100%', maxHeight:280, objectFit:'cover', borderRadius:12, marginBottom:'1.5rem' }} />
              )}
              <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:8 }}>{course.title}</h2>
              {course.shortDescription && <p style={{ color:MUTED, lineHeight:1.7, marginBottom:'1.25rem', fontSize:'0.92rem' }}>{course.shortDescription}</p>}
              {course.description && <p style={{ color:'#475569', lineHeight:1.8, fontSize:'0.9rem', marginBottom:'1.5rem' }}>{course.description}</p>}

              {course.whatYouWillLearn?.filter(Boolean).length > 0 && (
                <div style={{ background:'rgba(217,119,6,0.04)', border:'1px solid rgba(217,119,6,0.15)', borderRadius:12, padding:'1.25rem', marginBottom:'1.25rem' }}>
                  <div style={{ fontWeight:700, color:SLATE, marginBottom:10, fontSize:'0.9rem' }}>✦ What You'll Learn</div>
                  {course.whatYouWillLearn.filter(Boolean).map((item,i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:6, fontSize:'0.85rem', color:'#475569' }}>
                      <span style={{ color:AMBER, flexShrink:0 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              )}

              {modules.length > 0 && (
                <button onClick={() => { setActiveModule(0); setActiveLesson(0); }}
                  style={{ background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:SANS }}>
                  Start Learning →
                </button>
              )}
            </div>
          ) : (
            /* Lesson content */
            <div style={{ background:'#fff', borderRadius:16, padding:'2rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)' }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'0.75rem', color:AMBER, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
                  Module {activeModule+1} · Lesson {activeLesson+1}
                </div>
                <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE }}>{currentLesson.title || `Lesson ${activeLesson+1}`}</h2>
              </div>

              {/* Video */}
              {currentLesson.videoUrl && (
                <div style={{ marginBottom:'1.5rem', borderRadius:12, overflow:'hidden', background:'#000', aspectRatio:'16/9' }}>
                  {currentLesson.videoUrl.includes('youtube') || currentLesson.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={currentLesson.videoUrl.replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/')}
                      style={{ width:'100%', height:'100%', border:'none' }}
                      allowFullScreen title={currentLesson.title} />
                  ) : (
                    <video controls style={{ width:'100%', height:'100%' }} src={currentLesson.videoUrl} />
                  )}
                </div>
              )}

              {/* Description */}
              {currentLesson.description && (
                <p style={{ color:'#475569', lineHeight:1.8, fontSize:'0.92rem', marginBottom:'1.5rem' }}>{currentLesson.description}</p>
              )}

              {/* Content/notes */}
              {currentLesson.content && (
                <div style={{ background:'#F8FAFC', borderRadius:12, padding:'1.25rem', marginBottom:'1.5rem', fontSize:'0.9rem', color:SLATE, lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                  {currentLesson.content}
                </div>
              )}

              {/* Resources */}
              {currentLesson.resources?.length > 0 && (
                <div style={{ marginBottom:'1.5rem' }}>
                  <div style={{ fontWeight:700, color:SLATE, marginBottom:10, fontSize:'0.88rem' }}>📎 Resources</div>
                  {currentLesson.resources.map((r,i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'rgba(217,119,6,0.06)', border:'1px solid rgba(217,119,6,0.15)', borderRadius:8, textDecoration:'none', color:AMBER, fontSize:'0.82rem', fontWeight:600, marginBottom:6 }}>
                      📥 {r.title || r.url}
                    </a>
                  ))}
                </div>
              )}

              {/* Prev / Next navigation */}
              <div style={{ display:'flex', justifyContent:'space-between', gap:12, marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid #F1F5F9' }}>
                <button
                  disabled={activeModule===0 && activeLesson===0}
                  onClick={() => {
                    if (activeLesson > 0) { setActiveLesson(l=>l-1); }
                    else if (activeModule > 0) { const pm = activeModule-1; setActiveModule(pm); setActiveLesson((modules[pm]?.lessons?.length||1)-1); }
                  }}
                  style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', color:SLATE, fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:SANS, opacity: (activeModule===0&&activeLesson===0)?0.4:1 }}>
                  ← Previous
                </button>
                <button
                  disabled={activeModule===modules.length-1 && activeLesson===(modules[activeModule]?.lessons?.length||1)-1}
                  onClick={() => {
                    const lessonCount = modules[activeModule]?.lessons?.length || 0;
                    if (activeLesson < lessonCount-1) { setActiveLesson(l=>l+1); }
                    else if (activeModule < modules.length-1) { setActiveModule(m=>m+1); setActiveLesson(0); }
                  }}
                  style={{ padding:'10px 20px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:SANS, opacity: (activeModule===modules.length-1&&activeLesson===(modules[activeModule]?.lessons?.length||1)-1)?0.4:1 }}>
                  Next →
                </button>
              </div>

              {currentLesson?._id && (
                <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end' }}>
                  <button
                    onClick={toggleLessonCompletion}
                    disabled={savingLessonId === String(currentLesson._id)}
                    style={{
                      padding:'10px 16px',
                      borderRadius:10,
                      border:'none',
                      background: isCurrentLessonCompleted ? '#10B981' : '#334155',
                      color:'#fff',
                      fontWeight:700,
                      fontSize:'0.82rem',
                      cursor:'pointer',
                      fontFamily:SANS,
                      opacity: savingLessonId === String(currentLesson._id) ? 0.7 : 1
                    }}
                  >
                    {savingLessonId === String(currentLesson._id)
                      ? 'Saving...'
                      : isCurrentLessonCompleted
                        ? 'Completed ✓ (Mark Incomplete)'
                        : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .cv-grid { display:grid; grid-template-columns:300px 1fr; gap:1.5rem; align-items:start; }
        @media(max-width:768px){
          .cv-grid { grid-template-columns:1fr !important; }
          .cv-sidebar { position:static !important; max-height:260px; overflow-y:auto; }
        }
      `}</style>
    </div>
  );
};

export default UserCourseViewer;
