import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Music,
  Users,
  Target,
  Eye,
  Heart,
  GraduationCap,
  Award,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  BookOpen,
  Mic,
  Star,
  MapPin,
} from 'lucide-react';
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;600;700&display=swap');

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.35); opacity: .55; }
    }

    .au-fade-up { animation: fadeUp .75s ease both; }
    .au-fade-up-d1 { animation: fadeUp .75s ease .12s both; }
    .au-fade-up-d2 { animation: fadeUp .75s ease .24s both; }
    .au-marquee { animation: marquee 28s linear infinite; }
    .au-pulse-dot { animation: pulseDot 2s ease infinite; }

    .au-card {
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(217,119,6,.2);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
      transition: transform .4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .4s ease, border-color .4s ease;
    }
    .au-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 2px;
      background: linear-gradient(135deg, rgba(245,158,11,.6), rgba(217,119,6,.6), rgba(180,83,9,.6));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity .4s ease;
    }
    .au-card:hover {
      transform: translateY(-12px) scale(1.02);
      border-color: rgba(217,119,6,.6);
      box-shadow: 0 28px 64px rgba(217,119,6,.18), 0 12px 24px rgba(30,41,59,.12);
    }
    .au-card:hover::before {
      opacity: 1;
    }

    .au-dark-card {
      background: linear-gradient(160deg, rgba(15,23,42,.88), rgba(30,41,59,.85));
      border: 1px solid rgba(245,158,11,.35);
      border-radius: 20px;
      box-shadow: 0 16px 36px rgba(2,6,23,.32);
      position: relative;
      overflow: hidden;
      transition: transform .4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .4s ease, border-color .4s ease, background .4s ease;
    }
    .au-dark-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: radial-gradient(circle at 50% 0%, rgba(245,158,11,.15), transparent 70%);
      opacity: 0;
      transition: opacity .4s ease;
    }
    .au-dark-card:hover {
      transform: translateY(-10px) scale(1.02);
      border-color: rgba(245,158,11,.75);
      box-shadow: 0 28px 56px rgba(245,158,11,.25), 0 12px 28px rgba(2,6,23,.45);
      background: linear-gradient(160deg, rgba(15,23,42,.92), rgba(30,41,59,.9));
    }
    .au-dark-card:hover::before {
      opacity: 1;
    }

    .au-gold-gradient {
      background: linear-gradient(135deg,#D97706,#F59E0B,#D97706);
      color: #fff;
    }

    .au-text-gradient {
      background: linear-gradient(90deg,#F59E0B,#D97706,#B45309);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Playfair Display', Georgia, serif;
    }
  `}</style>
);

const SectionHeading = ({ tag, title, subtitle }) => {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-100 text-amber-700 text-xs font-bold tracking-[0.16em] uppercase mb-4">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">{title}</h2>
      {subtitle && <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
};

const StatCard = ({ stat, delay }) => {
  const { ref, inView } = useInView(0.2);
  const [hovered, setHovered] = useState(false);
  const Icon = stat.icon;
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-dark-card p-6 text-center cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms`,
      }}
    >
      <div 
        className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-500"
        style={{
          background: hovered ? 'linear-gradient(135deg, #FCD34D, #F59E0B)' : 'rgba(251,191,36,.2)',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          boxShadow: hovered ? '0 8px 24px rgba(251,191,36,.4)' : 'none',
        }}
      >
        <Icon 
          className="w-7 h-7 transition-colors duration-300" 
          style={{ color: hovered ? '#78350F' : '#FCD34D' }}
        />
      </div>
      <p 
        className="text-3xl font-bold mb-1 transition-all duration-300"
        style={{ 
          color: hovered ? '#FCD34D' : '#FDE68A',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {stat.number}
      </p>
      <p className="text-slate-200/85 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
    </div>
  );
};

