import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', display:'flex', alignItems:'center', gap:16 }}>
    <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontSize:'1.8rem', fontWeight:800, color:SLATE, fontFamily:SERIF, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'0.78rem', color:MUTED, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:SANS, marginTop:4 }}>{label}</div>
    </div>
  </div>
);

const UserDashboardHome = ({ setActiveTab }) => {
  const userData = (() => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } })();
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use public courses endpoint which only shows published courses
        const coursesRes = await axios.get('/api/courses');
        setCourses(coursesRes.data.data || []);
        
        const notesRes = await axios.get('/api/music-notes');
        const notesData = notesRes.data?.data ?? notesRes.data?.notes ?? [];
        setNotes(Array.isArray(notesData) ? notesData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:`linear-gradient(135deg,${AMBER},#B45309)`, borderRadius:20, padding:'2rem 2.5rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <div style={{ position:'absolute', right:60, bottom:-60, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.85rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:SANS, marginBottom:6 }}>{greeting} 👋</p>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:'#fff', marginBottom:8 }}>
            Welcome back, {userData.name || 'Student'}!
          </h1>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.92rem', fontFamily:SANS }}>Continue your musical journey — explore courses and notes below.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        <StatCard icon="📚" label="Available Courses" value={courses.length} color={AMBER} />
        <StatCard icon="🎼" label="Music Notes" value={notes.length} color="#8B5CF6" />
        <StatCard icon="🎵" label="Instruments" value={Math.max(courses.length * 3, 1)} color="#0EA5E9" />
        <StatCard icon="⭐" label="Your Rating" value={courses.length > 0 ? "4.8" : "0.0"} color="#F59E0B" />
      </div>

      {/* Recent courses */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <h2 style={{ fontFamily:SERIF, fontSize:'1.4rem', fontWeight:700, color:SLATE }}>Available Courses</h2>
          <button onClick={() => setActiveTab('explore')} style={{ fontSize:'0.8rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:8, padding:'5px 14px', cursor:'pointer', fontFamily:SANS }}>View All →</button>
        </div>
        {courses.length === 0 ? (
          <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS, textAlign:'center', padding:'2rem 0' }}>No courses available yet.</p>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
            {courses.slice(0,4).map((c,i) => (
              <div key={i}
                onClick={() => setActiveTab('explore')}
                style={{ border:'1px solid #F1F5F9', borderRadius:12, overflow:'hidden', transition:'box-shadow 0.2s, transform 0.2s', cursor:'pointer' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 24px rgba(217,119,6,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                {c.thumbnailUrl
                  ? <img src={c.thumbnailUrl} alt={c.title} style={{ width:'100%', height:120, objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:120, background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}>🎵</div>
                }
                <div style={{ padding:'0.85rem' }}>
                  <div style={{ fontWeight:700, color:SLATE, fontSize:'0.9rem', fontFamily:SANS, marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:'0.75rem', color:MUTED, fontFamily:SANS, display:'flex', justifyContent:'space-between' }}>
                    <span>{c.level || 'All Levels'}</span>
                    <span style={{ color:AMBER, fontWeight:600 }}>{c.isFree ? 'Free' : `₹${c.price||0}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent notes */}
      <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <h2 style={{ fontFamily:SERIF, fontSize:'1.4rem', fontWeight:700, color:SLATE }}>Recent Music Notes</h2>
          <button onClick={() => setActiveTab('notes')} style={{ fontSize:'0.8rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:8, padding:'5px 14px', cursor:'pointer', fontFamily:SANS }}>View All →</button>
        </div>
        {notes.length === 0 ? (
          <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS, textAlign:'center', padding:'2rem 0' }}>No notes available yet.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {notes.slice(0,5).map((n,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'0.75rem 1rem', borderRadius:10, border:'1px solid #F1F5F9', background:'#FAFAFA' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'rgba(217,119,6,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>🎼</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, color:SLATE, fontSize:'0.88rem', fontFamily:SANS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
                  <div style={{ fontSize:'0.72rem', color:MUTED, fontFamily:SANS }}>{n.category || 'General'}</div>
                </div>
                {n.fileUrl && (
                  <a href={n.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize:'0.75rem', fontWeight:700, color:AMBER, textDecoration:'none', background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:7, padding:'4px 10px', flexShrink:0, fontFamily:SANS }}>View</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardHome;
