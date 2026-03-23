import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import FooterPage from './FooterPage';
import NavBarpage from './NavBarpage';

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

/* ─── Global styles ──────────────────────────────────────────────────────── */
const ContactStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@300;400;600;700&display=swap');
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatNote {
      0%,100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-18px) rotate(5deg); }
      66%      { transform: translateY(10px) rotate(-4deg); }
    }
    @keyframes drawLine {
      from { width: 0; }
      to   { width: 72px; }
    }
    .contact-input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'Lato', sans-serif;
      color: #1E293B;
      background: #fff;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s;
      box-sizing: border-box;
    }
    .contact-input:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
    }
    .contact-input::placeholder { color: #94A3B8; }
    select.contact-input { cursor: pointer; }
    textarea.contact-input { resize: vertical; min-height: 130px; }
    label.contact-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 6px;
      font-family: 'Lato', sans-serif;
    }
  `}</style>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const msg = `*New Contact Message from Raadhyam Website*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}\n\n_Sent via Raadhyam Contact Form_`;
    window.open(`https://wa.me/916396949336?text=${encodeURIComponent(msg)}`, '_blank');
    setIsLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactMethods = [
    { icon: Mail,    label: 'Email Us',   value: 'raadhyammusicals@gmail.com', sub: 'We reply within 24 hours',    href: 'mailto:raadhyammusicals@gmail.com' },
    { icon: Phone,   label: 'WhatsApp',   value: '+91 84103 37618',             sub: 'Chat with us instantly',      href: 'https://wa.me/918410337618' },
    { icon: MapPin,  label: 'Visit Us',   value: 'Sector 7, Dayal Upadhyay Puram, Agra, UP 282007', sub: 'Come say hello at our studio', href: 'https://maps.app.goo.gl/b6rT2WkwkLrQJiis8' },
    { icon: Clock,   label: 'Hours',      value: 'Mon–Sat: 9 AM – 9 PM',       sub: 'Sunday: 9 AM – 6 PM',         href: null },
  ];

  const floatingNotes = [
    { note: '♩', top: '12%',    left: '2%',   delay: '0s',   size: '2rem' },
    { note: '♫', top: '20%',    right: '3%',  delay: '1.3s', size: '1.8rem' },
    { note: '♬', bottom: '20%', left: '5%',   delay: '2.5s', size: '1.6rem' },
    { note: '♪', top: '60%',    right: '6%',  delay: '0.7s', size: '1.6rem' },
  ];

  const warmBg = 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 40%, #FFFBF5 100%)';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Lato', Arial, sans-serif" }}>
      <ContactStyles />
      <NavBarpage />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '45vh', paddingTop: 70, background: warmBg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.15) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
        {floatingNotes.map((n, i) => (
          <span key={i} style={{ position: 'absolute', userSelect: 'none', pointerEvents: 'none', fontSize: n.size, color: '#dc2626', opacity: 0.15, top: n.top, bottom: n.bottom, left: n.left, right: n.right, animation: `floatNote 7s ease-in-out ${n.delay} infinite` }}>{n.note}</span>
        ))}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem 3rem', width: '100%', position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.9s ease 0.1s both' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '5px 16px', borderRadius: 24, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif" }}>
            💬 Get In Touch
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, color: '#1E293B', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
            Let's Create{' '}
            <span style={{ background: 'linear-gradient(90deg,#dc2626,#ef4444,#dc2626)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>Music Together</span>
          </h1>
          <div style={{ height: 3, width: 0, background: 'linear-gradient(90deg,#dc2626,#ef4444)', borderRadius: 2, margin: '0 auto 1.5rem', animation: 'drawLine 1s ease 0.7s forwards' }} />
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 500, margin: '0 auto', fontFamily: "'Lato', sans-serif" }}>
            Reach out for music lessons, instrument enquiries, collaborations, or just to say hello. We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ══ CONTACT METHODS ═══════════════════════════════════════════════ */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {contactMethods.map(({ icon: Icon, label, value, sub, href }, i) => {
              const inner = (
                <div style={{
                  background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20,
                  padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                  cursor: href ? 'pointer' : 'default', height: '100%',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ color: '#dc2626', width: 22, height: 22 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '0.3rem', fontFamily: "'Lato', sans-serif" }}>{label}</p>
                    <p style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem', fontFamily: "'Lato', sans-serif", marginBottom: '0.2rem' }}>{value}</p>
                    <p style={{ color: '#64748B', fontSize: '0.82rem', fontFamily: "'Lato', sans-serif" }}>{sub}</p>
                  </div>
                </div>
              );
              return href
                ? <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
                : <div key={i}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ══ FORM + MAP ════════════════════════════════════════════════════ */}
      <section style={{ padding: '4rem 0', background: warmBg, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.12) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* ── Contact Form ── */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', boxShadow: '0 4px 24px rgba(30,41,59,0.08)', border: '1px solid #E2E8F0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '4px 14px', borderRadius: 24, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: "'Lato', sans-serif" }}>
                📝 Send a Message
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>We'd Love to Hear From You</h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: "'Lato', sans-serif", lineHeight: 1.7 }}>Fill out the form and we'll get back to you via WhatsApp within 24 hours.</p>

              {submitted && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1.5rem' }}>
                  <CheckCircle style={{ color: '#16a34a', width: 18, height: 18 }} />
                  <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Lato', sans-serif" }}>Message sent! Opening WhatsApp...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label className="contact-label" htmlFor="name">Full Name *</label>
                    <input className="contact-input" id="name" name="name" type="text" required placeholder="Your full name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="contact-label" htmlFor="email">Email Address *</label>
                    <input className="contact-input" id="email" name="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label className="contact-label" htmlFor="phone">Phone Number</label>
                    <input className="contact-input" id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="contact-label" htmlFor="subject">Enquiry Type *</label>
                    <select className="contact-input" id="subject" name="subject" required value={formData.subject} onChange={handleChange}>
                      <option value="">Select type...</option>
                      <option value="music-lessons">Music Lessons</option>
                      <option value="instrument-rental">Instrument Rental</option>
                      <option value="trial-class">Free Trial / Demo Class</option>
                      <option value="event-booking">Event / Performance Booking</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="pricing">Pricing & Packages</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="contact-label" htmlFor="message">Your Message *</label>
                  <textarea className="contact-input" id="message" name="message" required placeholder="Tell us about your musical needs, questions, or how we can help..." value={formData.message} onChange={handleChange} />
                </div>

                <button type="submit" disabled={isLoading} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: isLoading ? '#fca5a5' : 'linear-gradient(135deg,#dc2626,#991b1b)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px 28px', fontSize: '0.95rem', fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em',
                  boxShadow: isLoading ? 'none' : '0 6px 22px rgba(220,38,38,0.38)',
                  fontFamily: "'Lato', sans-serif",
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                  onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.5)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 6px 22px rgba(220,38,38,0.38)'; }}>
                  {isLoading ? (
                    <><div style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Sending...</>
                  ) : (
                    <><MessageCircle style={{ width: 18, height: 18 }} />Send via WhatsApp</>
                  )}
                </button>
                <p style={{ color: '#94A3B8', fontSize: '0.78rem', textAlign: 'center', fontFamily: "'Lato', sans-serif" }}>
                  You'll be redirected to WhatsApp to send your message directly to our team.
                </p>
              </form>
            </div>

            {/* ── Map + Quick Stats ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Map */}
              <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(30,41,59,0.1)', border: '2px solid rgba(220,38,38,0.15)', height: 320 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.666687052142!2d77.95964401102849!3d27.198210876379967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747702598cee49%3A0x8c378565a19b33c5!2sRaadhyam%20Music%20Academy!5e0!3m2!1sen!2sin!4v1763693224614!5m2!1sen!2sin"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Raadhyam Music Institute Location"
                />
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { emoji: '🎵', num: '500+', label: 'Students' },
                  { emoji: '🎸', num: '25+',  label: 'Instruments' },
                  { emoji: '🏆', num: '10+',  label: 'Years' },
                  { emoji: '⭐', num: '5.0',  label: 'Rating' },
                ].map(({ emoji, num, label }) => (
                  <div key={label} style={{
                    background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16,
                    padding: '1.25rem', textAlign: 'center',
                    transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{emoji}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", marginTop: '0.25rem' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPage />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ContactPage;
