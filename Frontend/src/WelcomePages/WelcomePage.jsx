import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

/* ── Hooks ──────────────────────────────────────────────────────────────── */
const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const n = parseInt(target);
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor(p * n));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const useVisible = (threshold = 0.15) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ── Shared design tokens ───────────────────────────────────────────────── */
const WARM_BG  = 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 40%,#FFFBF5 100%)';
const DOT_PAT  = { position:'absolute', inset:0, opacity:0.3, backgroundImage:'radial-gradient(circle,rgba(220,38,38,0.12) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' };
const RED      = '#dc2626';
const RED_DARK = '#991b1b';
const SLATE    = '#1E293B';
const MUTED    = '#64748B';
const SERIF    = "'Cormorant Garamond',Georgia,serif";
const SANS     = "'Lato',system-ui,sans-serif";

/* ── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    @keyframes floatNote{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-18px) rotate(5deg)}66%{transform:translateY(10px) rotate(-4deg)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:translateX(0)}}
    @keyframes drawLine{from{width:0}to{width:72px}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 24px rgba(220,38,38,0.25)}50%{box-shadow:0 0 48px rgba(220,38,38,0.55)}}
    .hl{animation:slideLeft .95s cubic-bezier(.22,1,.36,1) .1s both}
    .hr{animation:slideRight .95s cubic-bezier(.22,1,.36,1) .25s both}
    .fu1{animation:fadeUp .8s ease .55s both}
    .fu2{animation:fadeUp .8s ease .75s both}
    .fu3{animation:fadeUp .8s ease .95s both}
    .red-btn{background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;border:none;border-radius:12px;padding:14px 36px;font-size:1rem;font-weight:700;cursor:pointer;letter-spacing:.04em;box-shadow:0 6px 22px rgba(220,38,38,.42);font-family:'Lato',sans-serif;transition:transform .25s,box-shadow .25s;text-decoration:none;display:inline-block}
    .red-btn:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(220,38,38,.55)}
    .outline-btn{background:transparent;color:#1E293B;border:2px solid #1E293B;border-radius:12px;padding:13px 32px;font-size:1rem;font-weight:600;cursor:pointer;letter-spacing:.04em;font-family:'Lato',sans-serif;transition:background .3s,color .3s;text-decoration:none;display:inline-block}
    .outline-btn:hover{background:#1E293B;color:#fff}
    .section-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.3);color:#dc2626;padding:5px 16px;border-radius:24px;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:1rem;font-family:'Lato',sans-serif}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#F8FAFC}
    ::-webkit-scrollbar-thumb{background:#dc2626;border-radius:3px}
    @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-img{display:none!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.feat-grid{grid-template-columns:repeat(2,1fr)!important}.course-grid{grid-template-columns:repeat(2,1fr)!important}.test-grid{grid-template-columns:1fr!important}.founder-grid{grid-template-columns:1fr!important}}
    @media(max-width:540px){.feat-grid{grid-template-columns:1fr!important}.course-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}}
  `}</style>
);

/* ── Section heading (matches About page SectionHeading) ────────────────── */
const SectionHeading = ({ tag, title, subtitle }) => {
  const [ref, visible] = useVisible(0.2);
  return (
    <div ref={ref} style={{ textAlign:'center', marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(28px)', transition:'opacity .7s ease,transform .7s ease' }}>
      <span className="section-tag">{tag}</span>
      <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:700, color:SLATE, fontFamily:SERIF, letterSpacing:'-0.02em', marginBottom:subtitle?'1rem':0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:'1.05rem', color:MUTED, maxWidth:560, margin:'0 auto', lineHeight:1.8, fontFamily:SANS }}>{subtitle}</p>}
      <div style={{ height:3, width:0, background:`linear-gradient(90deg,${RED},#ef4444)`, borderRadius:2, margin:'1.2rem auto 0', animation:'drawLine 1s ease .3s forwards' }} />
    </div>
  );
};

