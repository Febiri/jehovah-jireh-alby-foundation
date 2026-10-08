import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Heart, ArrowRight, BookOpen, Home as HomeIcon, Shirt, HeartPulse, Sun, Sparkles } from 'lucide-react';

function getWhatIcon(iconName) {
  switch (iconName) {
    case 'Home': return <HomeIcon size={24} />;
    case 'Shirt': return <Shirt size={24} />;
    case 'BookOpen': return <BookOpen size={24} />;
    case 'HeartPulse': return <HeartPulse size={24} />;
    case 'Sun': return <Sun size={24} />;
    default: return <Sparkles size={24} />;
  }
}

export default function Home() {
  const { settings, whatWeDo } = useContent();

  // Only show first 3 programs on home page
  const featuredPrograms = whatWeDo.slice(0, 3);

  return (
    <div>
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <div className="hero-grid">
            {/* Left: Text */}
            <div>
              <div className="hero-badge-pill">
                <span className="pill-tag">Christian Charity · Ghana</span>
                <span>{settings?.scripture || 'Genesis 22:14'}</span>
              </div>

              <h1 className="hero-title">
                {settings?.display_title || 'JEHOVAH JIREH ALBY FOUNDATION'}
              </h1>

              <div className="hero-motto-box">
                <div className="hero-motto-text">
                  "{settings?.motto || 'the lord will provide'}"
                </div>
                <div className="hero-scripture">
                  Holy Scripture — {settings?.scripture || 'Genesis 22:14'}
                </div>
              </div>

              <p className="hero-description">
                {settings?.description ||
                  'A Christian charitable foundation committed to caring for orphans, street children, vulnerable children and the needy across Ghana. We believe every child deserves love, hope, education and a future.'}
              </p>

              <div className="hero-cta-group">
                <Link to="/donate" className="btn btn-lg btn-gold">
                  <Heart size={18} fill="var(--navy-950)" />
                  <span>Donate Now</span>
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-white">
                  <span>Our Story</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hero-visual-card">
              <div className="hero-image-wrapper">
                <img
                  src="/images/cherubs-outreach.jpg"
                  alt="Jehovah Jireh Alby Foundation — children outreach in Ghana"
                />
              </div>
              <div className="hero-floating-badge">
                <div className="hero-floating-icon">
                  <Heart size={22} fill="var(--navy-950)" />
                </div>
                <div>
                  <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.9rem' }}>
                    Every Child Deserves Love
                  </div>
                  <div style={{ color: 'var(--gold-300)', fontSize: '0.78rem' }}>
                    Education, Hope &amp; Care · Ghana
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          BRIEF ABOUT STRIP
          ================================================================ */}
      <section className="about-strip">
        <div className="container">
          <div className="about-strip-inner">
            <div className="about-strip-icon">
              <BookOpen size={26} />
            </div>
            <div className="about-strip-text">
              <strong>Who we are:</strong>{' '}
              {settings?.description ||
                'Jehovah Jireh Alby Foundation is a Christian charitable foundation, committed to caring for orphans, street children, vulnerable children and the needy. We believe every child deserves love, hope, education and a future.'}
            </div>
            <Link to="/about" className="btn btn-outline-navy about-strip-link">
              Learn More <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT WE DO — 3 FEATURED PROGRAMS
          ================================================================ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Foundation Programs</span>
            <h2 className="section-title">How We Serve</h2>
            <p className="section-subtitle">
              Practical, compassionate Christian charity serving orphaned and less privileged children across Ghana.
            </p>
          </div>

          <div className="home-programs-grid">
            {featuredPrograms.map((item) => (
              <div key={item.id} className="home-program-card">
                <div className="home-program-icon">
                  {getWhatIcon(item.icon)}
                </div>
                <h3 className="home-program-title">{item.title}</h3>
                <p className="home-program-desc">{item.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/what-we-do" className="btn btn-outline-navy">
              <span>All Our Programs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          DONATE CALL TO ACTION BANNER
          ================================================================ */}
      <section className="home-cta-banner">
        <div className="container">
          <div className="home-cta-inner">
            <div className="home-cta-text">
              <span className="section-tag" style={{ background: 'rgba(212,175,55,0.18)', color: 'var(--gold-300)', borderColor: 'rgba(212,175,55,0.35)' }}>
                Partner With Us
              </span>
              <h2 className="home-cta-title">
                Your Support Changes a Child's Life
              </h2>
              <p className="home-cta-subtitle">
                Food, shelter, education, clothing — your donation reaches children who need it most in Ghana.
              </p>
              <div className="hero-cta-group">
                <Link to="/donate" className="btn btn-lg btn-gold">
                  <Heart size={18} fill="var(--navy-950)" />
                  <span>Give Today</span>
                </Link>
                <Link to="/contact" className="btn btn-lg btn-outline-white">
                  <span>Volunteer &amp; Inquire</span>
                </Link>
              </div>
            </div>
            <div className="home-cta-image">
              <img
                src="/images/food-clothing.jpg"
                alt="Food and clothing distribution outreach — Jehovah Jireh Alby Foundation"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
