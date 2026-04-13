import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCourseViewer from './UserCourseViewer';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserEnrolledCoursesPage = ({ setActiveTab }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingCourse, setViewingCourse] = useState(null); // { id, title }

  useEffect(() => {
    axios.get('/api/user/courses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Show course viewer if a course is selected
  if (viewingCourse) {
    return <UserCourseViewer courseId={viewingCourse.id} courseTitle={viewingCourse.title} onBack={() => setViewingCourse(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>My Enrolled Courses</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Courses you have enrolled in</p>
      </div>

      {!loading && courses.length > 0 && (
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search enrolled courses..."
          style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
          onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
      )}

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'#fff', borderRadius:20, border:'1px solid #F1F5F9' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎵</div>
          <h3 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:8 }}>
            {search ? 'No results found' : "You haven't enrolled yet"}
          </h3>
          <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS, marginBottom:'1.5rem' }}>
            {search ? 'Try a different search term.' : 'Browse our courses and start your musical journey.'}
          </p>
          {!search && (
            <button onClick={() => setActiveTab('explore')}
              style={{ background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:SANS }}>
              Explore Courses
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {filtered.map((c, i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(217,119,6,0.14)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>
              {c.thumbnailUrl
                ? <img src={c.thumbnailUrl} alt={c.title} style={{ width:'100%', height:160, objectFit:'cover' }} />
                : <div style={{ width:'100%', height:160, background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🎵</div>
              }
              <div style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  {c.level && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.level}</span>}
                  {c.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#8B5CF6', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.category}</span>}
                  <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#10B981', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>✓ Enrolled</span>
                </div>
                <h3 style={{ fontFamily:SERIF, fontSize:'1.1rem', fontWeight:700, color:SLATE, marginBottom:6 }}>{c.title}</h3>
                <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, marginBottom:'1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.description}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>🕐 {c.duration || 'Self-paced'}</span>
                  <button
                    onClick={() => setViewingCourse({ id: c.courseId || c._id, title: c.title })}
                    style={{ background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:SANS }}>
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEnrolledCoursesPage;