/* ── Stat card ──────────────────────────────────────────────────────────── */
const StatCard = ({ value, suffix='', label, delay }) => {
  const [ref, visible] = useVisible(0.3);
  const num = useCounter(value, 1600, visible);
  return (
    <div ref={ref} style={{ textAlign:'center', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', transition:`opacity .7s ease ${delay}ms,transform .7s ease ${delay}ms` }}>
      <div style={{ fontSize:'2.4rem', fontWeight:800, color:RED, fontFamily:SERIF, lineHeight:1 }}>{visible?`${num}${suffix}`:`0${suffix}`}</div>
      <div style={{ color:MUTED, fontSize:'.78rem', letterSpacing:'.12em', textTransform:'uppercase', marginTop:6, fontWeight:600, fontFamily:SANS }}>{label}</div>
    </div>
  );
};

/* ── Feature card ───────────────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => {
  const [ref, visible] = useVisible(0.15);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:'#fff', border:`1px solid ${hov?'rgba(220,38,38,.45)':'#E2E8F0'}`, borderRadius:20, padding:'2rem', boxShadow:hov?'0 24px 56px rgba(30,41,59,.13)':'0 2px 16px rgba(30,41,59,.05)', transform:visible?(hov?'translateY(-8px)':'translateY(0)'):'translateY(32px)', opacity:visible?1:0, transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s`, position:'relative', overflow:'hidden', cursor:'default' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:hov?`linear-gradient(90deg,${RED},#ef4444)`:'transparent', transition:'background .4s', borderRadius:'20px 20px 0 0' }} />
      <div style={{ width:58, height:58, borderRadius:16, background:hov?`linear-gradient(135deg,${RED},${RED_DARK})`:'rgba(220,38,38,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', marginBottom:'1.25rem', transition:'background .4s,box-shadow .4s', boxShadow:hov?'0 8px 24px rgba(220,38,38,.35)':'none' }}>{icon}</div>
      <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:SLATE, marginBottom:'.6rem', fontFamily:SERIF }}>{title}</h3>
      <p style={{ color:MUTED, fontSize:'.88rem', lineHeight:1.75, margin:0, fontFamily:SANS }}>{desc}</p>
    </div>
  );
};

/* ── Course card ────────────────────────────────────────────────────────── */
const CourseCard = ({ icon, name, desc, index }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:hov?`linear-gradient(135deg,${RED},${RED_DARK})`:'#fff', border:`1px solid ${hov?RED:'#E2E8F0'}`, borderRadius:18, padding:'1.75rem', opacity:visible?1:0, transform:visible?(hov?'translateY(-6px) scale(1.02)':'translateY(0)'):'translateY(24px)', transition:`opacity .6s ease ${(index%4)*70}ms,transform .35s ease,background .4s,border .3s,box-shadow .35s`, cursor:'pointer', boxShadow:hov?'0 20px 48px rgba(30,41,59,.22)':'0 2px 12px rgba(30,41,59,.05)' }}>
      <div style={{ fontSize:'2.2rem', marginBottom:'.9rem', display:'inline-block', transform:hov?'scale(1.25) rotate(-6deg)':'scale(1)', transition:'transform .35s cubic-bezier(.34,1.56,.64,1)' }}>{icon}</div>
      <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:hov?'#fff':SLATE, marginBottom:'.5rem', fontFamily:SERIF, transition:'color .3s' }}>{name}</h3>
      <p style={{ color:hov?'rgba(255,255,255,.85)':MUTED, fontSize:'.82rem', lineHeight:1.7, margin:0, transition:'color .3s', fontFamily:SANS }}>{desc}</p>
      <div style={{ marginTop:'1rem', fontSize:'.78rem', fontWeight:700, color:'#fff', letterSpacing:'.08em', opacity:hov?1:0, transform:hov?'translateX(0)':'translateX(-10px)', transition:'opacity .3s,transform .3s' }}>EXPLORE →</div>
    </div>
  );
};

