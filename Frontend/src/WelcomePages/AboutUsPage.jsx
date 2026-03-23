import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import {
    Music, Users, Target, Eye, Heart, GraduationCap, Award,
    Clock, Phone, Mail, Calendar, CheckCircle, BookOpen, Mic, Star, MapPin
} from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

/* ─── Intersection observer hook ────────────────────────────────────────── */
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

/* ─── Animated stat card ─────────────────────────────────────────────────── */
const StatCard = ({ stat, delay }) => {
    const [ref, visible] = useVisible(0.2);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : '#fff',
                border: `1px solid ${hovered ? '#dc2626' : '#E2E8F0'}`,
                borderRadius: 20, padding: '1.75rem', textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.6s ease ${delay}ms, transform 0.35s ease, background 0.4s, border 0.3s, box-shadow 0.35s`,
                boxShadow: hovered ? '0 20px 48px rgba(30,41,59,0.18)' : '0 2px 12px rgba(30,41,59,0.05)',
                cursor: 'default',
            }}>
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(220,38,38,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
                transition: 'background 0.4s',
            }}>
                <stat.icon style={{ color: hovered ? '#fff' : '#dc2626', width: 24, height: 24 }} />
            </div>
            <div style={{
                fontSize: '2.2rem', fontWeight: 800,
                color: hovered ? '#fff' : '#dc2626',
                fontFamily: "'Cormorant Garamond', serif", lineHeight: 1,
                marginBottom: '0.4rem', transition: 'color 0.3s',
            }}>{stat.number}</div>
            <div style={{
                fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: hovered ? 'rgba(255,255,255,0.85)' : '#64748B',
                fontFamily: "'Lato', sans-serif", transition: 'color 0.3s',
            }}>{stat.label}</div>
        </div>
    );
};

/* ─── Value card ─────────────────────────────────────────────────────────── */
const ValueCard = ({ value, delay }) => {
    const [ref, visible] = useVisible(0.15);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.45)' : '#E2E8F0'}`,
                borderRadius: 20, padding: '2rem',
                boxShadow: hovered ? '0 24px 56px rgba(30,41,59,0.13)' : '0 2px 16px rgba(30,41,59,0.05)',
                transform: visible ? (hovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(32px)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
                position: 'relative', overflow: 'hidden', cursor: 'default',
            }}>
            {/* Top accent bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: hovered ? 'linear-gradient(90deg,#dc2626,#ef4444)' : 'transparent',
                transition: 'background 0.4s', borderRadius: '20px 20px 0 0',
            }} />
            <div style={{
                width: 58, height: 58, borderRadius: 16,
                background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : 'rgba(220,38,38,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
                transition: 'background 0.4s, box-shadow 0.4s',
                boxShadow: hovered ? '0 8px 24px rgba(220,38,38,0.35)' : 'none',
            }}>
                <value.icon style={{ color: hovered ? '#fff' : '#dc2626', width: 26, height: 26 }} />
            </div>
            <h3 style={{
                fontSize: '1.15rem', fontWeight: 700, color: '#1E293B',
                marginBottom: '0.6rem', fontFamily: "'Cormorant Garamond', serif",
            }}>{value.title}</h3>
            <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.75, margin: 0, fontFamily: "'Lato', sans-serif" }}>{value.description}</p>
        </div>
    );
};

/* ─── Team member card ───────────────────────────────────────────────────── */
const TeamCard = ({ member, delay }) => {
    const [ref, visible] = useVisible(0.1);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.3)' : '#E2E8F0'}`,
                borderRadius: 24, padding: '2.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(32px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
                boxShadow: hovered ? '0 28px 64px rgba(30,41,59,0.14)' : '0 4px 20px rgba(30,41,59,0.06)',
                position: 'relative', overflow: 'hidden',
            }}>
            {/* Top gradient bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg,#dc2626,#ef4444,#991b1b)',
                borderRadius: '24px 24px 0 0',
            }} />
            {/* Avatar */}
            <div style={{
                width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
                border: '4px solid rgba(220,38,38,0.2)',
                boxShadow: hovered ? '0 0 0 8px rgba(220,38,38,0.1)' : '0 0 0 0px rgba(220,38,38,0)',
                marginBottom: '1.5rem', transition: 'box-shadow 0.4s',
            }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.3rem', fontFamily: "'Cormorant Garamond', serif" }}>{member.name}</h3>
            <p style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '1rem', fontFamily: "'Lato', sans-serif", textTransform: 'uppercase' }}>{member.role}</p>
            <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: 380, fontFamily: "'Lato', sans-serif" }}>{member.bio}</p>
            {/* Expertise tags */}
            <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif" }}>Expertise</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {member.expertise.map((skill, i) => (
                        <span key={i} style={{
                            background: 'rgba(220,38,38,0.08)', color: '#dc2626',
                            border: '1px solid rgba(220,38,38,0.2)',
                            padding: '4px 12px', borderRadius: 20,
                            fontSize: '0.78rem', fontWeight: 600, fontFamily: "'Lato', sans-serif",
                        }}>{skill}</span>
                    ))}
                </div>
            </div>
            {/* Achievements */}
            <div style={{ width: '100%' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif" }}>Achievements</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {member.achievements.map((a, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: '0.5rem', justifyContent: 'center' }}>
                            <CheckCircle style={{ color: '#16a34a', width: 15, height: 15, flexShrink: 0, marginTop: 2 }} />
                            <span style={{ color: '#64748B', fontSize: '0.82rem', fontFamily: "'Lato', sans-serif", textAlign: 'left' }}>{a}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

/* ─── Instrument card ────────────────────────────────────────────────────── */
const InstrumentCard = ({ inst, index }) => {
    const [ref, visible] = useVisible(0.1);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? '#dc2626' : '#E2E8F0'}`,
                borderRadius: 18, overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0)') : 'translateY(24px)',
                transition: `opacity 0.6s ease ${(index % 5) * 60}ms, transform 0.35s ease, box-shadow 0.35s, border 0.3s`,
                boxShadow: hovered ? '0 20px 48px rgba(30,41,59,0.18)' : '0 2px 12px rgba(30,41,59,0.05)',
                cursor: 'default',
            }}>
            <div style={{ height: 120, overflow: 'hidden' }}>
                <img src={inst.image} alt={inst.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
            </div>
            <div style={{ padding: '0.85rem', textAlign: 'center' }}>
                <span style={{ fontWeight: 700, color: hovered ? '#dc2626' : '#1E293B', fontSize: '0.9rem', fontFamily: "'Lato', sans-serif", transition: 'color 0.3s' }}>{inst.name}</span>
            </div>
        </div>
    );
};

/* ─── Facility card ──────────────────────────────────────────────────────── */
const FacilityCard = ({ facility, delay }) => {
    const [ref, visible] = useVisible(0.1);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.35)' : '#E2E8F0'}`,
                borderRadius: 20, overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
                boxShadow: hovered ? '0 24px 56px rgba(30,41,59,0.13)' : '0 2px 16px rgba(30,41,59,0.05)',
            }}>
            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={facility.image} alt={facility.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(30,41,59,0.5), transparent)' }} />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', fontFamily: "'Cormorant Garamond', serif" }}>{facility.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.7, fontFamily: "'Lato', sans-serif" }}>{facility.description}</p>
            </div>
        </div>
    );
};

