import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import {
    Music, Users, Target, Eye, Heart, GraduationCap, Award,
    Clock, Phone, Mail, Calendar, CheckCircle, BookOpen, Mic, Star, MapPin
} from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

/* ─── Animated counter hook ─────────────────────────────────────────────── */
const useCounter = (target, duration = 1800, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let t0 = null;
        const n = parseInt(target.replace(/\D/g, ''));
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

/* ─── Animated stat card with counter ────────────────────────────────────── */
const StatCard = ({ stat, delay }) => {
    const [ref, visible] = useVisible(0.2);
    const [hovered, setHovered] = useState(false);
    const count = useCounter(stat.number, 1600, visible);
    const suffix = stat.number.replace(/\d/g, '');
    
    return (
        <div ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : '#fff',
                border: `1px solid ${hovered ? '#dc2626' : '#E2E8F0'}`,
                borderRadius: 20, padding: '1.75rem', textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-8px) scale(1.05) rotateY(5deg)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.6s ease ${delay}ms, transform 0.35s ease, background 0.4s, border 0.3s, box-shadow 0.35s`,
                boxShadow: hovered ? '0 24px 56px rgba(220,38,38,0.25), 0 0 0 4px rgba(220,38,38,0.1)' : '0 2px 12px rgba(30,41,59,0.05)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
            }}>
            {/* Ripple effect on hover */}
            {hovered && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: '100%', height: '100%',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple 0.8s ease-out',
                    pointerEvents: 'none',
                }} />
            )}
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: hovered ? 'rgba(255,255,255,0.25)' : 'rgba(220,38,38,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
                transition: 'background 0.4s, transform 0.3s',
                transform: hovered ? 'scale(1.15) rotate(10deg)' : 'scale(1)',
            }}>
                <stat.icon style={{ color: hovered ? '#fff' : '#dc2626', width: 24, height: 24 }} />
            </div>
            <div style={{
                fontSize: '2.2rem', fontWeight: 800,
                color: hovered ? '#fff' : '#dc2626',
                fontFamily: "'Cormorant Garamond', serif", lineHeight: 1,
                marginBottom: '0.4rem', transition: 'color 0.3s',
            }}>{visible ? `${count}${suffix}` : `0${suffix}`}</div>
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
                background: hovered ? 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)' : '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.45)' : '#E2E8F0'}`,
                borderRadius: 20, padding: '2rem',
                boxShadow: hovered ? '0 28px 64px rgba(220,38,38,0.18), 0 0 0 3px rgba(220,38,38,0.08)' : '0 2px 16px rgba(30,41,59,0.05)',
                transform: visible ? (hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0)') : 'translateY(32px)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s, background 0.4s`,
                position: 'relative', overflow: 'hidden', cursor: 'default',
            }}>
            {/* Top accent bar with gradient animation */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: hovered ? 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)' : 'transparent',
                backgroundSize: '200% 100%',
                animation: hovered ? 'gradientShift 2s ease infinite' : 'none',
                transition: 'background 0.4s', borderRadius: '20px 20px 0 0',
            }} />
            {/* Floating background circle */}
            {hovered && (
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)',
                    animation: 'float 3s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
            )}
            <div style={{
                width: 58, height: 58, borderRadius: 16,
                background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : 'rgba(220,38,38,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
                transition: 'background 0.4s, box-shadow 0.4s, transform 0.4s',
                transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
                boxShadow: hovered ? '0 12px 32px rgba(220,38,38,0.4)' : 'none',
            }}>
                <value.icon style={{ color: hovered ? '#fff' : '#dc2626', width: 26, height: 26, transition: 'color 0.3s' }} />
            </div>
            <h3 style={{
                fontSize: '1.15rem', fontWeight: 700, color: '#1E293B',
                marginBottom: '0.6rem', fontFamily: "'Cormorant Garamond', serif",
                transition: 'color 0.3s',
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
                background: hovered ? 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)' : '#fff',
                border: `1px solid ${hovered ? 'rgba(220,38,38,0.3)' : '#E2E8F0'}`,
                borderRadius: 24, padding: '2.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0)') : 'translateY(32px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s, background 0.4s`,
                boxShadow: hovered ? '0 32px 72px rgba(220,38,38,0.18), 0 0 0 3px rgba(220,38,38,0.06)' : '0 4px 20px rgba(30,41,59,0.06)',
                position: 'relative', overflow: 'hidden',
            }}>
            {/* Top gradient bar with animation */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg,#dc2626,#ef4444,#991b1b,#dc2626)',
                backgroundSize: '200% 100%',
                animation: hovered ? 'gradientShift 3s ease infinite' : 'none',
                borderRadius: '24px 24px 0 0',
            }} />
            {/* Floating particles */}
            {hovered && (
                <>
                    <div style={{ position: 'absolute', top: '20%', left: '10%', width: 6, height: 6, borderRadius: '50%', background: 'rgba(220,38,38,0.3)', animation: 'float 2s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', top: '60%', right: '15%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(220,38,38,0.2)', animation: 'float 2.5s ease-in-out infinite 0.5s' }} />
                    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: 5, height: 5, borderRadius: '50%', background: 'rgba(220,38,38,0.25)', animation: 'float 3s ease-in-out infinite 1s' }} />
                </>
            )}
            {/* Avatar */}
            <div style={{
                width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
                border: '4px solid rgba(220,38,38,0.2)',
                boxShadow: hovered ? '0 0 0 12px rgba(220,38,38,0.12), 0 12px 32px rgba(220,38,38,0.2)' : '0 0 0 0px rgba(220,38,38,0)',
                marginBottom: '1.5rem', transition: 'box-shadow 0.4s, transform 0.4s',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', transition: 'transform 0.4s', transform: hovered ? 'scale(1.1)' : 'scale(1)' }} />
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
                            background: hovered ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.08)',
                            color: '#dc2626',
                            border: '1px solid rgba(220,38,38,0.2)',
                            padding: '4px 12px', borderRadius: 20,
                            fontSize: '0.78rem', fontWeight: 600, fontFamily: "'Lato', sans-serif",
                            transition: 'background 0.3s, transform 0.3s',
                            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                            animation: hovered ? `slideUp 0.4s ease ${i * 0.05}s both` : 'none',
                        }}>{skill}</span>
                    ))}
                </div>
            </div>
            {/* Achievements */}
            <div style={{ width: '100%' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif" }}>Achievements</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {member.achievements.map((a, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: '0.5rem', justifyContent: 'center', opacity: visible ? 1 : 0, animation: visible ? `slideUp 0.5s ease ${(i * 0.1) + 0.3}s both` : 'none' }}>
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
                border: `2px solid ${hovered ? '#dc2626' : '#E2E8F0'}`,
                borderRadius: 18, overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-8px) scale(1.05) rotateZ(2deg)' : 'translateY(0)') : 'translateY(24px)',
                transition: `opacity 0.6s ease ${(index % 5) * 60}ms, transform 0.35s ease, box-shadow 0.35s, border 0.3s`,
                boxShadow: hovered ? '0 24px 56px rgba(220,38,38,0.25), 0 0 0 4px rgba(220,38,38,0.08)' : '0 2px 12px rgba(30,41,59,0.05)',
                cursor: 'default',
                position: 'relative',
            }}>
            {/* Gradient overlay on hover */}
            {hovered && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(135deg, rgba(220,38,38,0.05) 0%, rgba(153,27,27,0.05) 100%)',
                    pointerEvents: 'none', zIndex: 1,
                }} />
            )}
            <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                <img src={inst.image} alt={inst.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                {/* Overlay gradient */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                    background: hovered ? 'linear-gradient(to top, rgba(220,38,38,0.3), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                    transition: 'background 0.3s',
                }} />
            </div>
            <div style={{ padding: '0.85rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
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
                border: `2px solid ${hovered ? 'rgba(220,38,38,0.4)' : '#E2E8F0'}`,
                borderRadius: 20, overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
                boxShadow: hovered ? '0 28px 64px rgba(220,38,38,0.2), 0 0 0 4px rgba(220,38,38,0.06)' : '0 2px 16px rgba(30,41,59,0.05)',
                position: 'relative',
            }}>
            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={facility.image} alt={facility.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.1) rotate(2deg)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: hovered ? 'linear-gradient(to top, rgba(220,38,38,0.4), transparent)' : 'linear-gradient(to top, rgba(30,41,59,0.5), transparent)', transition: 'background 0.4s' }} />
                {/* Floating icon on hover */}
                {hovered && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'rgba(220,38,38,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.8rem',
                        animation: 'scaleIn 0.3s ease both',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}>✨</div>
                )}
            </div>
            <div style={{ padding: '1.5rem', position: 'relative' }}>
                {/* Decorative corner */}
                {hovered && (
                    <div style={{
                        position: 'absolute', top: 0, right: 0,
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg, transparent 50%, rgba(220,38,38,0.1) 50%)',
                        borderRadius: '0 0 0 20px',
                    }} />
                )}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: hovered ? '#dc2626' : '#1E293B', marginBottom: '0.5rem', fontFamily: "'Cormorant Garamond', serif", transition: 'color 0.3s' }}>{facility.title}</h3>
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
                background: hovered ? 'linear-gradient(135deg, #fff 0%, #fef2f2 50%, #fff 100%)' : '#fff',
                border: `2px solid ${hovered ? 'rgba(220,38,38,0.4)' : '#E2E8F0'}`,
                borderRadius: 20, padding: '2.5rem',
                opacity: visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0)') : 'translateY(28px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s, background 0.5s`,
                boxShadow: hovered ? '0 32px 72px rgba(220,38,38,0.2), 0 0 0 4px rgba(220,38,38,0.08)' : '0 2px 16px rgba(30,41,59,0.05)',
                position: 'relative', overflow: 'hidden',
            }}>
            {/* Animated gradient bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: hovered ? 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)' : 'transparent', backgroundSize: '200% 100%', animation: hovered ? 'gradientShift 2s ease infinite' : 'none', transition: 'background 0.4s', borderRadius: '20px 20px 0 0' }} />
            {/* Shine effect */}
            {hovered && (
                <div style={{
                    position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shine 1.5s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
            )}
            {/* Floating circles */}
            {hovered && (
                <>
                    <div style={{ position: 'absolute', top: '15%', right: '10%', width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)', animation: 'float 3s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', bottom: '20%', left: '8%', width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)', animation: 'float 4s ease-in-out infinite 0.5s' }} />
                </>
            )}
            <div style={{ width: 60, height: 60, borderRadius: 16, background: hovered ? 'linear-gradient(135deg,#dc2626,#991b1b)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'background 0.4s, box-shadow 0.4s, transform 0.4s', boxShadow: hovered ? '0 12px 32px rgba(220,38,38,0.4)' : 'none', transform: hovered ? 'scale(1.15) rotate(-10deg)' : 'scale(1)', position: 'relative', zIndex: 2 }}>
                <Icon style={{ color: hovered ? '#fff' : '#dc2626', width: 28, height: 28, transition: 'color 0.3s', animation: hovered ? 'heartbeat 1.5s ease-in-out infinite' : 'none' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: hovered ? '#dc2626' : '#1E293B', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif", transition: 'color 0.3s', position: 'relative', zIndex: 2 }}>{title}</h3>
            {texts.map((t, i) => <p key={i} style={{ color: '#64748B', lineHeight: 1.8, marginBottom: i < texts.length - 1 ? '1rem' : 0, fontFamily: "'Lato', sans-serif", fontSize: '0.92rem', position: 'relative', zIndex: 2, animation: visible ? `fadeInUp 0.6s ease ${(i * 0.15) + 0.3}s both` : 'none' }}>{t}</p>)}
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
                animation: visible ? 'scaleIn 0.5s ease 0.2s both' : 'none',
            }}>{tag}</span>
            <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700,
                color: '#1E293B', fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '-0.02em', marginBottom: subtitle ? '1rem' : 0,
                animation: visible ? 'slideUp 0.6s ease 0.3s both' : 'none',
            }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 560, margin: '0 auto', lineHeight: 1.8, fontFamily: "'Lato', sans-serif", animation: visible ? 'slideUp 0.6s ease 0.4s both' : 'none' }}>{subtitle}</p>}
            <div style={{ height: 3, width: 0, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '1.2rem auto 0', animation: visible ? 'drawLine 0.8s ease 0.6s forwards' : 'none' }} />
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
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px rgba(220,38,38,0.3); }
      50%      { box-shadow: 0 0 40px rgba(220,38,38,0.6); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes rotate360 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      10%, 30% { transform: scale(1.1); }
      20%, 40% { transform: scale(0.95); }
    }
    @keyframes slideInFromLeft {
      from { opacity: 0; transform: translateX(-60px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInFromRight {
      from { opacity: 0; transform: translateX(60px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #FFF8EE; }
    ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 3px; }
    
    /* Responsive grids */
    @media (max-width: 1024px) {
      .about-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
      .about-values-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .about-instruments-grid { grid-template-columns: repeat(4, 1fr) !important; }
      .about-facilities-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .about-team-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 768px) {
      .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .about-values-grid { grid-template-columns: 1fr !important; }
      .about-instruments-grid { grid-template-columns: repeat(3, 1fr) !important; }
      .about-facilities-grid { grid-template-columns: 1fr !important; }
      .about-story-grid { grid-template-columns: 1fr !important; }
      .about-mission-grid { grid-template-columns: 1fr !important; }
      .about-location-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 480px) {
      .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .about-instruments-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const AboutUs = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.13) 0%, transparent 70%)', pointerEvents: 'none', animation: 'rotate360 60s linear infinite', transform: `translateY(${scrollY * 0.15}px)` }} />
                <div style={{ position: 'absolute', bottom: -80, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%)', pointerEvents: 'none', animation: 'rotate360 45s linear infinite reverse', transform: `translateY(${scrollY * -0.1}px)` }} />
                <div style={dotPattern} />
                {floatingNotes.map((n, i) => (
                    <span key={i} style={{ position: 'absolute', userSelect: 'none', pointerEvents: 'none', fontSize: n.size, color: '#dc2626', opacity: 0.15, top: n.top, bottom: n.bottom, left: n.left, right: n.right, animation: `floatNote 7s ease-in-out ${n.delay} infinite`, transform: `translateY(${scrollY * (i % 2 === 0 ? 0.08 : -0.08)}px)` }}>{n.note}</span>
                ))}
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem 4rem', width: '100%', position: 'relative', zIndex: 2 }}>
                    <div style={{ textAlign: 'center', animation: 'fadeUp 0.9s ease 0.1s both' }}>
                        {/* Animated icon with multiple rings */}
                        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 12px 36px rgba(220,38,38,0.4)', animation: 'glowPulse 3s ease-in-out infinite', position: 'relative', zIndex: 2 }}>🎵</div>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 100, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.3)', animation: 'ripple 2s ease-out infinite' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 100, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.2)', animation: 'ripple 2s ease-out infinite 1s' }} />
                        </div>
                        
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
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', animation: 'scaleIn 0.8s ease 0.9s both' }}>
                            <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 6px 22px rgba(220,38,38,0.42)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.55)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.42)'; }}>
                                    Get Free Enquiry
                                </button>
                            </Link>
                            <button style={{ background: 'transparent', color: '#1E293B', border: '2px solid #1E293B', borderRadius: 12, padding: '13px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', fontFamily: "'Lato', sans-serif", transition: 'background 0.3s, color 0.3s, transform 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; e.currentTarget.style.transform = 'none'; }}>
                                Download Brochure
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.8s ease 1.1s both' }}>
                            {['✓ 500+ Students Trained', '✓ 25+ Instruments', '✓ Online & Offline'].map(b => (
                                <span key={b} style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em' }}>{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ STATUS BANNER ══════════════════════════════════════════════════ */}
            <section style={{ background: 'linear-gradient(135deg, #fff 0%, #fef2f2 50%, #fff 100%)', borderBottom: '1px solid rgba(220,38,38,0.12)', padding: '1rem 0', position: 'relative', overflow: 'hidden' }}>
                {/* Animated background line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #dc2626, transparent)', animation: 'shine 3s ease-in-out infinite' }} />
                
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'slideInFromLeft 0.6s ease both' }}>
                        <div style={{ position: 'relative', width: 12, height: 12 }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulseGreen 2s ease infinite' }} />
                            <span style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderRadius: '50%', background: '#16a34a', opacity: 0.4, animation: 'pulseGreen 2s ease infinite 0.5s' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#1E293B', fontFamily: "'Lato', sans-serif", fontSize: '0.95rem' }}>Institute Currently Open</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.85rem', color: '#64748B', fontFamily: "'Lato', sans-serif" }}>
                        {[{ icon: Clock, text: 'Mon–Sat: 9 AM – 9 PM' }, { icon: Calendar, text: 'Sunday: 9 AM – 6 PM' }, { icon: Phone, text: '+91 84103 37618' }].map(({ icon: Icon, text }, i) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, animation: `fadeInUp 0.6s ease ${0.2 + (i * 0.1)}s both` }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon style={{ width: 14, height: 14, color: '#dc2626' }} />
                                </div>
                                <span style={{ fontWeight: 600 }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STATS ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#F8FAFC', position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎵 By the Numbers" title="Raadhyam in Numbers" subtitle="A decade of musical excellence, student success, and community impact." />
                    <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                        {stats.map((stat, i) => <StatCard key={i} stat={stat} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            {/* ══ INSPIRATIONAL QUOTE ════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #fef2f2 50%, #fee2e2 75%, #fef2f2 100%)', position: 'relative', overflow: 'hidden' }}>
                {/* Animated gradient orbs */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, rgba(239,68,68,0.08) 40%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, rgba(239,68,68,0.06) 40%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'float 7s ease-in-out infinite 1s' }} />
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', animation: 'pulse 6s ease-in-out infinite' }} />
                
                {/* Floating musical elements */}
                {[
                    { note: '♩', top: '12%', left: '8%', size: '2rem', delay: '0s', duration: '7s' },
                    { note: '♫', top: '18%', right: '12%', size: '2.5rem', delay: '1s', duration: '8s' },
                    { note: '♬', bottom: '20%', left: '10%', size: '2rem', delay: '2s', duration: '9s' },
                    { note: '♪', top: '60%', right: '8%', size: '1.8rem', delay: '0.5s', duration: '7.5s' },
                    { note: '𝄞', top: '35%', left: '5%', size: '3rem', delay: '1.5s', duration: '10s' },
                ].map((item, i) => (
                    <span key={i} style={{ position: 'absolute', fontSize: item.size, color: 'rgba(220,38,38,0.12)', userSelect: 'none', pointerEvents: 'none', top: item.top, bottom: item.bottom, left: item.left, right: item.right, animation: `floatNote ${item.duration} ease-in-out ${item.delay} infinite` }}>{item.note}</span>
                ))}
                
                {/* Subtle grid pattern */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
                
                {/* Top decorative line */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)' }} />
                
                <div style={{ maxWidth: 950, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    {/* Decorative quote icon with glassmorphism */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                        {/* Outer ring */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 110, height: 110, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.2)', animation: 'ripple 3s ease-out infinite' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 110, height: 110, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.15)', animation: 'ripple 3s ease-out infinite 1.5s' }} />
                        
                        {/* Main icon container */}
                        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'zoomIn 0.6s ease both, float 4s ease-in-out infinite', border: '1px solid rgba(220,38,38,0.2)' }}>
                            <div style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, #dc2626, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, fontWeight: 700 }}>"</div>
                        </div>
                    </div>
                    
                    <blockquote style={{ margin: 0, padding: 0 }}>
                        {/* Main quote text */}
                        <p style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', fontWeight: 700, color: '#1e293b', lineHeight: 1.65, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', marginBottom: '2.5rem', animation: 'fadeInUp 0.8s ease 0.2s both', position: 'relative', padding: '0 1rem' }}>
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                <span style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite', fontWeight: 800 }}>
                                    Music is the universal language of mankind.
                                </span>
                            </span>
                            <br />
                            <span style={{ color: '#475569', fontWeight: 600, fontSize: '0.95em' }}>
                                It has the power to inspire, heal, and bring people together across all boundaries.
                            </span>
                        </p>
                        
                        {/* Footer with badge */}
                        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', animation: 'fadeInUp 0.8s ease 0.4s both', flexWrap: 'wrap' }}>
                            {/* Left decorative line */}
                            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4))' }} />
                            
                            {/* Badge */}
                            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '10px 24px', borderRadius: 30, border: '2px solid rgba(220,38,38,0.25)', boxShadow: '0 4px 20px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
                                {/* Animated dot */}
                                <div style={{ position: 'relative', width: 10, height: 10 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #ef4444)', animation: 'pulse 2s ease-in-out infinite' }} />
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderRadius: '50%', background: '#dc2626', opacity: 0.4, animation: 'pulse 2s ease-in-out infinite 1s' }} />
                                </div>
                                
                                {/* Text */}
                                <cite style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #dc2626, #991b1b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Raadhyam Philosophy
                                </cite>
                                
                                {/* Shine effect */}
                                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', animation: 'shine 3s ease-in-out infinite', borderRadius: 30 }} />
                            </div>
                            
                            {/* Right decorative line */}
                            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, rgba(220,38,38,0.4), transparent)' }} />
                        </footer>
                    </blockquote>
                </div>
                
                {/* Bottom decorative line */}
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)' }} />
            </section>

            {/* ══ OUR STORY ══════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative background elements */}
                <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
                
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: '4rem' }}>
                        {/* Image side */}
                        <div style={{ position: 'relative', animation: 'slideInFromLeft 0.8s ease both' }}>
                            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Our Music Studio"
                                style={{ borderRadius: 24, boxShadow: '0 32px 80px rgba(220,38,38,0.15), 0 8px 32px rgba(30,41,59,0.1)', width: '100%', display: 'block', border: '3px solid rgba(220,38,38,0.15)', transition: 'transform 0.4s', transform: 'scale(1)' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                            {/* Decorative circles */}
                            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, background: 'rgba(220,38,38,0.15)', borderRadius: '50%', pointerEvents: 'none', animation: 'pulse 3s ease-in-out infinite' }} />
                            <div style={{ position: 'absolute', top: -20, left: -20, width: 64, height: 64, background: 'rgba(220,38,38,0.1)', borderRadius: '50%', pointerEvents: 'none', animation: 'pulse 3s ease-in-out infinite 1s' }} />
                            {/* Floating badge with enhanced design */}
                            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(255,255,255,0.98)', borderRadius: 16, padding: '12px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(10px)', animation: 'zoomIn 0.6s ease 0.5s both' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 4px 12px rgba(220,38,38,0.3)', animation: 'spin 20s linear infinite' }}>🎵</div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', letterSpacing: '0.02em' }}>Est. 2012</div>
                                    <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, letterSpacing: '0.04em' }}>10+ Years of Music</div>
                                </div>
                            </div>
                            {/* Corner accent */}
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(135deg, transparent 50%, rgba(220,38,38,0.1) 50%)', borderRadius: '0 24px 0 0' }} />
                        </div>
                        {/* Text side */}
                        <div style={{ animation: 'slideInFromRight 0.8s ease both' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Lato', sans-serif", animation: 'scaleIn 0.5s ease 0.3s both' }}>🎼 Our Journey</span>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem', letterSpacing: '-0.02em', animation: 'fadeInUp 0.6s ease 0.4s both' }}>Our Story & Journey</h2>
                            <div style={{ height: 3, width: 0, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, marginBottom: '1.5rem', animation: 'drawLine 0.8s ease 0.6s forwards' }} />
                            {[
                                "Raadhyam Musical Classes was founded in 2012 with a simple mission: to make quality music education accessible to everyone. What started as a small studio with just two instructors has now grown into a premier music institution with a thriving community of over 500 students.",
                                "Our name \"Raadhyam\" comes from the Sanskrit word for \"pleasing to the heart,\" which reflects our philosophy that music should come from the heart and bring joy to both the performer and the listener.",
                                "Over the years, we've expanded our curriculum to include 25+ instruments, launched online classes, and established annual music festivals that showcase our students' talents."
                            ].map((text, i) => (
                                <p key={i} style={{ fontSize: '1rem', color: '#64748B', marginBottom: '1.2rem', lineHeight: 1.85, fontFamily: "'Lato', sans-serif", animation: `fadeInUp 0.6s ease ${0.7 + (i * 0.1)}s both` }}>{text}</p>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1.5rem', padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.04) 100%)', borderRadius: 14, border: '2px solid rgba(220,38,38,0.2)', animation: 'fadeInUp 0.6s ease 1s both', position: 'relative', overflow: 'hidden' }}>
                                <Award style={{ color: '#dc2626', width: 26, height: 26, flexShrink: 0, animation: 'heartbeat 2s ease-in-out infinite' }} />
                                <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem', fontFamily: "'Lato', sans-serif" }}>Award-winning music education institution — Best Music School 2023</span>
                                {/* Shine effect */}
                                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', animation: 'shine 3s ease-in-out infinite' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ INSTRUMENTS ════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#F8FAFC', position: 'relative' }}>
                <div style={dotPattern} />
                {/* Decorative musical notes */}
                <div style={{ position: 'absolute', top: '10%', right: '5%', fontSize: '3rem', color: 'rgba(220,38,38,0.08)', animation: 'spin 30s linear infinite' }}>🎸</div>
                <div style={{ position: 'absolute', bottom: '15%', left: '3%', fontSize: '2.5rem', color: 'rgba(220,38,38,0.06)', animation: 'spin 25s linear infinite reverse' }}>🎹</div>
                
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎸 What We Teach" title="Instruments We Teach" subtitle="Comprehensive training in 25+ instruments across various musical traditions." />
                    <div className="about-instruments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
                        {instruments.map((inst, i) => (
                            <InstrumentCard key={i} inst={inst} index={i} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif", fontSize: '1rem', animation: 'fadeInUp 0.6s ease both' }}>...and many more! Contact us for instruments not listed here.</p>
                        <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 8px 28px rgba(220,38,38,0.4)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s', position: 'relative', overflow: 'hidden', animation: 'zoomIn 0.6s ease 0.2s both' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(220,38,38,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(220,38,38,0.4)'; }}>
                                <span style={{ position: 'relative', zIndex: 2 }}>Inquire About Other Instruments</span>
                                {/* Shine effect */}
                                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shine 3s ease-in-out infinite' }} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ FACILITIES ═════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeading tag="🏛️ Infrastructure" title="Our Facilities" subtitle="State-of-the-art infrastructure designed for optimal learning experience." />
                    <div className="about-facilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {facilities.map((f, i) => (
                            <FacilityCard key={i} facility={f} delay={i * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ MISSION & VISION ═══════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#F8FAFC', position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="🎯 Purpose" title="Our Mission & Vision" subtitle="We believe that everyone has musical potential waiting to be discovered." />
                    <div className="about-mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
                    <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
                        {values.map((v, i) => <ValueCard key={i} value={v} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            {/* ══ WHY CHOOSE US ══════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 50%, #FFFBF5 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={dotPattern} />
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '5%', right: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse 7s ease-in-out infinite 1s' }} />
                
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="⭐ Why Us" title="Why Choose Raadhyam?" subtitle="Discover what makes us the preferred choice for music education." />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: '🎓', title: 'Expert Faculty', desc: 'Learn from experienced musicians with 10+ years of teaching expertise', color: '#dc2626' },
                            { icon: '🎯', title: 'Personalized Learning', desc: 'Customized curriculum tailored to your pace and musical goals', color: '#991b1b' },
                            { icon: '🏆', title: 'Proven Track Record', desc: '500+ successful students and numerous award-winning performances', color: '#dc2626' },
                            { icon: '💻', title: 'Flexible Classes', desc: 'Both online and offline options with convenient scheduling', color: '#991b1b' },
                            { icon: '🎼', title: 'Comprehensive Curriculum', desc: 'From basics to advanced, covering theory and practical skills', color: '#dc2626' },
                            { icon: '🎤', title: 'Performance Opportunities', desc: 'Regular concerts, recitals, and competitions to build confidence', color: '#991b1b' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: '#fff',
                                borderRadius: 20,
                                padding: '2rem',
                                boxShadow: '0 4px 20px rgba(30,41,59,0.08)',
                                transition: 'transform 0.4s, box-shadow 0.4s',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `zoomIn 0.6s ease ${i * 0.1}s both`,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 48px rgba(220,38,38,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,41,59,0.08)';
                            }}>
                                {/* Corner decoration */}
                                <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `linear-gradient(135deg, transparent 50%, ${item.color}15 50%)`, borderRadius: '0 20px 0 0' }} />
                                
                                {/* Icon */}
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>{item.icon}</div>
                                
                                {/* Content */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem', fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'Lato', sans-serif", margin: 0 }}>{item.desc}</p>
                                
                                {/* Bottom accent */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TEAM ═══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#F8FAFC', position: 'relative' }}>
                <div style={dotPattern} />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
                    <SectionHeading tag="👥 The Team" title="Meet Our Founders" subtitle="The passionate musicians behind Raadhyam." />
                    <div className="about-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {teamMembers.map((m, i) => <TeamCard key={i} member={m} delay={i * 150} />)}
                    </div>
                </div>
            </section>

            {/* ══ LOCATION ═══════════════════════════════════════════════════════ */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeading tag="📍 Find Us" title="Visit Our Campus" subtitle="Come experience the music in person." />
                    <div className="about-location-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
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
            <section style={{ padding: '7rem 2rem', background: warmBg, position: 'relative', overflow: 'hidden' }}>
                <div style={dotPattern} />
                <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'rotate360 50s linear infinite', transform: `translateY(${scrollY * 0.05}px)` }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)', pointerEvents: 'none', animation: 'rotate360 40s linear infinite reverse', transform: `translateY(${scrollY * -0.03}px)` }} />
                {/* Floating particles */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(220,38,38,0.2)', animation: 'float 3s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: '60%', right: '15%', width: 10, height: 10, borderRadius: '50%', background: 'rgba(220,38,38,0.15)', animation: 'float 4s ease-in-out infinite 1s' }} />
                <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: 6, height: 6, borderRadius: '50%', background: 'rgba(220,38,38,0.25)', animation: 'float 3.5s ease-in-out infinite 0.5s' }} />
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    {/* Animated icon with rings */}
                    <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 2rem' }}>
                        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', boxShadow: '0 12px 36px rgba(220,38,38,0.4)', animation: 'glowPulse 3s ease-in-out infinite', position: 'relative', zIndex: 2 }}>🎵</div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 110, height: 110, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.3)', animation: 'ripple 2.5s ease-out infinite' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 110, height: 110, borderRadius: '50%', border: '2px solid rgba(220,38,38,0.2)', animation: 'ripple 2.5s ease-out infinite 1.2s' }} />
                    </div>
                    
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif" }}>🎵 Join Us</span>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Ready to Start Your{' '}
                        <span style={{ background: 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>Musical Journey?</span>
                    </h2>
                    <div style={{ height: 3, width: 72, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '0 auto 1.5rem' }} />
                    <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: "'Lato', sans-serif", maxWidth: 600, margin: '0 auto 2.5rem' }}>
                        Join over 500 students who have discovered their musical potential with Raadhyam. Limited spots available for {new Date().getFullYear()} batch.
                    </p>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', animation: 'scaleIn 0.8s ease 0.3s both' }}>
                        <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 44px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 6px 22px rgba(220,38,38,0.42)', fontFamily: "'Lato', sans-serif", transition: 'transform 0.25s, box-shadow 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.55)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.42)'; }}>
                                Get Free Enquiry
                            </button>
                        </Link>
                        <button style={{ background: 'transparent', color: '#1E293B', border: '2px solid #1E293B', borderRadius: 12, padding: '14px 40px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', fontFamily: "'Lato', sans-serif", transition: 'background 0.3s, color 0.3s, transform 0.25s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; e.currentTarget.style.transform = 'none'; }}>
                            Download Brochure
                        </button>
                    </div>
                    
                    {/* Trust indicators */}
                    <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.5s both' }}>
                        {[
                            { icon: '🎓', label: '500+ Students' },
                            { icon: '⭐', label: '5.0 Rating' },
                            { icon: '🏆', label: 'Award Winning' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.8rem', animation: 'bounce 2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>{item.icon}</div>
                                <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterPage />
        </div>
    );
};

export default AboutUs;
