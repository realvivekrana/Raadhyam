import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
  .rn { font-family:"Inter",system-ui,sans-serif; position:fixed; inset:0 0 auto 0; z-index:9999; transition:background .3s,box-shadow .3s,border-color .3s; }
  .rn.top { background:rgba(255,255,255,.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid rgba(226,232,240,.6); box-shadow:0 2px 10px rgba(0,0,0,.04); }
  .rn.scrolled { background:rgba(255,255,255,.97); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(220,38,38,.18); box-shadow:0 4px 28px rgba(0,0,0,.09); }
  .rn-wrap { max-width:1280px; margin:0 auto; padding:0 1.5rem; }
  .rn-bar { display:flex; align-items:center; justify-content:space-between; height:72px; transition:height .3s; }
  .rn.scrolled .rn-bar { height:64px; }
  .rn-logo img { height:50px; transition:height .3s; }
  .rn.scrolled .rn-logo img { height:44px; }
  .rn-links { display:flex; align-items:center; gap:.25rem; }
  .rn-a { position:relative; color:#475569; font-size:.9375rem; font-weight:500; padding:.5rem 1rem; text-decoration:none; transition:color .25s; white-space:nowrap; }
  .rn-a::after { content:""; position:absolute; bottom:2px; left:50%; transform:translateX(-50%) scaleX(0); width:60%; height:2px; background:linear-gradient(90deg,#dc2626,#ef4444); border-radius:2px; transition:transform .3s cubic-bezier(.4,0,.2,1); }
  .rn-a:hover,.rn-a.on { color:#dc2626; }
  .rn-a:hover::after,.rn-a.on::after { transform:translateX(-50%) scaleX(1); }
  .rn-a.on { font-weight:600; }
  .rn-btn { margin-left:1rem; display:inline-block; background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; font-size:.9375rem; font-weight:600; padding:.625rem 1.625rem; border-radius:10px; text-decoration:none; box-shadow:0 4px 14px rgba(220,38,38,.28); transition:transform .25s,box-shadow .25s; }
  .rn-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(220,38,38,.38); }
  .rn-hbg { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:7px; border-radius:8px; transition:background .2s; }
  .rn-hbg:hover { background:rgba(220,38,38,.07); }
  .rn-hl { width:24px; height:2px; background:#475569; border-radius:2px; transition:all .3s ease; }
  .rn-hbg.open .rn-hl:nth-child(1) { transform:rotate(45deg) translate(5px,5px); background:#dc2626; }
  .rn-hbg.open .rn-hl:nth-child(2) { opacity:0; }
  .rn-hbg.open .rn-hl:nth-child(3) { transform:rotate(-45deg) translate(6px,-6px); background:#dc2626; }
  .rn-mob { overflow:hidden; max-height:0; opacity:0; transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .3s ease; }
  .rn-mob.open { max-height:600px; opacity:1; }
  .rn-mob-inner { padding:.5rem 0 1.5rem; display:flex; flex-direction:column; gap:.25rem; }
  .rn-ma { display:block; padding:.875rem 1rem; color:#475569; font-size:.9375rem; font-weight:500; border-radius:8px; text-decoration:none; transition:background .2s,color .2s; }
  .rn-ma:hover { background:rgba(220,38,38,.07); color:#dc2626; }
  .rn-ma.on { background:rgba(220,38,38,.1); color:#dc2626; font-weight:600; }
  .rn-mbtn { display:block; margin-top:.75rem; background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; font-size:.9375rem; font-weight:600; padding:.875rem 1rem; border-radius:10px; text-align:center; text-decoration:none; box-shadow:0 4px 14px rgba(220,38,38,.28); transition:box-shadow .25s; }
  .rn-mbtn:hover { box-shadow:0 6px 20px rgba(220,38,38,.38); }
  @media(min-width:768px){ .rn-links{display:flex!important} .rn-hbg{display:none!important} .rn-mob{display:none!important} }
  @media(max-width:767px){ .rn-links{display:none!important} .rn-hbg{display:flex!important} }
`;

const NavBarpage = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const lc = ({ isActive }) => "rn-a" + (isActive ? " on" : "");
  const mc = ({ isActive }) => "rn-ma" + (isActive ? " on" : "");
  return (
    <>
      <style>{css}</style>
      <nav className={"rn " + (scrolled ? "scrolled" : "top")}>
        <div className="rn-wrap">
          <div className="rn-bar">
            <Link to="/" className="rn-logo" style={{textDecoration:"none"}}>
              <img src="/Raadhyam.png" alt="Raadhyam" />
            </Link>
            <div className="rn-links">
              <NavLink to="/" className={lc}>Home</NavLink>
              <NavLink to="/About-Us" className={lc}>About Us</NavLink>
              <NavLink to="/Courses" className={lc}>Courses</NavLink>
              <NavLink to="/Notes" className={lc}>Notes</NavLink>
              <NavLink to="/Contact-Us" className={lc}>Contact Us</NavLink>
              <Link to="/login" className="rn-btn">Enroll Now</Link>
            </div>
            <button className={"rn-hbg" + (open ? " open" : "")} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
              <div className="rn-hl" /><div className="rn-hl" /><div className="rn-hl" />
            </button>
          </div>
          <div className={"rn-mob" + (open ? " open" : "")}>
            <div className="rn-mob-inner">
              <NavLink to="/" className={mc} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/About-Us" className={mc} onClick={() => setOpen(false)}>About Us</NavLink>
              <NavLink to="/Courses" className={mc} onClick={() => setOpen(false)}>Courses</NavLink>
              <NavLink to="/Notes" className={mc} onClick={() => setOpen(false)}>Notes</NavLink>
              <NavLink to="/Contact-Us" className={mc} onClick={() => setOpen(false)}>Contact Us</NavLink>
              <Link to="/login" className="rn-mbtn" onClick={() => setOpen(false)}>Enroll Now</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBarpage;
