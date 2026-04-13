import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Music,
  Heart,
  Globe,
  Award,
  Users,
  Mic,
  Guitar,
  Piano,
  Drum,
  Wind,
  BookOpen,
  Monitor,
  Star,
  Mail,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import NavBarpage from "./NavBarpage";
import FooterPage from "./FooterPage";
import heroBg from "../assets/hero-bg.jpg";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Counter({ end, suffix = "", duration = 1800, start = false }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    let startTs;
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return <span>{value}{suffix}</span>;
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Forum&family=Manrope:wght@400;500;600;700;800&display=swap');

    body {
      background: #fdfdfd;
      margin: 0;
    }

    .rp-shell {
      font-family: 'Manrope', sans-serif;
      color: #111827;
      background: #fafaf9;
    }

    .rp-title,
    .rp-display {
      font-family: 'Forum', serif;
      letter-spacing: 0.02em;
    }

    .rp-grid-pattern {
      background-image:
        linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
    }

    .rp-glass {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.03);
      backdrop-filter: blur(12px);
    }

    .rp-outline {
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .rp-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      border: 1px solid rgba(239, 126, 26, 0.2);
      background: rgba(239, 126, 26, 0.08);
      color: #c25700;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    .rp-btn-primary {
      background: linear-gradient(130deg, #ef7e1a 0%, #f4a14f 100%);
      color: #ffffff;
      font-weight: 800;
      border-radius: 0.6rem;
      border: none;
      box-shadow: 0 12px 24px rgba(239, 126, 26, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .rp-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 32px rgba(239, 126, 26, 0.4);
    }

    .rp-btn-ghost {
      border-radius: 0.6rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: #4b5563;
      background: rgba(255, 255, 255, 0.8);
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    .rp-btn-ghost:hover {
      background: rgba(255, 255, 255, 1);
      border-color: rgba(0, 0, 0, 0.2);
    }

    .rp-card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .rp-card-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(239, 126, 26, 0.12);
    }

    .rp-stat-card {
      background: linear-gradient(160deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.85));
      border: 1px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 16px 36px rgba(2, 6, 23, 0.32);
      position: relative;
      overflow: hidden;
      transition: transform .4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .4s ease, border-color .4s ease, background .4s ease;
    }

    .rp-stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 70%);
      opacity: 0;
      transition: opacity .4s ease;
      pointer-events: none;
    }

    .rp-stat-card:hover {
      transform: translateY(-10px) scale(1.02);
      border-color: rgba(245, 158, 11, 0.75);
      box-shadow: 0 28px 56px rgba(245, 158, 11, 0.25), 0 12px 28px rgba(2, 6, 23, 0.45);
      background: linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.9));
    }

    .rp-stat-card:hover::before {
      opacity: 1;
    }

    @keyframes sheenSweep {
      0% { transform: translateX(-130%) skewX(-18deg); }
      100% { transform: translateX(220%) skewX(-18deg); }
    }

    @keyframes iconBreath {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-3px) scale(1.06); }
    }

    .rp-feature-card,
    .rp-program-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(239, 126, 26, 0.14);
      background: #ffffff;
      box-shadow:
        0 16px 34px rgb
        a(17, 24, 39, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.35s ease;
    }

    .rp-feature-card::after,
    .rp-program-card::after {
      content: '';
      position: absolute;
      top: -120%;
      left: -10%;
      width: 34%;
      height: 340%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.45), transparent);
      transform: translateX(-130%) skewX(-18deg);
      pointer-events: none;
    }

    .rp-feature-card:hover,
    .rp-program-card:hover {
      transform: translateY(-10px) scale(1.012);
      border-color: rgba(239, 126, 26, 0.34);
      box-shadow:
        0 30px 50px rgba(17, 24, 39, 0.14),
        0 8px 20px rgba(239, 126, 26, 0.08);
    }

    .rp-feature-card:hover::after,
    .rp-program-card:hover::after {
      animation: sheenSweep 1.15s ease;
    }

    .rp-feature-icon,
    .rp-program-icon {
      animation: iconBreath 3.8s ease-in-out infinite;
    }

    .rp-mentor-image {
      transform: scale(1);
      transition: transform .6s cubic-bezier(0.34, 1.56, 0.64, 1), filter .6s cubic-bezier(0.34, 1.56, 0.64, 1);
      filter: brightness(1);
    }

    .group:hover .rp-mentor-image {
      transform: scale(1.15);
      filter: brightness(1.1) contrast(1.05);
    }

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(26px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .rp-anim {
      animation: revealUp 0.8s ease both;
    }
  `}</style>
);

function RevealSection({ children, className = "", plain = false }) {
  const { ref, inView } = useInView(0.12);

  return (
    <section
      ref={ref}
      className={`px-4 sm:px-6 lg:px-8 py-14 sm:py-16 ${
        plain ? "bg-transparent" : "bg-[#fdfcfb]"
      } ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: "all 700ms ease",
      }}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

