import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Home as HomeIcon, Shirt, BookOpen, HeartPulse, Sun, Heart, ArrowRight } from 'lucide-react';

export default function WhatWeDo() {
  const { whatWeDo, settings, loading } = useContent();

  const getWhatIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <HomeIcon size={24} />;
      case 'Shirt': return <Shirt size={24} />;
      case 'BookOpen': return <BookOpen size={24} />;
      case 'HeartPulse': return <HeartPulse size={24} />;
      case 'Sun': return <Sun size={24} />;
      default: return <Heart size={24} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Foundation Programs
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            What We Do
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            Serving orphans, street children, vulnerable children and the needy through direct compassion, supplies, healthcare, and Christian guidance.
          </p>
        </div>
      </section>

      {/* Main Activities Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {loading ? (
              [1, 2].map(i => <div key={i} className="skeleton-card" style={{ height: '340px' }} aria-hidden="true" />)
            ) : (
            whatWeDo.map((item, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={item.id}
                  className={`what-card${isEven ? ' reverse' : ''}`}
                  style={{
                    display: 'grid',
                    gap: '3rem',
                    alignItems: 'center',
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2.5rem',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div style={{ order: isEven ? 2 : 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.9rem', background: 'var(--navy-50)', color: 'var(--navy-900)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 700, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--gold-600)' }}>{getWhatIcon(item.icon)}</span>
                      <span>Program {index + 1}</span>
                    </div>

                    <h2 className="font-heading" style={{ fontSize: '1.85rem', color: 'var(--navy-900)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                      {item.title}
                    </h2>

                    {item.subtitle && (
                      <div style={{ color: 'var(--gold-600)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                        {item.subtitle}
                      </div>
                    )}

                    <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                      {item.description}
                    </p>

                    <Link to="/donate" className="btn btn-gold">
                      <Heart size={16} fill="var(--navy-950)" />
                      <span>Support This Activity</span>
                    </Link>
                  </div>

                  <div style={{ order: isEven ? 1 : 2 }}>
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(212, 175, 55, 0.25)', height: '340px' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Scripture Callout */}
          <div style={{ marginTop: '4.5rem', padding: '3rem', background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', borderRadius: 'var(--radius-xl)', color: 'var(--white)', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-300)' }}>
              Biblical Foundation
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.65rem', color: 'var(--gold-200)', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              “{settings?.motto || 'The Lord will provide'}”
            </div>
            <div style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {settings?.scripture || 'Genesis 22:14'}
            </div>
            <p style={{ maxWidth: '680px', margin: '0 auto 2rem', color: '#cbd5e1', lineHeight: '1.7' }}>
              We invite churches, donors, and compassionate individuals to join hands with Jehovah Jireh Alby Foundation as we serve orphaned and vulnerable children across Ghana.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/donate" className="btn btn-gold btn-lg">
                <Heart size={18} fill="var(--navy-950)" />
                <span>Donate Now</span>
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                <span>Contact Our Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