/* ─── Mission/Vision card ────────────────────────────────────────────────── */
const MissionCard = ({ Icon, title, texts, delay }) => {
    const [ref, visible] = useVisible(0.1);
    const [hovered, setHovered] = useState(false);
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.35)' : '#E2E8F0'}`,
                borderRadius: 20, padding: '2.5rem',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
                boxShadow: hovered ? '0 24px 56px rgba(30,41,59,0.12)' : '0 2px 16px rgba(30,41,59,0.05)',
                position: 'relative', overflow: 'hidden',
            }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: hovered ? 'linear-gradient(90deg,#dc2626,#ef4444)' : 'transparent', transition: 'background 0.4s', borderRadius: '20px 20px 0 0' }} />
            <div style={{ width: 60, height: 60, borderRadius: 16, background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'background 0.4s, box-shadow 0.4s', boxShadow: hovered ? '0 8px 24px rgba(220,38,38,0.35)' : 'none' }}>
                <Icon style={{ color: hovered ? '#fff' : '#dc2626', width: 28, height: 28 }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>{title}</h3>
            {texts.map((t, i) => <p key={i} style={{ color: '#64748B', lineHeight: 1.8, marginBottom: i < texts.length - 1 ? '1rem' : 0, fontFamily: "'Lato', sans-serif", fontSize: '0.92rem' }}>{t}</p>)}
        </div>
    );
};