function StatBlock({ number, suffix, label, delay = 0, icon: Icon }) {
  const { ref, inView } = useInView(0.25);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rp-stat-card group rounded-3xl p-8 text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `all 700ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#ef7e1a]/20 to-[#f4a14f]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

      {Icon && (
        <div
          className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-500"
          style={{
            background: hovered ? "linear-gradient(135deg, #FCD34D, #F59E0B)" : "rgba(251,191,36,.2)",
            transform: hovered ? "scale(1.15) rotate(360deg)" : "scale(1) rotate(0deg)",
            boxShadow: hovered ? "0 8px 24px rgba(251,191,36,.4)" : "none",
          }}
        >
          <Icon
            className="w-7 h-7 transition-colors duration-300"
            style={{ color: hovered ? "#78350F" : "#FCD34D" }}
          />
        </div>
      )}

      <div className="relative z-10">
        <div
          className="text-4xl md:text-5xl font-extrabold tracking-tight transition-all duration-300"
          style={{
            color: hovered ? "#FCD34D" : "#FDE68A",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <Counter end={number} suffix={suffix} start={inView} />
        </div>
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-slate-200/85 mt-3 transition-colors">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="text-center mb-10 sm:mb-14">
      <span className="rp-tag mb-4">{tag}</span>
      <h2 className="rp-title text-4xl sm:text-5xl md:text-6xl text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mt-5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const RaadhyamWelcomeHome = () => {
  const strengthsView = useInView(0.2);
  const programsView = useInView(0.2);

  const features = [
    {
      icon: Piano,
      title: "Learn with Heart",
      desc: "Every session blends emotion, expression, and mentorship - building a deep connection with music.",
    },
    {
      icon: Wind,
      title: "Online & Offline",
      desc: "Learn from anywhere or join us at the studio - HD virtual classes + structured offline sessions.",
    },
    {
      icon: Guitar,
      title: "25+ Instruments",
      desc: "Tabla, Harmonium, Sitar, Guitar, Keyboard, Drums, Violin - from beginners to advanced learners.",
    },
    {
      icon: Drum,
      title: "Professional Mentors",
      desc: "Trained musicians and industry experts focused on skill, creativity, and discipline.",
    },
    {
      icon: Mic,
      title: "Stage Performances",
      desc: "Real-stage exposure through concerts, competitions, showcases, and recordings.",
    },
    {
      icon: Music,
      title: "Certifications & Exams",
      desc: "Prepared for Trinity, ABRSM, Gandharva, and other music certifications.",
    },
  ];

  const courses = [
    {
      icon: Mic,
      title: "Vocal Training",
      desc: "Indian Classical, Bollywood & Western vocals with voice modulation, breathing, and performance.",
    },
    {
      icon: Guitar,
      title: "String Instruments",
      desc: "Guitar, Violin, Sitar & Ukulele - chords, ragas, melodies, and techniques.",
    },
    {
      icon: Piano,
      title: "Keyboard & Piano",
      desc: "Classical & contemporary piano - chords, scales, improvisation & composition.",
    },
    {
      icon: Drum,
      title: "Percussion",
      desc: "Tabla, Drums, Cajon, Dholak - rhythm cycles and coordination.",
    },
    {
      icon: Wind,
      title: "Wind Instruments",
      desc: "Flute, Saxophone & Harmonica with breath control and notation.",
    },
    {
      icon: Music,
      title: "Music Theory",
      desc: "Notation, harmony, rhythm, scales, chords & composition.",
    },
    {
      icon: Piano,
      title: "Online Classes",
      desc: "Interactive sessions with recordings, assignments & feedback.",
    },
    {
      icon: Mic,
      title: "Advanced Courses",
      desc: "Professional certification, stage performance, recording & mastering.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Vocal Student",
      text: "Raadhyam transformed my singing completely. The teaching is unmatched.",
    },
    {
      name: "Arjun Mehta",
      role: "Guitar Student",
      text: "I started from zero and within 6 months I was performing on stage.",
    },
    {
      name: "Sneha Gupta",
      role: "Piano Student",
      text: "The online classes are just as effective as offline with personalized feedback.",
    },
  ];

  const heroChecks = ["Certified Instructors", "All Age Groups", "Online & Offline"];

  return (
    <div className="rp-shell min-h-screen overflow-x-hidden relative bg-[#fcfbf9]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] -left-64 w-[40rem] h-[40rem] bg-orange-200/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-[20%] -right-64 w-[50rem] h-[50rem] bg-amber-100/30 rounded-full blur-3xl mix-blend-multiply opacity-60"></div>
      </div>
      <div className="relative z-10 w-full">
        <GlobalStyles />
        <NavBarpage />

        <section className="relative min-h-[92vh] w-full bg-[#0a0a0a] flex items-center overflow-hidden border-b border-gray-100">
          <div className="absolute inset-0 z-0 bg-black">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60"
            >
              <source src={`${import.meta.env.BASE_URL}K_Musical_Instrument_Showcase_Video.mp4`} type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent pointer-events-none z-10" />

          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
            <div className="max-w-2xl">
              <span className="rp-tag rp-anim bg-white/10 border border-white/20 text-white shadow-sm backdrop-blur-md">
                <Music className="w-3.5 h-3.5 mr-1.5" /> Premium Education
              </span>

              <h1 className="rp-display text-6xl sm:text-7xl lg:text-[5.5rem] leading-[1.02] mt-6 text-white rp-anim drop-shadow-sm font-bold">
                Discover Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef7e1a] to-[#f4a14f]">Musical Identity</span>
              </h1>

              <p className="text-gray-300 mt-8 max-w-lg font-medium text-lg leading-relaxed rp-anim">
                Professional music education rooted in the Guru-Shishya tradition.
                Experience immersive, world-class training with top-tier artists.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10 rp-anim">
                <Link to="/login" className="rp-btn-primary px-10 py-4 text-center shadow-lg text-sm uppercase tracking-wide">
                  Start Learning
                </Link>
                <Link to="/Contact-Us" className="rp-btn-ghost px-10 py-4 text-center font-bold text-sm uppercase tracking-wide !text-white !bg-white/10 !border-white/20 hover:!bg-white/20 border">
                  Get Free Enquiry
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-10 sm:mt-14 rp-anim" style={{ animationDelay: '200ms' }}>
                {heroChecks.map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm px-5 sm:px-4 py-3.5 sm:py-3.5 text-sm sm:text-[13px] font-bold text-white flex items-center justify-start sm:justify-center gap-2.5 min-h-[52px] ${
                      index === 2 ? "col-span-2 sm:col-span-1 justify-self-center sm:justify-self-auto w-full max-w-[270px] sm:max-w-none" : ""
                    }`}
                  >
                    <CheckCircle className="w-4.5 h-4.5 sm:w-4.5 sm:h-4.5 text-[#ef7e1a] shrink-0" />
                    <span className="leading-tight tracking-[0.01em]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        <RevealSection plain>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBlock icon={Users} number={500} suffix="+" label="Students Trained" delay={20} />
            <StatBlock icon={Award} number={15} suffix="+" label="Expert Instructors" delay={90} />
            <StatBlock icon={Guitar} number={25} suffix="+" label="Instruments" delay={160} />
            <StatBlock icon={Star} number={7} suffix="+" label="Years of Excellence" delay={230} />
          </div>
        </RevealSection>

        <RevealSection>
          <SectionHeader
            tag="Our Strengths"
            title="Why Choose Raadhyam"
            subtitle="We do not just teach music - we shape musicians with care, creativity, and professional excellence."
          />

          <div ref={strengthsView.ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {features.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className="group rp-feature-card rounded-3xl p-8"
                style={{
                  opacity: strengthsView.inView ? 1 : 0,
                  transform: strengthsView.inView ? "translateY(0) scale(1)" : "translateY(26px) scale(0.97)",
                  transition: `opacity 680ms ease ${idx * 90}ms, transform 680ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 90}ms`,
                }}
              >
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-[#ef7e1a]/18 to-[#f4a14f]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="inline-flex items-center rounded-full border border-[#ef7e1a]/20 bg-[#ef7e1a]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c25700] mb-5 relative z-10">
                  Signature Learning
                </div>
                <div className="rp-feature-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/70 border border-orange-200/60 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 relative z-10">
                  <Icon className="w-8 h-8 text-[#ef7e1a]" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 relative z-10 group-hover:text-[#b64f00] transition-colors">{title}</h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed relative z-10">{desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[#c25700] text-xs font-bold uppercase tracking-[0.12em] relative z-10">
                  Learn More <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection plain>
          <SectionHeader
            tag="Our Programs"
            title="Music Programs for Every Soul"
            subtitle="Structured courses for all ages and skill levels with certified instructors, real-time practice, and personalized feedback."
          />

          <div ref={programsView.ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {courses.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className="group rp-program-card rounded-3xl p-7 flex flex-col"
                style={{
                  opacity: programsView.inView ? 1 : 0,
                  transform: programsView.inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                  transition: `opacity 650ms ease ${idx * 80}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 80}ms`,
                }}
              >
                <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-gradient-to-tr from-[#ef7e1a]/14 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="inline-flex w-fit items-center rounded-full border border-[#ef7e1a]/20 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#c25700] mb-4 relative z-10">
                  Program
                </div>
                <div className="rp-program-icon w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/80 border border-orange-100 shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                  <Icon className="w-6 h-6 text-[#ef7e1a]" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2 relative z-10 group-hover:text-[#b64f00] transition-colors">{title}</h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed flex-1 relative z-10">{desc}</p>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c25700] relative z-10">
                  Enroll Available
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection>
          <SectionHeader tag="Meet The Founder" title="The Heart Behind Raadhyam" />

          <div className="grid lg:grid-cols-[0.65fr_1.35fr] gap-10 items-center relative z-10">
            <div className="mx-auto w-full max-w-[360px] relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#ef7e1a] to-[#f4a14f] rounded-[3.5rem] blur-xl opacity-30 animate-pulse"></div>
              <div className="rounded-[3rem] overflow-hidden border-[6px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 group cursor-pointer">
                <img src="/founder.jpg" alt="Mr. Dheeraj Solanki" className="rp-mentor-image w-full h-[440px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            <div className="rp-glass rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white/80 bg-white/60 hover:bg-white/90 transition-colors duration-500 relative overflow-hidden group">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#ef7e1a]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="rp-title text-4xl sm:text-5xl font-bold text-gray-900 relative z-10">Mr. Dheeraj Solanki</h3>
              <p className="text-[#ef7e1a] text-xs sm:text-sm uppercase tracking-[0.15em] font-bold mt-2 relative z-10">
                Indian Classical Musician & Educator
              </p>
              <p className="text-gray-600 font-medium mt-6 text-base leading-relaxed relative z-10">
                With over 7 years of training in Indian Classical Music under the Guru-Shishya Parampara, he brings depth, discipline, and a soulful teaching style.
              </p>
              <blockquote className="mt-8 border-l-4 border-l-[#ef7e1a] pl-6 text-gray-800 font-bold text-lg italic leading-relaxed relative z-10">
                "Music is a powerful medium - it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
              </blockquote>

              <div className="grid grid-cols-3 gap-4 mt-10 relative z-10">
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <p className="text-3xl font-extrabold text-[#ef7e1a]">7+</p>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase mt-2">Years Classical Training</p>
                </div>
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <p className="text-3xl font-extrabold text-[#ef7e1a]">3+</p>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase mt-2">Years Professional Teaching</p>
                </div>
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <p className="text-3xl font-extrabold text-[#ef7e1a]">10+</p>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase mt-2">Instruments Taught</p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection plain>
          <SectionHeader tag="Testimonials" title="What Our Students Say" />
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="group rp-glass rounded-3xl p-8 bg-white/60 hover:bg-white/95 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(239,126,26,0.12)] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-20 h-20 bg-[#ef7e1a]/5 rounded-bl-[100%] transition-transform duration-500 group-hover:scale-150"></div>
                <div className="flex gap-1.5 mb-5 relative z-10">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-[#ef7e1a] text-[#ef7e1a] group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }} />
                  ))}
                </div>
                <p className="text-gray-700 font-medium text-base leading-relaxed italic relative z-10">"{text}"</p>
                <div className="mt-8 pt-6 border-t border-gray-200/60 relative z-10">
                  <p className="font-extrabold text-gray-900 group-hover:text-[#ef7e1a] transition-colors">{name}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mt-1">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl relative group pb-10">
            <img src={heroBg} alt="Join Raadhyam" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#ef7e1a]/95 to-[#c25700]/95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 p-10 sm:p-14 md:p-20 text-center">
              <h2 className="rp-title text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                Ready to Begin Your
                <br />
                Musical Journey?
              </h2>
              <p className="text-white/90 font-medium text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
                Join hundreds of students learning music with heart at Raadhyam Musical Classes.
                First trial class is on us.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                <Link to="/login" className="bg-white text-[#c25700] hover:bg-gray-50 hover:text-[#ef7e1a] px-10 py-4 text-center font-extrabold rounded-xl shadow-xl transition-all hover:scale-105">
                  Enroll Now
                </Link>
                <a href="mailto:raadhyammusicals@gmail.com" className="border-2 border-white/40 bg-white/10 text-white backdrop-blur-md px-10 py-4 text-center font-bold rounded-xl inline-flex items-center justify-center gap-3 transition-all hover:bg-white/20">
                  <Mail className="w-5 h-5" /> Email Us
                </a>
              </div>
            </div>
          </div>
        </RevealSection>

        <FooterPage />
      </div>
    </div>
  );
};

export default RaadhyamWelcomeHome;