const ValueCard = ({ value, delay }) => {
  const { ref, inView } = useInView(0.15);
  const [hovered, setHovered] = useState(false);
  const Icon = value.icon;
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-card p-7 cursor-pointer relative group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms`,
      }}
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative transition-all duration-500"
        style={{
          background: hovered ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#FEF3C7',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: hovered ? '0 8px 20px rgba(245,158,11,.3)' : 'none',
        }}
      >
        <Icon 
          className="w-7 h-7 transition-all duration-300" 
          style={{ 
            color: hovered ? '#FFF' : '#B45309',
            transform: hovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </div>
      <h3 
        className="text-xl font-semibold mb-2 transition-colors duration-300"
        style={{ color: hovered ? '#D97706' : '#0F172A' }}
      >
        {value.title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-b-xl transition-all duration-500"
        style={{ 
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </div>
  );
};

const TeamCard = ({ member, delay }) => {
  const { ref, inView } = useInView(0.12);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-card p-7 cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms`,
      }}
    >
      <div 
        className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 relative"
        style={{
          border: hovered ? '4px solid #F59E0B' : '4px solid rgba(245,158,11,.3)',
          transition: 'border-color .4s ease',
          boxShadow: hovered ? '0 8px 24px rgba(245,158,11,.4), 0 0 0 8px rgba(245,158,11,.1)' : 'none',
        }}
      >
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover"
          style={{ 
            transform: hovered ? 'scale(1.15)' : 'scale(1)', 
            transition: 'transform .6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: hovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(1)'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-amber-600/30 to-transparent"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity .4s ease' }}
        />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 text-center">{member.name}</h3>
      <p className="text-amber-700 font-bold text-xs uppercase tracking-wider text-center mt-1 mb-4">{member.role}</p>
      <p className="text-slate-600 text-sm leading-relaxed mb-5">{member.bio}</p>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-bold mb-2">Expertise</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {member.expertise.map((skill) => (
          <span key={skill} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300/60">
            {skill}
          </span>
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-bold mb-2">Achievements</p>
      <div className="space-y-1.5">
        {member.achievements.map((a) => (
          <div key={a} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstrumentCard = ({ inst, index }) => {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-card overflow-hidden cursor-pointer relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity .6s ease ${(index % 6) * 60}ms`,
      }}
    >
      <div className="h-28 overflow-hidden relative">
        <img 
          src={inst.image} 
          alt={inst.name} 
          className="w-full h-full object-cover"
          style={{ 
            transform: hovered ? 'scale(1.2)' : 'scale(1)', 
            transition: 'transform .6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: hovered ? 'brightness(1.15) saturate(1.2)' : 'brightness(1)'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-amber-600/60 via-amber-500/20 to-transparent"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity .4s ease' }}
        />
      </div>
      <div 
        className="p-3 text-center transition-all duration-300"
        style={{ 
          background: hovered ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : 'transparent'
        }}
      >
        <span 
          className="text-sm font-semibold transition-colors duration-300"
          style={{ color: hovered ? '#92400E' : '#1E293B' }}
        >
          {inst.name}
        </span>
      </div>
    </div>
  );
};

const FacilityCard = ({ facility, delay }) => {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-card group cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity .7s ease ${delay}ms`,
      }}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={facility.image} 
          alt={facility.title} 
          className="w-full h-full object-cover"
          style={{ 
            transform: hovered ? 'scale(1.15)' : 'scale(1)', 
            transition: 'transform .6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: hovered ? 'brightness(1.1)' : 'brightness(1)'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity .4s ease' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>
      <div className="p-6 relative">
        <h3 
          className="text-xl font-semibold mb-2 transition-colors duration-300"
          style={{ color: hovered ? '#D97706' : '#0F172A' }}
        >
          {facility.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">{facility.description}</p>
      </div>
    </div>
  );
};

const MissionCard = ({ Icon, title, texts, delay }) => {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="au-card p-8 cursor-pointer relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity .7s ease ${delay}ms`,
      }}
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500"
        style={{
          background: hovered ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#FEF3C7',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <Icon 
          className="w-7 h-7 transition-colors duration-300" 
          style={{ color: hovered ? '#FFF' : '#B45309' }}
        />
      </div>
      <h3 
        className="text-2xl font-bold mb-3 transition-colors duration-300"
        style={{ color: hovered ? '#D97706' : '#0F172A' }}
      >
        {title}
      </h3>
      <div className="space-y-3">
        {texts.map((t) => (
          <p key={t} className="text-slate-600 text-sm leading-relaxed">{t}</p>
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Priya Sharma',
      role: 'Founder & Head Instructor',
      bio: "Classically trained pianist with 15+ years of teaching experience. Master's in Music Education from Berklee College of Music. Specializes in Western classical and contemporary piano.",
      image: '/Instructor2.jpg',
      expertise: ['Piano', 'Music Theory', 'Composition', 'Western Classical'],
      achievements: ['Grade 8 Trinity College London', 'Berklee College Alumni', '15+ Years Experience'],
    },
    {
      name: 'Anand Rathore',
      role: 'Music Teacher & Classical Vocal Specialist',
      bio: 'Experienced music educator with strong command over Indian classical vocal music, rhythm, and theory. Skilled in teaching and explaining musical concepts with clarity.',
      image: '/Instructor1.jpg',
      expertise: ['Classical Vocal', 'Swar & Taal', 'Harmonium', 'Synthesizer', 'Tabla', 'Music Theory'],
      achievements: [
        'Teaching at Prayag Emerald Junior High School, Agra',
        'Teaching at Gayatri Tapobhoomi, Mathura',
        'Teaching at St. Andrews School, Agra',
        'Prabhakar from Prayagraj Sangeet Samiti',
        'M.A in Music from Jivaji University (2025)',
      ],
    },
  ];

  const values = [
    { icon: Heart, title: 'Passion for Music', description: 'We believe genuine love for music is the foundation of great musical education and performance.' },
    { icon: Users, title: 'Student-Centered', description: 'Every student is unique. We tailor our teaching methods to individual learning styles and goals.' },
    { icon: GraduationCap, title: 'Excellence', description: 'We maintain the highest standards in teaching, curriculum, and student support services.' },
    { icon: BookOpen, title: 'Comprehensive Learning', description: 'From basic notes to advanced compositions, we cover music theory and practical skills.' },
    { icon: Mic, title: 'Performance Focused', description: 'Regular recitals and concerts to build confidence and stage presence in students.' },
    { icon: Star, title: 'Innovative Methods', description: 'Blending traditional teaching with modern technology and contemporary music trends.' },
  ];

  const stats = [
    { number: '500+', label: 'Students Trained', icon: Users },
    { number: '15+', label: 'Expert Instructors', icon: GraduationCap },
    { number: '25+', label: 'Instruments', icon: Music },
    { number: '10+', label: 'Years Experience', icon: Calendar },
    { number: '45+', label: 'Annual Concerts', icon: Mic },
    { number: '98%', label: 'Success Rate', icon: CheckCircle },
  ];

  const facilities = [
    {
      title: 'Soundproof Practice Rooms',
      description: '8 fully equipped soundproof rooms for individual and group practice sessions',
      image: 'https://images.unsplash.com/photo-1651339764881-54e8338b185b?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Recording Studio',
      description: 'Professional recording setup for students to record their progress and compositions',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Instrument Library',
      description: 'Well-maintained collection of instruments available for student practice',
      image: 'https://plus.unsplash.com/premium_photo-1682125896993-12a1758b6cb3?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Performance Hall',
      description: '100-seat auditorium for regular student performances and recitals',
      image: 'https://images.unsplash.com/photo-1597071692394-6661037e14ef?w=600&auto=format&fit=crop&q=60',
    },
  ];

  const instruments = [
    { name: 'Piano', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&auto=format&fit=crop&q=60' },
    { name: 'Guitar', image: 'https://plus.unsplash.com/premium_photo-1693169973609-342539dea9dc?w=600&auto=format&fit=crop&q=60' },
    { name: 'Tabla', image: 'https://images.unsplash.com/photo-1633411988188-6e63354a9019?w=600&auto=format&fit=crop&q=60' },
    { name: 'Flute', image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=60' },
    { name: 'Sitar', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60' },
    { name: 'Drums', image: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=600&auto=format&fit=crop&q=60' },
    { name: 'Harmonium', image: 'https://media.istockphoto.com/id/1367529261/photo/indian-classical-music.webp?a=1&b=1&s=612x612&w=0&k=20&c=CoYsfAPCP0e5nsv7-J5efD6nZu4bUFwhwZH42-TgJ1k=' },
    { name: 'Vocals', image: 'https://images.unsplash.com/photo-1615748562188-07be820cff5b?w=600&auto=format&fit=crop&q=60' },
    { name: 'Keyboard', image: 'https://images.unsplash.com/photo-1614978498256-94ec73df1015?w=600&auto=format&fit=crop&q=60' },
    { name: 'Dholak', image: 'https://media.istockphoto.com/id/2195962108/photo/indian-traditional-drums-close-up.jpg?s=612x612&w=0&k=20&c=jqVw-ICQsZDN7z_EjPh6Aj0tlKmGhMEz6GJeI0NB2r8=' },
  ];

  const heroInstruments = ['Saxophone', 'Violin', 'Drums', 'Vocals', 'Harmonium', 'Trumpet', 'Dholak'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <GlobalStyles />
      <NavBarpage />

      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={`${import.meta.env.BASE_URL}Video_of_Slow_Moving_Waves.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/35 bg-amber-600/10 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide au-fade-up">
            <Music className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-100 mt-6 mb-4 au-fade-up-d1">
            About <span className="au-text-gradient">Raadhyam</span>
          </h1>
          <p className="text-slate-300/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto au-fade-up-d2">
            Discover our journey, mission, and the passion that drives us to nurture musical talent across generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 au-fade-up-d2">
            <Link to="/Contact-Us" className="au-gold-gradient px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
              Get Free Enquiry
            </Link>
            <button className="px-8 py-3 rounded-xl border-2 border-amber-500/50 text-amber-300 font-semibold hover:bg-amber-500/10 transition">
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-y border-amber-500/25">
        <div className="container mx-auto max-w-7xl px-4 flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 au-pulse-dot" />
            Institute Currently Open
          </div>
          <div className="flex flex-wrap gap-5 text-slate-300">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Mon-Sat: 9 AM - 9 PM</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-400" /> Sunday: 9 AM - 6 PM</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-amber-400" /> +91 84103 37618</span>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="By The Numbers" title="Raadhyam in Numbers" subtitle="A decade of musical excellence, student success, and community impact." />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-y border-amber-500/25">
        <div className="flex au-marquee whitespace-nowrap">
          {[...heroInstruments, ...heroInstruments].map((name, i) => (
            <span key={i} className="mx-8 text-slate-200/85 text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <Music className="w-5 h-5 text-amber-400" />
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Our Music Studio"
                className="w-full rounded-3xl shadow-2xl border border-amber-500/30 transition-all duration-700"
                style={{
                  transform: 'scale(1)',
                  filter: 'brightness(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.filter = 'brightness(1.1) contrast(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-amber-600/10 to-transparent rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent?.classList.contains('hovered')) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              />
            </div>
            <div 
              className="absolute -bottom-4 left-6 bg-white border rounded-xl px-4 py-2 shadow-md transition-all duration-500"
              style={{
                borderColor: 'rgba(245,158,11,.25)',
                transform: 'translateY(0) scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(245,158,11,.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,158,11,.25)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)';
              }}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-amber-700 font-bold">Est. 2012</p>
              <p className="text-sm text-slate-700 font-semibold">10+ Years of Music</p>
            </div>
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500"
              style={{
                boxShadow: '0 0 0 0px rgba(245,158,11,0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245,158,11,.3), 0 0 0 8px rgba(245,158,11,.15)';
              }}
            />
          </div>
          <div>
            <SectionHeading tag="Our Journey" title="Our Story & Journey" />
            <div className="space-y-4 -mt-4 text-slate-600 leading-relaxed">
              <p>Raadhyam Musical Classes was founded in 2012 with a simple mission: to make quality music education accessible to everyone. What started as a small studio with just two instructors has now grown into a premier music institution with a thriving community of over 500 students.</p>
              <p>Our name "Raadhyam" comes from the Sanskrit word for "pleasing to the heart," which reflects our philosophy that music should come from the heart and bring joy to both the performer and the listener.</p>
              <p>Over the years, we've expanded our curriculum to include 25+ instruments, launched online classes, and established annual music festivals that showcase our students' talents.</p>
            </div>
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-50">
              <Award className="w-5 h-5 text-amber-700 mt-0.5" />
              <p className="text-sm text-slate-700 font-semibold">Award-winning music education institution - Best Music School 2023</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="What We Teach" title="Instruments We Teach" subtitle="Comprehensive training in 25+ instruments across various musical traditions." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {instruments.map((inst, i) => (
              <InstrumentCard key={inst.name} inst={inst} index={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm mb-3">...and many more! Contact us for instruments not listed here.</p>
            <Link to="/Contact-Us" className="inline-block au-gold-gradient px-6 py-3 rounded-xl font-semibold">Inquire About Other Instruments</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Infrastructure" title="Our Facilities" subtitle="State-of-the-art infrastructure designed for optimal learning experience." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <FacilityCard key={f.title} facility={f} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Purpose" title="Our Mission & Vision" subtitle="We believe that everyone has musical potential waiting to be discovered." />
          <div className="grid md:grid-cols-2 gap-6">
            <MissionCard
              Icon={Target}
              title="Our Mission"
              delay={0}
              texts={[
                'To provide exceptional music education that nurtures creativity, builds confidence, and fosters a lifelong love for music in students of all ages and skill levels through personalized attention and comprehensive curriculum.',
                'We strive to create a supportive environment where students can explore their musical interests and develop their unique artistic voice while maintaining the highest standards of musical excellence.',
              ]}
            />
            <MissionCard
              Icon={Eye}
              title="Our Vision"
              delay={120}
              texts={[
                'To become the leading music education institution recognized for excellence in teaching, innovation in curriculum, and commitment to student success across India.',
                'We envision a world where music education is accessible to all and where every individual can experience the transformative power of music, creating a more harmonious society through the universal language of music.',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Philosophy" title="Our Values & Philosophy" subtitle="The principles that guide everything we do at Raadhyam." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="The Team" title="Meet Our Founders" subtitle="The passionate musicians behind Raadhyam." />
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((m, i) => (
              <TeamCard key={m.name} member={m} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Find Us" title="Visit Our Campus" subtitle="Come experience the music in person." />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="au-card p-7">
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: 'Main Campus',
                    content: 'Raadhyam Music Institute, Ashiyana PT. Deen, Shop no.04, Sector 7, Dayal Upadhyay Puram, Agra, Uttar Pradesh 282007',
                  },
                  { icon: Phone, label: 'Contact', content: '+91 84103 37618, +91 94123 18590' },
                  { icon: Mail, label: 'Email', content: 'raadhyammusicals@gmail.com' },
                  { icon: Clock, label: 'Hours', content: 'Monday - Saturday: 9:00 AM - 9:00 PM, Sunday: 9:00 AM - 6:00 PM' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3">
                      <Icon className="w-5 h-5 text-amber-700 mt-0.5" />
                      <div>
                        <p className="text-slate-900 text-sm font-semibold">{item.label}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="au-card p-2 overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.666687052142!2d77.95964401102849!3d27.198210876379967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747702598cee49%3A0x8c378565a19b33c5!2sRaadhyam%20Music%20Academy!5e0!3m2!1sen!2sin!4v1763693224614!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Raadhyam Music Institute Location"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-14 border border-amber-500/25">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/35 bg-amber-600/10 text-amber-300 text-xs font-bold tracking-[0.16em] uppercase mb-4">
              Join Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Ready to Start Your <span className="au-text-gradient">Musical Journey?</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join over 500 students who have discovered their musical potential with Raadhyam. Limited spots available for {new Date().getFullYear()} batch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/Contact-Us" className="au-gold-gradient px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
                Get Enquiry
              </Link>
              <button className="px-8 py-3 rounded-xl border-2 border-amber-500/50 text-amber-300 font-semibold hover:bg-amber-500/10 transition">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
};

export default AboutUs;