/* ─── Section heading ────────────────────────────────────────────────────── */
const SectionHeading = ({ tag, title, subtitle }) => {
    const [ref, visible] = useVisible(0.2);
    return (
        <div ref={ref} style={{
            textAlign: 'center', marginBottom: '3.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                color: '#dc2626', padding: '5px 16px', borderRadius: 24,
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Lato', sans-serif",
            }}>{tag}</span>
            <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700,
                color: '#1E293B', fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '-0.02em', marginBottom: subtitle ? '1rem' : 0,
            }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 560, margin: '0 auto', lineHeight: 1.8, fontFamily: "'Lato', sans-serif" }}>{subtitle}</p>}
            <div style={{ height: 3, width: 72, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '1.2rem auto 0' }} />
        </div>
    );
};

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes floatNote {
      0%,100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-18px) rotate(5deg); }
      66%      { transform: translateY(10px) rotate(-4deg); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes drawLine {
      from { width: 0; }
      to   { width: 72px; }
    }
    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(1.3); }
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #FFF8EE; }
    ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 3px; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const AboutUs = () => {

    const teamMembers = [
        {
            name: "Priya Sharma", role: "Founder & Head Instructor",
            bio: "Classically trained pianist with 15+ years of teaching experience. Master's in Music Education from Berklee College of Music. Specializes in Western classical and contemporary piano.",
            image: "/Instructor2.jpg",
            expertise: ["Piano", "Music Theory", "Composition", "Western Classical"],
            achievements: ["Grade 8 Trinity College London", "Berklee College Alumni", "15+ Years Experience"]
        },
        {
            name: "Anand Rathore", role: "Music Teacher & Classical Vocal Specialist",
            bio: "Experienced music educator with strong command over Indian classical vocal music, rhythm, and theory. Skilled in teaching and explaining musical concepts with clarity.",
            image: "/Instructor1.jpg",
            expertise: ["Classical Vocal", "Swar & Taal", "Harmonium", "Synthesizer", "Tabla", "Music Theory"],
            achievements: [
                "Teaching at Prayag Emerald Junior High School, Agra",
                "Teaching at Gayatri Tapobhoomi, Mathura",
                "Teaching at St. Andrews School, Agra",
                "Prabhakar from Prayagraj Sangeet Samiti",
                "M.A in Music from Jivaji University (2025)"
            ]
        }
    ];

    const values = [
        { icon: Heart,         title: "Passion for Music",      description: "We believe genuine love for music is the foundation of great musical education and performance." },
        { icon: Users,         title: "Student-Centered",       description: "Every student is unique. We tailor our teaching methods to individual learning styles and goals." },
        { icon: GraduationCap, title: "Excellence",             description: "We maintain the highest standards in teaching, curriculum, and student support services." },
        { icon: BookOpen,      title: "Comprehensive Learning", description: "From basic notes to advanced compositions, we cover music theory and practical skills." },
        { icon: Mic,           title: "Performance Focused",    description: "Regular recitals and concerts to build confidence and stage presence in students." },
        { icon: Star,          title: "Innovative Methods",     description: "Blending traditional teaching with modern technology and contemporary music trends." }
    ];

    const stats = [
        { number: "500+", label: "Students Trained",   icon: Users },
        { number: "15+",  label: "Expert Instructors", icon: GraduationCap },
        { number: "25+",  label: "Instruments",        icon: Music },
        { number: "10+",  label: "Years Experience",   icon: Calendar },
        { number: "45+",  label: "Annual Concerts",    icon: Mic },
        { number: "98%",  label: "Success Rate",       icon: CheckCircle }
    ];

    const facilities = [
        { title: "Soundproof Practice Rooms", description: "8 fully equipped soundproof rooms for individual and group practice sessions", image: "https://images.unsplash.com/photo-1651339764881-54e8338b185b?w=600&auto=format&fit=crop&q=60" },
        { title: "Recording Studio",          description: "Professional recording setup for students to record their progress and compositions", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
        { title: "Instrument Library",        description: "Well-maintained collection of instruments available for student practice", image: "https://plus.unsplash.com/premium_photo-1682125896993-12a1758b6cb3?w=600&auto=format&fit=crop&q=60" },
        { title: "Performance Hall",          description: "100-seat auditorium for regular student performances and recitals", image: "https://images.unsplash.com/photo-1597071692394-6661037e14ef?w=600&auto=format&fit=crop&q=60" }
    ];

    const instruments = [
        { name: "Piano",     image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&auto=format&fit=crop&q=60" },
        { name: "Guitar",    image: "https://plus.unsplash.com/premium_photo-1693169973609-342539dea9dc?w=600&auto=format&fit=crop&q=60" },
        { name: "Tabla",     image: "https://images.unsplash.com/photo-1633411988188-6e63354a9019?w=600&auto=format&fit=crop&q=60" },
        { name: "Flute",     image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=60" },
        { name: "Sitar",     image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60" },
        { name: "Drums",     image: "https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=600&auto=format&fit=crop&q=60" },
        { name: "Harmonium", image: "https://media.istockphoto.com/id/1367529261/photo/indian-classical-music.webp?a=1&b=1&s=612x612&w=0&k=20&c=CoYsfAPCP0e5nsv7-J5efD6nZu4bUFwhwZH42-TgJ1k=" },
        { name: "Vocals",    image: "https://images.unsplash.com/photo-1615748562188-07be820cff5b?w=600&auto=format&fit=crop&q=60" },
        { name: "Keyboard",  image: "https://images.unsplash.com/photo-1614978498256-94ec73df1015?w=600&auto=format&fit=crop&q=60" },
        { name: "Dholak",    image: "https://media.istockphoto.com/id/2195962108/photo/indian-traditional-drums-close-up.jpg?s=612x612&w=0&k=20&c=jqVw-ICQsZDN7z_EjPh6Aj0tlKmGhMEz6GJeI0NB2r8=" },
    ];

    const floatingNotes = [
        { note: '♩', top: '14%',    left: '3%',   delay: '0s',   size: '2rem' },
        { note: '♫', top: '22%',    right: '4%',  delay: '1.3s', size: '1.8rem' },
        { note: '♬', bottom: '25%', left: '6%',   delay: '2.5s', size: '1.6rem' },
        { note: '♪', top: '55%',    right: '8%',  delay: '0.7s', size: '1.6rem' },
        { note: '𝄞', top: '40%',    left: '1%',   delay: '1.9s', size: '2.6rem' },
        { note: '♩', bottom: '35%', right: '2%',  delay: '3.2s', size: '1.6rem' },
    ];

    /* shared section bg — warm cream matching Welcome page */
    const warmBg = 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 40%, #FFFBF5 100%)';
    const dotPattern = { position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.12) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Lato', Arial, sans-serif" }}>
            <GlobalStyles />
            <NavBarpage />

            {/* ══ HERO ══════════════════════════════════════════════════════════ */}
            <section style={{
                minHeight: '65vh', paddingTop: 70,
                background: warmBg,
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center',
            }}>
                <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -80, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={dotPattern} />
                {floatingNotes.map((n, i) => (
                    <span key={i} style={{ position: 'absolute', userSelect: 'none', pointerEvents: 'none', fontSize: n.size, color: '#dc2626', opacity: 0.15, top: n.top, bottom: n.bottom, left: n.left, right: n.right, animation: `floatNote 7s ease-in-out ${n.delay} infinite` }}>{n.note}</span>
                ))}
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem 4rem', width: '100%', position: 'relative', zIndex: 2 }}>
                    <div style={{ textAlign: 'center', animation: 'fadeUp 0.9s ease 0.1s both' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif" }}>
                            🎵 Our Story
                        </span>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 700, lineHeight: 1.1, color: '#1E293B', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
                            About{' '}
                            <span style={{ background: 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>Raadhyam</span>
                        </h1>
                        <div style={{ height: 3, width: 0, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '0 auto 1.5rem', animation: 'drawLine 1s ease 0.7s forwards' }} />
                        <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.85, maxWidth: 520, margin: '0 auto 2.5rem', fontFamily: "'Lato', sans-serif" }}>
                            Discover our journey, mission, and the passion that drives us to nurture musical talent across generations.
                        </p>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 6px 22px rgba(220,38,38,0.42)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.55)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.42)'; }}>
                                    Get Free Enquiry
                                </button>
                            </Link>
                            <button style={{ background: 'transparent', color: '#1E293B', border: '2px solid #1E293B', borderRadius: 12, padding: '13px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', fontFamily: "'Lato', sans-serif", transition: 'background 0.3s, color 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; }}>
                                Download Brochure
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {['✓ 500+ Students Trained', '✓ 25+ Instruments', '✓ Online & Offline'].map(b => (
                                <span key={b} style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em' }}>{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ STATUS BANNER ══════════════════════════════════════════════════ */}
            <section style={{ background: '#FFFBEB', borderBottom: '1px solid rgba(220,38,38,0.12)', padding: '0.9rem 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulseGreen 2s ease infinite' }} />
                        <span style={{ fontWeight: 700, color: '#1E293B', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem' }}>Institute Currently Open</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem', color: '#64748B', fontFamily: "'Lato', sans-serif" }}>
                        {[{ icon: Clock, text: 'Mon–Sat: 9 AM – 9 PM' }, { icon: Calendar, text: 'Sunday: 9 AM – 6 PM' }, { icon: Phone, text: '+91 84103 37618' }].map(({ icon: Icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Icon style={{ width: 14, height: 14, color: '#dc2626' }} />{text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STATS ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: warmBg, position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎵 By the Numbers" title="Raadhyam in Numbers" subtitle="A decade of musical excellence, student success, and community impact." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                        {stats.map((stat, i) => <StatCard key={i} stat={stat} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            {/* ══ OUR STORY ══════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: '4rem' }}>
                        {/* Image side */}
                        <div style={{ position: 'relative' }}>
                            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Our Music Studio"
                                style={{ borderRadius: 24, boxShadow: '0 32px 80px rgba(220,38,38,0.15), 0 8px 32px rgba(30,41,59,0.1)', width: '100%', display: 'block', border: '3px solid rgba(220,38,38,0.15)' }} />
                            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, background: 'rgba(220,38,38,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: -20, left: -20, width: 64, height: 64, background: 'rgba(220,38,38,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
                            {/* Floating badge */}
                            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(255,255,255,0.96)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎵</div>
                                <div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B' }}>Est. 2012</div>
                                    <div style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 700 }}>10+ Years of Music</div>
                                </div>
                            </div>
                        </div>
                        {/* Text side */}
                        <div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Lato', sans-serif" }}>🎼 Our Journey</span>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Our Story & Journey</h2>
                            <div style={{ height: 3, width: 72, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, marginBottom: '1.5rem' }} />
                            {[
                                "Raadhyam Musical Classes was founded in 2012 with a simple mission: to make quality music education accessible to everyone. What started as a small studio with just two instructors has now grown into a premier music institution with a thriving community of over 500 students.",
                                "Our name \"Raadhyam\" comes from the Sanskrit word for \"pleasing to the heart,\" which reflects our philosophy that music should come from the heart and bring joy to both the performer and the listener.",
                                "Over the years, we've expanded our curriculum to include 25+ instruments, launched online classes, and established annual music festivals that showcase our students' talents."
                            ].map((text, i) => (
                                <p key={i} style={{ fontSize: '1rem', color: '#64748B', marginBottom: '1.2rem', lineHeight: 1.85, fontFamily: "'Lato', sans-serif" }}>{text}</p>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(220,38,38,0.06)', borderRadius: 12, border: '1px solid rgba(220,38,38,0.15)' }}>
                                <Award style={{ color: '#dc2626', width: 22, height: 22, flexShrink: 0 }} />
                                <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem', fontFamily: "'Lato', sans-serif" }}>Award-winning music education institution — Best Music School 2023</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ INSTRUMENTS ════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: warmBg, position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎸 What We Teach" title="Instruments We Teach" subtitle="Comprehensive training in 25+ instruments across various musical traditions." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
                        {instruments.map((inst, i) => (
                            <InstrumentCard key={i} inst={inst} index={i} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <p style={{ color: '#64748B', marginBottom: '1.25rem', fontFamily: "'Lato', sans-serif", fontSize: '0.95rem' }}>...and many more! Contact us for instruments not listed here.</p>
                        <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 32px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 6px 22px rgba(220,38,38,0.38)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.38)'; }}>
                                Inquire About Other Instruments
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ FACILITIES ═════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeading tag="🏛️ Infrastructure" title="Our Facilities" subtitle="State-of-the-art infrastructure designed for optimal learning experience." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {facilities.map((f, i) => (
                            <FacilityCard key={i} facility={f} delay={i * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ MISSION & VISION ═══════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: warmBg, position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎯 Purpose" title="Our Mission & Vision" subtitle="We believe that everyone has musical potential waiting to be discovered." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: Target, title: 'Our Mission', texts: ["To provide exceptional music education that nurtures creativity, builds confidence, and fosters a lifelong love for music in students of all ages and skill levels through personalized attention and comprehensive curriculum.", "We strive to create a supportive environment where students can explore their musical interests and develop their unique artistic voice while maintaining the highest standards of musical excellence."] },
                            { icon: Eye,    title: 'Our Vision',  texts: ["To become the leading music education institution recognized for excellence in teaching, innovation in curriculum, and commitment to student success across India.", "We envision a world where music education is accessible to all and where every individual can experience the transformative power of music, creating a more harmonious society through the universal language of music."] }
                        ].map(({ icon: Icon, title, texts }, i) => (
                            <MissionCard key={i} Icon={Icon} title={title} texts={texts} delay={i * 150} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ VALUES ═════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeading tag="💡 Philosophy" title="Our Values & Philosophy" subtitle="The principles that guide everything we do at Raadhyam." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
                        {values.map((v, i) => <ValueCard key={i} value={v} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            {/* ══ TEAM ═══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: warmBg, position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="👥 The Team" title="Meet Our Founders" subtitle="The passionate musicians behind Raadhyam." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {teamMembers.map((m, i) => <TeamCard key={i} member={m} delay={i * 150} />)}
                    </div>
                </div>
            </section>

            {/* ══ LOCATION ═══════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeading tag="📍 Find Us" title="Visit Our Campus" subtitle="Come experience the music in person." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                        <div>
                            {[
                                { icon: MapPin, label: 'Main Campus', content: 'Raadhyam Music Institute\nAshiyana PT. Deen, Shop no.04,\nSector 7, Dayal Upadhyay Puram,\nAgra, Uttar Pradesh 282007' },
                                { icon: Phone,  label: 'Contact',     content: '+91 84103 37618\n+91 94123 18590' },
                                { icon: Mail,   label: 'Email',       content: 'raadhyammusicals@gmail.com' },
                                { icon: Clock,  label: 'Hours',       content: 'Monday – Saturday: 9:00 AM – 9:00 PM\nSunday: 9:00 AM – 6:00 PM' },
                            ].map(({ icon: Icon, label, content }, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon style={{ color: '#dc2626', width: 20, height: 20 }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>{label}</h3>
                                        <p style={{ color: '#64748B', lineHeight: 1.7, fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(30,41,59,0.1)', border: '2px solid rgba(220,38,38,0.15)', height: 400 }}>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.666687052142!2d77.95964401102849!3d27.198210876379967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747702598cee49%3A0x8c378565a19b33c5!2sRaadhyam%20Music%20Academy!5e0!3m2!1sen!2sin!4v1763693224614!5m2!1sen!2sin"
                                style={{ border: 0, width: '100%', height: '100%' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Raadhyam Music Institute Location" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA ════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: warmBg, position: 'relative', overflow: 'hidden' }}>
                <div style={dotPattern} />
                <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif" }}>🎵 Join Us</span>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Ready to Start Your{' '}
                        <span style={{ background: 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>Musical Journey?</span>
                    </h2>
                    <div style={{ height: 3, width: 72, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '0 auto 1.5rem' }} />
                    <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: "'Lato', sans-serif" }}>
                        Join over 500 students who have discovered their musical potential with Raadhyam. Limited spots available for {new Date().getFullYear()} batch.
                    </p>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 6px 22px rgba(220,38,38,0.42)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.55)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.42)'; }}>
                                Get Enquiry
                            </button>
                        </Link>
                        <button style={{ background: 'transparent', color: '#1E293B', border: '2px solid #1E293B', borderRadius: 12, padding: '13px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', fontFamily: "'Lato', sans-serif", transition: 'background 0.3s, color 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; }}>
                            Download Brochure
                        </button>
                    </div>
                </div>
            </section>

            <FooterPage />
        </div>
    );
};

export default AboutUs;