/* ── Testimonial card ───────────────────────────────────────────────────── */
const TestimonialCard = ({ name, role, text, delay }) => {
  const [ref, visible] = useVisible(0.15);
  return (
    <div ref={ref} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:'2rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(28px)', transition:`opacity .7s ease ${delay}ms,transform .7s ease ${delay}ms`, boxShadow:'0 4px 20px rgba(30,41,59,.06)', position:'relative' }}>
      <div style={{ position:'absolute', top:20, right:24, fontSize:'3rem', color:'rgba(220,38,38,.12)', fontFamily:'Georgia,serif', lineHeight:1 }}>"</div>
      <div style={{ color:RED, fontSize:'1rem', marginBottom:'.75rem', letterSpacing:2 }}>★★★★★</div>
      <p style={{ color:'#475569', fontSize:'.9rem', lineHeight:1.8, marginBottom:'1.25rem', fontStyle:'italic', fontFamily:SANS }}>"{text}"</p>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:`linear-gradient(135deg,${RED},${RED_DARK})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1rem', fontFamily:SERIF }}>{name[0]}</div>
        <div>
          <div style={{ fontWeight:700, color:SLATE, fontSize:'.9rem', fontFamily:SERIF }}>{name}</div>
          <div style={{ color:'#94A3B8', fontSize:'.75rem', letterSpacing:'.06em', fontFamily:SANS }}>{role}</div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────────────────── */
const RaadhyamHomepage = () => {

  const courses = [
    { name:'Vocal Training',     icon:'🎤', desc:'Indian Classical, Bollywood & Western vocals with voice modulation, breathing, and stage performance.' },
    { name:'String Instruments', icon:'🎸', desc:'Guitar, Violin, Sitar & Ukulele — fingerpicking, chords, ragas, melodies, and advanced techniques.' },
    { name:'Keyboard & Piano',   icon:'🎹', desc:'Classical & contemporary piano — chords, scales, sight-reading, improvisation & composition.' },
    { name:'Percussion',         icon:'🥁', desc:'Tabla, Drums, Cajon, Dholak & more. Rhythm cycles, hand techniques, coordination & performance.' },
    { name:'Wind Instruments',   icon:'🎷', desc:'Flute, Saxophone & Harmonica with breath control, notation, ragas, and western melodies.' },
    { name:'Music Theory',       icon:'🎼', desc:'Basics to advanced — notation, harmony, rhythm, scales, chords & composition beautifully structured.' },
    { name:'Online Classes',     icon:'💻', desc:'Interactive virtual sessions with live guidance, recordings, weekly assignments & personalized feedback.' },
    { name:'Advanced Courses',   icon:'⭐', desc:'Professional certification, stage performance, studio recording, mixing & mastering.' },
  ];

  const features = [
    { icon:'❤️', title:'Learn with Heart',      desc:'Every session blends emotion, expression, and mentorship — building a deep, lifelong connection with music.' },
    { icon:'🌐', title:'Online & Offline',       desc:'Learn from anywhere or join us at the studio — HD virtual classes + structured offline sessions.' },
    { icon:'🎼', title:'25+ Instruments',        desc:'Tabla, Harmonium, Sitar, Guitar, Keyboard, Drums, Violin — from beginners to advanced learners.' },
    { icon:'🏆', title:'Professional Mentors',   desc:'Trained musicians and industry experts focused on skill, creativity, performance, and discipline.' },
    { icon:'🎭', title:'Stage Performances',     desc:'Real-stage exposure through concerts, competitions, showcases, and studio recordings.' },
    { icon:'📜', title:'Certifications & Exams', desc:'Prepared for Trinity, ABRSM, Gandharva, and other prestigious music certifications.' },
  ];

  const testimonials = [
    { name:'Priya Sharma', role:'Vocal Student',  text:"Raadhyam transformed my singing completely. Sir Dheeraj's patience and deep knowledge of classical music is unmatched." },
    { name:'Arjun Mehta',  role:'Guitar Student', text:'I started from zero and within 6 months I was performing on stage. The structured curriculum is brilliant.' },
    { name:'Sneha Gupta',  role:'Piano Student',  text:'The online classes are just as effective as offline. The personalized feedback after every session is what sets Raadhyam apart.' },
  ];

  const instruments = ['🎵 Tabla','🎸 Guitar','🎹 Piano','🎷 Saxophone','🎻 Violin','🥁 Drums','🎤 Vocals','🪗 Harmonium','🎺 Trumpet','🪘 Dholak','🎼 Flute','🎵 Sitar'];

  const floatingNotes = [
    { note:'♩', top:'14%',    left:'4%',   delay:'0s',   size:'2rem' },
    { note:'♫', top:'20%',    right:'5%',  delay:'1.3s', size:'1.8rem' },
    { note:'♬', bottom:'20%', left:'8%',   delay:'2.5s', size:'1.6rem' },
    { note:'♪', top:'60%',    right:'10%', delay:'0.7s', size:'1.6rem' },
    { note:'𝄞', top:'44%',    left:'2%',   delay:'1.9s', size:'2.6rem' },
    { note:'♩', bottom:'32%', right:'3%',  delay:'3.2s', size:'1.6rem' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:SANS }}>
      <GlobalStyles />
      <NavBarpage />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'100vh', paddingTop:72, background:WARM_BG, position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', top:-120, right:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,.13) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,.09) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        {floatingNotes.map((n,i) => (
          <span key={i} style={{ position:'absolute', userSelect:'none', pointerEvents:'none', fontSize:n.size, color:RED, opacity:.15, top:n.top, bottom:n.bottom, left:n.left, right:n.right, animation:`floatNote 7s ease-in-out ${n.delay} infinite` }}>{n.note}</span>
        ))}

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 2rem 4rem', width:'100%' }}>
          <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>

            {/* Left */}
            <div className="hl">
              <span className="section-tag">🎵 Classical Music Education</span>
              <h1 style={{ fontFamily:SERIF, fontSize:'clamp(2.8rem,5vw,4.2rem)', fontWeight:700, lineHeight:1.1, color:SLATE, marginBottom:'1.2rem', letterSpacing:'-0.02em' }}>
                Discover Your{' '}
                <span style={{ background:`linear-gradient(90deg,${RED},#ef4444,${RED})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Musical</span>
                <br />Identity
              </h1>
              <div style={{ height:3, width:0, background:`linear-gradient(90deg,${RED},#ef4444)`, borderRadius:2, marginTop:14, animation:'drawLine 1s ease .7s forwards' }} />
              <p className="fu1" style={{ color:'#475569', fontSize:'1.1rem', lineHeight:1.85, margin:'1.5rem 0', maxWidth:480, fontFamily:SANS }}>
                Professional music education rooted in the Guru–Shishya tradition. Online & offline classes for all ages, all instruments, all skill levels.
              </p>
              <div className="fu2" style={{ display:'flex', gap:14, flexWrap:'wrap', marginTop:'2rem' }}>
                <Link to="/login" className="red-btn">Start Learning Today</Link>
                <Link to="/Contact-Us" className="outline-btn">Get Free Enquiry</Link>
              </div>
              <div className="fu3" style={{ display:'flex', gap:24, marginTop:'2.5rem', flexWrap:'wrap' }}>
                {['✓ Certified Instructors','✓ All Age Groups','✓ Online & Offline'].map(b => (
                  <span key={b} style={{ color:MUTED, fontSize:'.82rem', fontWeight:700, letterSpacing:'.04em', fontFamily:SANS }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className="hr hero-img" style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
              <div style={{ position:'absolute', width:'85%', height:'85%', borderRadius:'60% 40% 55% 45% / 50% 60% 40% 50%', background:`linear-gradient(135deg,rgba(220,38,38,.15),rgba(251,191,36,.1))`, zIndex:0 }} />
              <div style={{ position:'relative', zIndex:2, borderRadius:28, overflow:'hidden', boxShadow:`0 32px 80px rgba(220,38,38,.2),0 8px 32px rgba(30,41,59,.12)`, border:`3px solid rgba(220,38,38,.3)`, maxWidth:420, width:'100%' }}>
                <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=700&auto=format&fit=crop&q=80" alt="Music Learning at Raadhyam" style={{ width:'100%', display:'block', aspectRatio:'4/3', objectFit:'cover' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top,rgba(30,41,59,.75),transparent)' }} />
                <div style={{ position:'absolute', bottom:18, left:18, background:'rgba(255,255,255,.95)', borderRadius:12, padding:'10px 16px', boxShadow:'0 4px 16px rgba(0,0,0,.12)', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${RED},${RED_DARK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🎵</div>
                  <div>
                    <div style={{ fontSize:'.78rem', fontWeight:800, color:SLATE, fontFamily:SANS }}>500+ Students</div>
                    <div style={{ fontSize:'.68rem', color:RED, fontWeight:700, fontFamily:SANS }}>★★★★★ 5.0 Rated</div>
                  </div>
                </div>
                <div style={{ position:'absolute', top:16, right:16, background:`linear-gradient(135deg,${RED},${RED_DARK})`, color:'#fff', borderRadius:10, padding:'6px 14px', fontSize:'.75rem', fontWeight:700, letterSpacing:'.06em', boxShadow:'0 4px 14px rgba(220,38,38,.4)', fontFamily:SANS }}>LIVE CLASSES</div>
              </div>
              <div style={{ position:'absolute', top:'8%', left:'-5%', zIndex:3, background:'#fff', borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 28px rgba(30,41,59,.12)', border:`1px solid rgba(220,38,38,.2)`, animation:'floatNote 5s ease-in-out .5s infinite' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:4 }}>🎸</div>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:SLATE, fontFamily:SANS }}>25+ Instruments</div>
              </div>
              <div style={{ position:'absolute', bottom:'10%', right:'-4%', zIndex:3, background:'#fff', borderRadius:14, padding:'12px 16px', boxShadow:'0 8px 28px rgba(30,41,59,.12)', border:`1px solid rgba(220,38,38,.2)`, animation:'floatNote 6s ease-in-out 1.5s infinite' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:4 }}>🏆</div>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:SLATE, fontFamily:SANS }}>Certified Mentors</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="stats-grid fu3" style={{ marginTop:'5rem', paddingTop:'3rem', borderTop:'1px solid rgba(30,41,59,.08)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2rem' }}>
            <StatCard value={500} suffix="+" label="Students Trained"    delay={0} />
            <StatCard value={15}  suffix="+" label="Expert Instructors"  delay={120} />
            <StatCard value={25}  suffix="+" label="Instruments"         delay={240} />
            <StatCard value={7}   suffix="+" label="Years of Excellence" delay={360} />
          </div>
        </div>
      </section>

      {/* ══ MARQUEE STRIP ════════════════════════════════════════════════ */}
      <div style={{ background:WARM_BG, borderTop:`1px solid rgba(220,38,38,.15)`, borderBottom:`1px solid rgba(220,38,38,.15)`, padding:'14px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 22s linear infinite', width:'max-content' }}>
          {[...instruments,...instruments].map((item,i) => (
            <span key={i} style={{ color:MUTED, fontSize:'.82rem', fontWeight:600, letterSpacing:'.1em', padding:'0 2rem', whiteSpace:'nowrap', fontFamily:SANS }}>
              {item} <span style={{ color:`rgba(220,38,38,.4)`, marginLeft:'1.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHY CHOOSE ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:'#F8FAFC' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ Our Strengths" title="Why Choose Raadhyam?" subtitle="We don't just teach music — we shape musicians with care, creativity, and professional excellence." />
          <div className="feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {features.map((f,i) => <FeatureCard key={i} {...f} delay={i*80} />)}
          </div>
        </div>
      </section>

      {/* ══ FOUNDER ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:WARM_BG, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-5%', top:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Meet Our Founder" title="The Heart Behind Raadhyam" />
          <div className="founder-grid" style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'5rem', alignItems:'center' }}>
            {/* Photo */}
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(220,38,38,.15) 0%,transparent 70%)`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
              <div style={{ width:260, height:260, borderRadius:'50%', border:`3px solid rgba(220,38,38,.35)`, overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 24px 64px rgba(0,0,0,.2)', background:`linear-gradient(135deg,rgba(220,38,38,.15),rgba(30,41,59,.5))` }}>
                <img src="/founder.jpg" alt="Mr. Dheeraj Solanki" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} />
              </div>
              <div style={{ position:'absolute', bottom:-8, right:'10%', zIndex:3, background:`linear-gradient(135deg,${RED},${RED_DARK})`, color:'#fff', borderRadius:12, padding:'8px 16px', fontSize:'.78rem', fontWeight:700, letterSpacing:'.05em', boxShadow:'0 8px 24px rgba(220,38,38,.4)', fontFamily:SANS }}>Founder & Director</div>
            </div>
            {/* Content */}
            <div>
              <h3 style={{ fontFamily:SERIF, fontSize:'2.2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Mr. Dheeraj Solanki</h3>
              <p style={{ color:RED, fontSize:'.9rem', fontWeight:700, letterSpacing:'.1em', marginBottom:'1.5rem', textTransform:'uppercase', fontFamily:SANS }}>Indian Classical Musician & Music Educator</p>
              <p style={{ color:'#475569', lineHeight:1.85, marginBottom:'1.25rem', fontSize:'.95rem', fontFamily:SANS }}>
                With over 7 years of dedicated training in Indian Classical Music under the traditional Guru–Shishya Parampara, Mr. Dheeraj Solanki brings depth, discipline, and a soulful touch to his teaching style.
              </p>
              <blockquote style={{ borderLeft:`3px solid ${RED}`, paddingLeft:'1.25rem', margin:'1.75rem 0', fontFamily:SERIF, fontSize:'1.2rem', fontStyle:'italic', color:SLATE, lineHeight:1.75, background:'rgba(220,38,38,.05)', padding:'1rem 1.25rem', borderRadius:'0 12px 12px 0' }}>
                "Music is a powerful medium — it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
              </blockquote>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', marginBottom:'2rem' }}>
                {[{val:'7+ Yrs',lbl:'Classical Training'},{val:'3+ Yrs',lbl:'Professional Teaching'},{val:'10+',lbl:'Instruments Taught'}].map((s,i) => (
                  <div key={i} style={{ textAlign:'center', padding:'1rem', background:'#fff', border:`1px solid rgba(220,38,38,.25)`, borderRadius:14, boxShadow:'0 2px 12px rgba(220,38,38,.08)' }}>
                    <div style={{ fontSize:'1.5rem', fontWeight:800, color:RED, fontFamily:SERIF }}>{s.val}</div>
                    <div style={{ color:MUTED, fontSize:'.78rem', marginTop:4, fontFamily:SANS }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COURSES ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:'#F8FAFC' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ Our Programs" title="Music Programs for Every Soul" subtitle="Structured courses for all ages and skill levels — certified instructors, real-time practice, personalized feedback." />
          <div className="course-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem' }}>
            {courses.map((c,i) => <CourseCard key={i} {...c} index={i} />)}
          </div>
          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <Link to="/Courses" className="red-btn" style={{ padding:'13px 40px' }}>View All Courses</Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:WARM_BG, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Student Stories" title="What Our Students Say" subtitle="Real experiences from students who found their musical voice at Raadhyam." />
          <div className="test-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {testimonials.map((t,i) => <TestimonialCard key={i} {...t} delay={i*100} />)}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position:'absolute', left:0, right:0, top:`${20+i*14}%`, height:1, background:'rgba(30,41,59,.04)', pointerEvents:'none' }} />
        ))}
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${RED},${RED_DARK})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', margin:'0 auto 2rem', boxShadow:'0 12px 36px rgba(220,38,38,.4)', animation:'glowPulse 3s ease-in-out infinite' }}>🎵</div>
          <span className="section-tag">🎵 Join Us</span>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(2.2rem,4vw,3.2rem)', fontWeight:700, color:SLATE, letterSpacing:'-0.02em', marginBottom:'1rem', marginTop:'.5rem' }}>
            Ready to Begin Your{' '}
            <span style={{ background:`linear-gradient(90deg,${RED},#ef4444,${RED})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Musical Journey?</span>
          </h2>
          <div style={{ height:3, width:72, background:`linear-gradient(90deg,${RED},#ef4444)`, borderRadius:2, margin:'0 auto 1.5rem' }} />
          <p style={{ color:MUTED, fontSize:'1.1rem', marginBottom:'2.5rem', lineHeight:1.75, maxWidth:560, margin:'0 auto 2.5rem', fontFamily:SANS }}>
            Join hundreds of students learning music with heart at Raadhyam Musical Classes. First trial class is on us.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/login" className="red-btn" style={{ fontSize:'1.05rem', padding:'15px 44px' }}>Enroll Now</Link>
            <a href="mailto:raadhyammusicals@gmail.com" className="outline-btn" style={{ fontSize:'1rem', padding:'15px 36px' }}>✉ Email Us</a>
          </div>
          <p style={{ color:'#94A3B8', fontSize:'.82rem', marginTop:'1.75rem', letterSpacing:'.05em', fontFamily:SANS }}>raadhyammusicals@gmail.com</p>
        </div>
      </section>

      <FooterPage />
    </div>
  );
};

export default RaadhyamHomepage;
