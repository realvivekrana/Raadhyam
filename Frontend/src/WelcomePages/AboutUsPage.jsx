import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Award, Clock, Music, GraduationCap, Heart, Target, Eye, BookOpen, Star, Mic } from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

/* ── Design tokens — identical to WelcomePage ─────────────────────────── */
const AMBER      = '#D97706';
const AMBER_DARK = '#B45309';
const SLATE      = '#1E293B';
const MUTED      = '#64748B';
const WARM_BG    = 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 40%,#FFFBF5 100%)';
const DOT_PAT    = { position:'absolute', inset:0, opacity:0.3, backgroundImage:'radial-gradient(circle,rgba(217,119,6,0.12) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' };
const SERIF      = "'Cormorant Garamond',Georgia,serif";
const SANS       = "'Lato',system-ui,sans-serif";

/* ── Hooks ─────────────────────────────────────────────────────────────── */
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

const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const n = parseInt(String(target).replace(/\D/g, ''));
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

/* ── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    @keyframes floatNote{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-18px) rotate(5deg)}66%{transform:translateY(10px) rotate(-4deg)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes drawLine{from{width:0}to{width:72px}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .section-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(217,119,6,.1);border:1px solid rgba(217,119,6,.3);color:${AMBER};padding:5px 16px;border-radius:24px;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:1rem;font-family:'Lato',sans-serif}
    .amber-btn{background:linear-gradient(135deg,${AMBER},${AMBER_DARK});color:#fff;border:none;border-radius:12px;padding:14px 36px;font-size:1rem;font-weight:700;cursor:pointer;letter-spacing:.04em;box-shadow:0 6px 22px rgba(217,119,6,.42);font-family:'Lato',sans-serif;transition:transform .25s,box-shadow .25s;text-decoration:none;display:inline-block}
    .amber-btn:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(217,119,6,.55)}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#FFF8EE}
    ::-webkit-scrollbar-thumb{background:${AMBER};border-radius:3px}
    @media(max-width:900px){
      .about-hero-grid{grid-template-columns:1fr!important}
      .about-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-values-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-team-grid{grid-template-columns:1fr!important}
      .about-mission-grid{grid-template-columns:1fr!important}
      .about-instruments-grid{grid-template-columns:repeat(3,1fr)!important}
    }
    @media(max-width:540px){
      .about-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-values-grid{grid-template-columns:1fr!important}
      .about-instruments-grid{grid-template-columns:repeat(2,1fr)!important}
    }
  `}</style>
);

/* ── Reusable section heading ───────────────────────────────────────────── */
const SectionHeading = ({ tag, title, subtitle }) => {
  const [ref, visible] = useVisible(0.2);
  return (
    <div ref={ref} style={{ textAlign:'center', marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(28px)', transition:'opacity .7s ease,transform .7s ease' }}>
      <span className="section-tag">{tag}</span>
      <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:700, color:SLATE, fontFamily:SERIF, letterSpacing:'-0.02em', marginBottom:subtitle?'1rem':0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:'1.05rem', color:MUTED, maxWidth:560, margin:'0 auto', lineHeight:1.8, fontFamily:SANS }}>{subtitle}</p>}
      <div style={{ height:3, width:0, background:`linear-gradient(90deg,${AMBER},#F59E0B)`, borderRadius:2, margin:'1.2rem auto 0', animation:visible?'drawLine 1s ease .3s forwards':'none' }} />
    </div>
  );
};

