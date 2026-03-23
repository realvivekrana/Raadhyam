import React from 'react';
import { Link } from 'react-router-dom';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

const WARM_BG = 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 40%,#FFFBF5 100%)';
const RED = '#dc2626';
const RED_DARK = '#991b1b';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS = "'Lato',system-ui,sans-serif";

const courses = [
  { name:'Vocal Training', icon:'🎤', desc:'Indian Classical, Bollywood & Western vocals with voice modulation, breathing, and stage performance.' },
  { name:'String Instruments', icon:'🎸', desc:'Guitar, Violin, Sitar & Ukulele — fingerpicking, chords, ragas, melodies, and advanced techniques.' },
  { name:'Keyboard & Piano', icon:'🎹', desc:'Classical & contemporary piano — chords, scales, sight-reading, improvisation & composition.' },
  { name:'Percussion', icon:'🥁', desc:'Tabla, Drums, Cajon, Dholak & more. Rhythm cycles, hand techniques, coordination & performance.' },
  { name:'Wind Instruments', icon:'🎷', desc:'Flute, Saxophone & Harmonica with breath control, notation, ragas, and western melodies.' },
  { name:'Music Theory', icon:'🎼', desc:'Basics to advanced — notation, harmony, rhythm, scales, chords & composition beautifully structured.' }
];

const CoursesPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: SANS }}>
      <NavBarpage />
      <section style={{ paddingTop: 72, background: WARM_BG, minHeight: '45vh', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
          <h1 style={{ fontFamily: SERIF, color: SLATE, fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '1rem' }}>Our Courses</h1>
          <p style={{ color: MUTED, fontSize: '1.1rem', maxWidth: 760, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Explore a full suite of music programs curated by professional Raadhyam instructors — all with the same warm, engaging style as the homepage.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/Notes" style={{ padding: '0.75rem 1.3rem', borderRadius: 999, textDecoration: 'none', background: 'rgba(220,38,38,0.14)', color: RED, fontWeight: 700 }}>Notes</Link>
            <Link to="/" style={{ padding: '0.75rem 1.3rem', borderRadius: 999, textDecoration: 'none', background: '#fff', color: SLATE, fontWeight: 700, border:'1px solid rgba(30,41,59,.1)' }}>Home</Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap: '1rem' }}>
          {courses.map((course, idx) => (
            <article key={idx} style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 12px 30px rgba(30,41,59,.08)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{course.icon}</div>
              <h3 style={{ margin: '0 0 0.55rem', color: SLATE, fontFamily: SERIF, fontSize:'1.2rem', fontWeight:700 }}>{course.name}</h3>
              <p style={{ margin:0, color: MUTED, lineHeight:1.7, fontSize:'.92rem' }}>{course.desc}</p>
              <div style={{ marginTop:'1.1rem' }}>
                <span style={{ display:'inline-block', color:'#fff', background:`linear-gradient(135deg,${RED},${RED_DARK})`, padding:'0.45rem 0.9rem', borderRadius:12, fontSize:'.8rem', fontWeight:700 }}>
                  Enroll Now
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FooterPage />
    </div>
  );
};

export default CoursesPage;
