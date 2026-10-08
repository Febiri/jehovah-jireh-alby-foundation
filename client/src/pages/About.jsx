import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Logo from '../components/Logo';
import { Heart, Sun, BookOpen, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  const { settings, whatWeDo } = useContent();

  return (
    <div>
      {/* Page Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 4rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo size="lg" lightTheme={true} showText={false} />
          </div>
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Faith • Hope • Compassion
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            About Jehovah Jireh Alby Foundation
          </h1>
          <div style={{ fontStyle: 'italic', color: 'var(--gold-200)', fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
            “{settings?.motto || 'The Lord will provide'}” — {settings?.scripture || 'Genesis 22:14'}
          </div>
        </div>
      </section>

      {/* Official Foundation Narrative */}
      <section className="section">
        <div className="container container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">Our Identity</span>
            <h2 className="section-title">A Christian Charitable Calling</h2>
          </div>

          <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '3rem', background: 'var(--navy-900)', color: 'var(--gold-400)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Official Foundation Wording
            </div>

            <p style={{ fontSize: '1.25rem', lineHeight: '1.85', color: 'var(--navy-950)', marginBottom: '2rem' }}>
              “{settings?.description ||
                'Jehovah Jireh Alby Foundation is a Christian charitable foundation caring for orphans, street children, vulnerable children and the needy. Every child deserves love, hope, education and a future.'}”
            </p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-700)', fontWeight: 700 }}>
                <BookOpen size={18} />
                <span>Scriptural Anchor: {settings?.scripture || 'Genesis 22:14'}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                Motto: “{settings?.motto || 'The Lord will provide'}”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Detailed Breakdown */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Sacred Pillars</span>
            <h2 className="section-title">Mission &amp; Vision</h2>
            <p className="section-subtitle">
              Our service to vulnerable children in Ghana is anchored in practical assistance and spiritual guidance.
            </p>
          </div>

          <div className="mission-vision-grid">
            {/* Mission */}
            <div className="mv-card">
              <div className="mv-icon-box">
                <Heart size={30} />
              </div>
              <h3 className="mv-card-title">Our Mission</h3>
              <p className="mv-card-text" style={{ fontSize: '1.15rem' }}>
                “{settings?.mission ||
                  'to provide food, shelter, education, medical support and spiritual guidance to orphaned and less privileged children in Ghana.'}”
              </p>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--navy-800)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-600)' }} />
                  <span>Wholesome nutrition and food drives</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-600)' }} />
                  <span>Bedding, mattresses and shelter aid</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-600)' }} />
                  <span>Educational books and school kits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-600)' }} />
                  <span>Medical and healthcare screenings</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-600)' }} />
                  <span>Spiritual encouragement &amp; fellowship</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="mv-card">
              <div className="mv-icon-box">
                <Sun size={30} />
              </div>
              <h3 className="mv-card-title">Our Vision</h3>
              <p className="mv-card-text" style={{ fontSize: '1.15rem' }}>
                “{settings?.vision ||
                  'To see every vulnerable child smile, thrive, and know that God provides.'}”
              </p>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                Every outreach we organize at Cherubs and other orphanage homes in Ghana is committed to transforming this vision into tangible reality: bringing authentic smiles, dignity, hope, and the assurance of God's steadfast provision.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Summary */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Action &amp; Impact</span>
            <h2 className="section-title">How We Serve</h2>
            <p className="section-subtitle">
              The core areas of compassionate intervention carried out by Jehovah Jireh Alby Foundation.
            </p>
          </div>

          <div className="activities-grid">
            {whatWeDo.map((item) => (
              <div key={item.id} className="activity-card">
                <div className="activity-image-box" style={{ height: '200px' }}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="activity-content">
                  <h3 className="activity-title" style={{ fontSize: '1.15rem' }}>{item.title}</h3>
                  <p className="activity-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/donate" className="btn btn-gold btn-lg">
              <Heart size={18} fill="var(--navy-950)" />
              <span>Partner With Our Mission</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