/* ── Stat card ──────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, number, label, delay }) => {
  const [ref, visible] = useVisible(0.2);
  const [hov, setHov] = useState(false);
  const count = useCounter(number, 1600, visible);
  const suffix = String(number).replace(/\d/g, '');
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:'#fff', border:`1px solid ${hov?AMBER:'#E2E8F0'}`, borderRadius:20, padding:'1.75rem', textAlign:'center', opacity:visible?1:0, transform:visible?(hov?'translateY(-8px) scale(1.05)':'translateY(0)'):'translateY(28px)', transition:`opacity .6s ease ${delay}ms,transform .35s ease,background .4s,border .3s,box-shadow .35s`, boxShadow:hov?`0 24px 56px rgba(217,119,6,0.25)`:'0 2px 12px rgba(30,41,59,.05)', cursor:'default', position:'relative', overflow:'hidden' }}>
      <div style={{ width:52, height:52, borderRadius:14, background:hov?'rgba(255,255,255,0.25)':`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', transition:'background .4s,transform .3s', transform:hov?'scale(1.15) rotate(10deg)':'scale(1)' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:24, height:24 }} />
      </div>
      <div style={{ fontSize:'2.2rem', fontWeight:800, color:hov?'#fff':AMBER, fontFamily:SERIF, lineHeight:1, marginBottom:'0.4rem', transition:'color .3s' }}>{visible?`${count}${suffix}`:`0${suffix}`}</div>
      <div style={{ fontSize:'.78rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:hov?'rgba(255,255,255,.85)':MUTED, fontFamily:SANS, transition:'color .3s' }}>{label}</div>
    </div>
  );
};

/* ── Value card ─────────────────────────────────────────────────────────── */
const ValueCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, visible] = useVisible(0.15);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'#fff', border:`1px solid ${hov?`rgba(217,119,6,.45)`:'#E2E8F0'}`, borderRadius:20, padding:'2rem', boxShadow:hov?`0 28px 64px rgba(217,119,6,.18)`:'0 2px 16px rgba(30,41,59,.05)', transform:visible?(hov?'translateY(-10px) scale(1.02)':'translateY(0)'):'translateY(32px)', opacity:visible?1:0, transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s`, position:'relative', overflow:'hidden', cursor:'default' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:hov?`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`:'transparent', backgroundSize:'200% 100%', animation:hov?'gradientShift 2s ease infinite':'none', transition:'background .4s', borderRadius:'20px 20px 0 0' }} />
      <div style={{ width:58, height:58, borderRadius:16, background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem', transition:'background .4s,box-shadow .4s,transform .4s', transform:hov?'scale(1.1) rotate(-5deg)':'scale(1)', boxShadow:hov?`0 12px 32px rgba(217,119,6,.4)`:'none' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:26, height:26, transition:'color .3s' }} />
      </div>
      <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:'.6rem', fontFamily:SERIF }}>{title}</h3>
      <p style={{ color:MUTED, fontSize:'.88rem', lineHeight:1.75, margin:0, fontFamily:SANS }}>{description}</p>
    </div>
  );
};

/* ── Team card ──────────────────────────────────────────────────────────── */
const TeamCard = ({ member, delay }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'#fff', border:`1px solid ${hov?`rgba(217,119,6,.3)`:'#E2E8F0'}`, borderRadius:24, padding:'2.5rem', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', opacity:visible?1:0, transform:visible?(hov?'translateY(-8px) scale(1.02)':'translateY(0)'):'translateY(32px)', transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s`, boxShadow:hov?`0 32px 72px rgba(217,119,6,.18)`:'0 4px 20px rgba(30,41,59,.06)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER_DARK},${AMBER})`, backgroundSize:'200% 100%', animation:hov?'gradientShift 3s ease infinite':'none', borderRadius:'24px 24px 0 0' }} />
      <div style={{ width:160, height:160, borderRadius:'50%', overflow:'hidden', border:`4px solid rgba(217,119,6,.2)`, boxShadow:hov?`0 0 0 12px rgba(217,119,6,.12),0 12px 32px rgba(217,119,6,.2)`:'0 0 0 0px rgba(217,119,6,0)', marginBottom:'1.5rem', transition:'box-shadow .4s,transform .4s', transform:hov?'scale(1.05)':'scale(1)' }}>
        <img src={member.image} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', transition:'transform .4s', transform:hov?'scale(1.1)':'scale(1)' }} />
      </div>
      <h3 style={{ fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:'.3rem', fontFamily:SERIF }}>{member.name}</h3>
      <p style={{ color:AMBER, fontWeight:700, fontSize:'.85rem', letterSpacing:'.06em', marginBottom:'1rem', fontFamily:SANS, textTransform:'uppercase' }}>{member.role}</p>
      <p style={{ color:MUTED, fontSize:'.9rem', lineHeight:1.8, marginBottom:'1.5rem', maxWidth:380, fontFamily:SANS }}>{member.bio}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginBottom:'1.25rem' }}>
        {member.expertise.map((s, i) => (
          <span key={i} style={{ background:`rgba(217,119,6,${hov?.12:.08})`, color:AMBER, border:`1px solid rgba(217,119,6,.2)`, padding:'4px 12px', borderRadius:20, fontSize:'.78rem', fontWeight:600, fontFamily:SANS }}>{s}</span>
        ))}
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:0, width:'100%' }}>
        {member.achievements.map((a, i) => (
          <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:'.5rem', justifyContent:'center' }}>
            <CheckCircle style={{ color:'#16a34a', width:15, height:15, flexShrink:0, marginTop:2 }} />
            <span style={{ color:MUTED, fontSize:'.82rem', fontFamily:SANS, textAlign:'left' }}>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── Mission/Vision card ────────────────────────────────────────────────── */
const MissionCard = ({ icon: Icon, title, texts, delay }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?`linear-gradient(135deg,#fff 0%,#FFF8EE 50%,#fff 100%)`:'#fff', border:`2px solid ${hov?`rgba(217,119,6,.4)`:'#E2E8F0'}`, borderRadius:20, padding:'2.5rem', opacity:visible?1:0, transform:visible?(hov?'translateY(-10px) scale(1.02)':'translateY(0)'):'translateY(28px)', transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s,background .5s`, boxShadow:hov?`0 32px 72px rgba(217,119,6,.2)`:'0 2px 16px rgba(30,41,59,.05)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:hov?`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`:'transparent', backgroundSize:'200% 100%', animation:hov?'gradientShift 2s ease infinite':'none', transition:'background .4s', borderRadius:'20px 20px 0 0' }} />
      <div style={{ width:60, height:60, borderRadius:16, background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', transition:'background .4s,box-shadow .4s,transform .4s', boxShadow:hov?`0 12px 32px rgba(217,119,6,.4)`:'none', transform:hov?'scale(1.15) rotate(-10deg)':'scale(1)' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:28, height:28, transition:'color .3s' }} />
      </div>
      <h3 style={{ fontSize:'1.5rem', fontWeight:700, color:hov?AMBER:SLATE, marginBottom:'1rem', fontFamily:SERIF, transition:'color .3s' }}>{title}</h3>
      {texts.map((t, i) => <p key={i} style={{ color:MUTED, lineHeight:1.8, marginBottom:i<texts.length-1?'1rem':0, fontFamily:SANS, fontSize:'.92rem' }}>{t}</p>)}
    </div>
  );
};

/* ── Main About Page ────────────────────────────────────────────────────── */
const AboutUsPage = () => {
  const floatingNotes = [
    { note:'♩', top:'14%', left:'4%',   delay:'0s',   size:'2rem' },
    { note:'♫', top:'20%', right:'5%',  delay:'1.3s', size:'1.8rem' },
    { note:'♬', bottom:'20%', left:'8%', delay:'2.5s', size:'1.6rem' },
    { note:'♪', top:'60%', right:'10%', delay:'0.7s', size:'1.6rem' },
    { note:'𝄞', top:'44%', left:'2%',   delay:'1.9s', size:'2.6rem' },
  ];

  const stats = [
    { icon: Users,         number: '500+', label: 'Students Trained' },
    { icon: GraduationCap, number: '15+',  label: 'Expert Instructors' },
    { icon: Music,         number: '25+',  label: 'Instruments' },
    { icon: Award,         number: '7+',   label: 'Years of Excellence' },
  ];

  const values = [
    { icon: Heart,         title: 'Passion for Music',      description: 'Every lesson is infused with genuine love for music — we teach with heart, not just technique.' },
    { icon: Target,        title: 'Goal-Oriented Learning',  description: 'Structured curriculum designed to take you from beginner to performer with clear milestones.' },
    { icon: Users,         title: 'Guru–Shishya Tradition',  description: 'Rooted in the ancient Indian tradition of personal mentorship and deep musical bonding.' },
    { icon: Award,         title: 'Certified Excellence',    description: 'Prepared for Trinity, ABRSM, Gandharva and other prestigious music certifications.' },
    { icon: Eye,           title: 'Stage Exposure',          description: 'Real performance opportunities through concerts, competitions, and studio recordings.' },
    { icon: BookOpen,      title: 'Holistic Education',      description: 'Theory, practice, history, and performance — a complete musical education for every student.' },
  ];

  const team = [
    {
      name: 'Mr. Dheeraj Solanki',
      role: 'Founder & Director',
      bio: 'With over 7 years of dedicated training in Indian Classical Music under the Guru–Shishya Parampara, Mr. Dheeraj brings depth, discipline, and a soulful touch to every lesson.',
      image: '/founder.jpg',
      expertise: ['Indian Classical', 'Guitar', 'Harmonium', 'Music Theory'],
      achievements: ['7+ years classical training', '3+ years professional teaching', '10+ instruments mastered'],
    },
    {
      name: 'Ms. Priya Sharma',
      role: 'Vocal & Keyboard Instructor',
      bio: 'A trained Hindustani vocalist and keyboard artist with a passion for blending classical roots with contemporary expression.',
      image: '/Instructor1.jpg',
      expertise: ['Hindustani Vocals', 'Keyboard', 'Bollywood', 'Western'],
      achievements: ['Performed at 50+ events', 'Trinity Grade 8 certified', '200+ students trained'],
    },
    {
      name: 'Mr. Arjun Mehta',
      role: 'Guitar & Percussion Instructor',
      bio: 'A versatile musician specializing in guitar and percussion, bringing energy and precision to every session.',
      image: '/Instructor2.jpg',
      expertise: ['Guitar', 'Tabla', 'Drums', 'Cajon'],
      achievements: ['15+ years performance experience', 'ABRSM certified', 'Studio recording artist'],
    },
  ];

  const instruments = [
    { name: 'Guitar',     emoji: '🎸', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=80' },
    { name: 'Piano',      emoji: '🎹', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&auto=format&fit=crop&q=80' },
    { name: 'Violin',     emoji: '🎻', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&auto=format&fit=crop&q=80' },
    { name: 'Tabla',      emoji: '🥁', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&auto=format&fit=crop&q=80' },
    { name: 'Vocals',     emoji: '🎤', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80' },
    { name: 'Drums',      emoji: '🥁', image: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=400&auto=format&fit=crop&q=80' },
    { name: 'Harmonium',  emoji: '🪗', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80' },
    { name: 'Flute',      emoji: '🎼', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&auto=format&fit=crop&q=80' },
    { name: 'Sitar',      emoji: '🎵', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80' },
    { name: 'Ukulele',    emoji: '🎸', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80' },
    { name: 'Saxophone',  emoji: '🎷', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&auto=format&fit=crop&q=80' },
    { name: 'Cajon',      emoji: '🪘', image: 'https://images.unsplash.com/photo-1571327073757-71d13c9e04b8?w=400&auto=format&fit=crop&q=80' },
  ];

  const marqueeItems = ['🎵 Tabla','🎸 Guitar','🎹 Piano','🎷 Saxophone','🎻 Violin','🥁 Drums','🎤 Vocals','🪗 Harmonium','🎺 Trumpet','🪘 Dholak','🎼 Flute','🎵 Sitar'];

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:SANS }}>
      <GlobalStyles />
      <NavBarpage />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'80vh', paddingTop:72, background:WARM_BG, position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', top:-120, right:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.13) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.09) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        {floatingNotes.map((n, i) => (
          <span key={i} style={{ position:'absolute', userSelect:'none', pointerEvents:'none', fontSize:n.size, color:AMBER, opacity:.15, top:n.top, bottom:n.bottom, left:n.left, right:n.right, animation:`floatNote 7s ease-in-out ${n.delay} infinite` }}>{n.note}</span>
        ))}
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 2rem 4rem', width:'100%', textAlign:'center' }}>
          <span className="section-tag">✦ Our Story</span>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(2.8rem,5vw,4.2rem)', fontWeight:700, lineHeight:1.1, color:SLATE, marginBottom:'1.2rem', letterSpacing:'-0.02em' }}>
            About{' '}
            <span style={{ background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Raadhyam</span>
          </h1>
          <div style={{ height:3, width:0, background:`linear-gradient(90deg,${AMBER},#F59E0B)`, borderRadius:2, margin:'0 auto 1.5rem', animation:'drawLine 1s ease .5s forwards' }} />
          <p style={{ color:'#475569', fontSize:'1.1rem', lineHeight:1.85, maxWidth:640, margin:'0 auto 2.5rem', fontFamily:SANS }}>
            A music school rooted in the Guru–Shishya tradition, dedicated to nurturing every student's unique musical voice through professional education, personal mentorship, and real-world performance.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <Link to="/login" className="amber-btn">Start Learning Today</Link>
            <Link to="/Contact-Us" style={{ background:'transparent', color:SLATE, border:`2px solid ${SLATE}`, borderRadius:12, padding:'13px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', letterSpacing:'.04em', fontFamily:SANS, transition:'background .3s,color .3s', textDecoration:'none', display:'inline-block' }}
              onMouseEnter={e => { e.target.style.background = SLATE; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = SLATE; }}>
              Get Free Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════ */}
      <div style={{ background:'#fff', borderTop:`1px solid rgba(217,119,6,.15)`, borderBottom:`1px solid rgba(217,119,6,.15)`, padding:'14px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 22s linear infinite', width:'max-content' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ color:MUTED, fontSize:'.82rem', fontWeight:600, letterSpacing:'.1em', padding:'0 2rem', whiteSpace:'nowrap', fontFamily:SANS }}>
              {item} <span style={{ color:`rgba(217,119,6,.4)`, marginLeft:'1.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#F8FAFC' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ Our Impact" title="Raadhyam by the Numbers" subtitle="Years of dedication, hundreds of students, and a legacy of musical excellence." />
          <div className="about-stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION ══════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Our Purpose" title="Mission & Vision" subtitle="What drives us every single day." />
          <div className="about-mission-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
            <MissionCard icon={Target} title="Our Mission" delay={0} texts={[
              'To provide world-class music education rooted in the Guru–Shishya tradition, making quality musical training accessible to every aspiring musician regardless of age or background.',
              'We believe music is a universal language — and our mission is to help every student find their voice, develop their craft, and share their gift with the world.',
            ]} />
            <MissionCard icon={Eye} title="Our Vision" delay={150} texts={[
              'To become India\'s most trusted music institution — a place where tradition meets innovation, and where every student leaves not just as a musician, but as a confident, expressive artist.',
              'We envision a community of lifelong learners united by their love for music, performing on stages across the country and beyond.',
            ]} />
          </div>
        </div>
      </section>

      {/* ══ FOUNDER ═══════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-5%', top:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Meet Our Founder" title="The Heart Behind Raadhyam" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'5rem', alignItems:'center' }} className="about-hero-grid">
            {/* Photo */}
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(217,119,6,.15) 0%,transparent 70%)`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
              <div style={{ width:260, height:260, borderRadius:'50%', border:`3px solid rgba(217,119,6,.35)`, overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>
                <img src="/founder.jpg" alt="Mr. Dheeraj Solanki" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div style={{ position:'absolute', bottom:-8, right:'10%', zIndex:3, background:`linear-gradient(135deg,${AMBER},${AMBER_DARK})`, color:'#fff', borderRadius:12, padding:'8px 16px', fontSize:'.78rem', fontWeight:700, letterSpacing:'.05em', boxShadow:`0 8px 24px rgba(217,119,6,.4)`, fontFamily:SANS }}>Founder & Director</div>
            </div>
            {/* Content */}
            <div>
              <h3 style={{ fontFamily:SERIF, fontSize:'2.2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Mr. Dheeraj Solanki</h3>
              <p style={{ color:AMBER, fontSize:'.9rem', fontWeight:700, letterSpacing:'.1em', marginBottom:'1.5rem', textTransform:'uppercase', fontFamily:SANS }}>Indian Classical Musician & Music Educator</p>
              <p style={{ color:'#475569', lineHeight:1.85, marginBottom:'1.25rem', fontSize:'.95rem', fontFamily:SANS }}>
                With over 7 years of dedicated training in Indian Classical Music under the traditional Guru–Shishya Parampara, Mr. Dheeraj Solanki brings depth, discipline, and a soulful touch to his teaching style.
              </p>
              <blockquote style={{ borderLeft:`3px solid ${AMBER}`, paddingLeft:'1.25rem', margin:'1.75rem 0', fontFamily:SERIF, fontSize:'1.2rem', fontStyle:'italic', color:SLATE, lineHeight:1.75, background:`rgba(217,119,6,.05)`, padding:'1rem 1.25rem', borderRadius:'0 12px 12px 0' }}>
                "Music is a powerful medium — it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
              </blockquote>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
                {[{val:'7+ Yrs',lbl:'Classical Training'},{val:'3+ Yrs',lbl:'Professional Teaching'},{val:'10+',lbl:'Instruments Taught'}].map((s, i) => (
                  <div key={i} style={{ textAlign:'center', padding:'1rem', background:'#fff', border:`1px solid rgba(217,119,6,.25)`, borderRadius:14, boxShadow:`0 2px 12px rgba(217,119,6,.08)` }}>
                    <div style={{ fontSize:'1.5rem', fontWeight:800, color:AMBER, fontFamily:SERIF }}>{s.val}</div>
                    <div style={{ color:MUTED, fontSize:'.78rem', marginTop:4, fontFamily:SANS }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ What We Stand For" title="Our Core Values" subtitle="The principles that guide every lesson, every interaction, and every performance at Raadhyam." />
          <div className="about-values-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {values.map((v, i) => <ValueCard key={i} {...v} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Our Instructors" title="Meet the Team" subtitle="Passionate musicians and dedicated educators who bring out the best in every student." />
          <div className="about-team-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem' }}>
            {team.map((m, i) => <TeamCard key={i} member={m} delay={i * 120} />)}
          </div>
        </div>
      </section>

      {/* ══ INSTRUMENTS ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ What We Teach" title="25+ Instruments & Counting" subtitle="From classical Indian to contemporary Western — we cover it all." />
          <div className="about-instruments-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {instruments.map((inst, i) => (
              <InstrumentCard key={i} instrument={inst} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:WARM_BG, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.15) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
          <span className="section-tag">✦ Begin Your Journey</span>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:SLATE, marginBottom:'1.25rem', letterSpacing:'-0.02em' }}>
            Ready to Discover Your{' '}
            <span style={{ background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Musical Voice?</span>
          </h2>
          <p style={{ color:'#475569', fontSize:'1.05rem', lineHeight:1.85, marginBottom:'2.5rem', fontFamily:SANS }}>
            Join hundreds of students who have found their rhythm, their melody, and their confidence at Raadhyam. Your musical journey starts with a single note.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <Link to="/login" className="amber-btn">Enroll Now</Link>
            <Link to="/Contact-Us" style={{ background:'transparent', color:SLATE, border:`2px solid ${SLATE}`, borderRadius:12, padding:'13px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', letterSpacing:'.04em', fontFamily:SANS, transition:'background .3s,color .3s', textDecoration:'none', display:'inline-block' }}
              onMouseEnter={e => { e.target.style.background = SLATE; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = SLATE; }}>
              Contact Us
            </Link>
          </div>
          <div style={{ display:'flex', gap:24, marginTop:'2.5rem', flexWrap:'wrap', justifyContent:'center' }}>
            {['✓ Free Trial Class','✓ All Age Groups','✓ Online & Offline'].map(b => (
              <span key={b} style={{ color:MUTED, fontSize:'.82rem', fontWeight:700, letterSpacing:'.04em', fontFamily:SANS }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
};

/* ── Instrument card with image ─────────────────────────────────────────── */
const InstrumentCard = ({ instrument, index }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `2px solid ${hov ? AMBER : '#E2E8F0'}`,
        borderRadius: 20,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov ? 'translateY(-10px) scale(1.04)' : 'translateY(0) scale(1)'
          : 'translateY(28px) scale(0.96)',
        transition: `opacity .6s ease ${(index % 4) * 80}ms, transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, border .3s`,
        boxShadow: hov
          ? `0 20px 48px rgba(217,119,6,.28), 0 0 0 4px rgba(217,119,6,.1)`
          : '0 2px 16px rgba(30,41,59,.07)',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: `linear-gradient(135deg, #FFF8EE, #FEF3C7)` }}>
        {!imgErr ? (
          <img
            src={instrument.image}
            alt={instrument.name}
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hov ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform .5s ease',
              display: 'block',
            }}
          />
        ) : (
          /* Fallback: emoji on warm gradient */
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
            {instrument.emoji}
          </div>
        )}

        {/* Gradient overlay — always present, stronger on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hov
            ? `linear-gradient(to top, rgba(217,119,6,.55) 0%, rgba(217,119,6,.1) 60%, transparent 100%)`
            : `linear-gradient(to top, rgba(30,41,59,.35) 0%, transparent 60%)`,
          transition: 'background .4s',
        }} />

        {/* Amber top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: hov ? `linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})` : 'transparent',
          backgroundSize: '200% 100%',
          animation: hov ? 'gradientShift 2s ease infinite' : 'none',
          transition: 'background .3s',
        }} />
      </div>

      {/* Name area */}
      <div style={{
        padding: '1rem 1rem .9rem',
        textAlign: 'center',
        background: hov ? `linear-gradient(135deg, #FFF8EE, #fff)` : '#fff',
        transition: 'background .4s',
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: '.95rem',
          color: hov ? AMBER : SLATE,
          fontFamily: SANS,
          letterSpacing: '.02em',
          transition: 'color .3s',
        }}>
          {instrument.name}
        </span>
      </div>
    </div>
  );
};

export default AboutUsPage;
