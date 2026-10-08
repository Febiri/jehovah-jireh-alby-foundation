import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';
import { Phone, Mail, Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { settings } = useContent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/what-we-do', label: 'What We Do' },
    { to: '/projects', label: 'Projects' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Notice Bar */}
      <div className="top-notice-bar">
        <div className="top-notice-content">
          <div className="top-notice-motto">
            <span>"{settings?.motto || 'The Lord will provide'}"</span>
            <span className="scripture-tag">{settings?.scripture || 'Genesis 22:14'}</span>
          </div>
          <div className="top-notice-contact">
            <a href={`tel:${settings?.phone || '0248072279'}`} title="Call us">
              <Phone size={13} style={{ color: 'var(--gold-400)' }} />
              <span>{settings?.phone || '0248072279'}</span>
            </a>
            <a href={`mailto:${settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}`} title="Email us">
              <Mail size={13} style={{ color: 'var(--gold-400)' }} />
              <span>{settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="site-navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-link" onClick={closeMobile}>
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="nav-actions">
            <Link to="/donate" className="btn btn-gold btn-sm btn-donate-nav">
              <Heart size={15} fill="var(--navy-950)" />
              <span>Donate</span>
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-nav-drawer${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <div className="mobile-nav-panel" id="mobile-nav-panel" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Logo size="sm" />
            <button className="mobile-nav-close" onClick={closeMobile} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--gold-600)', fontWeight: 700 }}>"{settings?.motto}"</span>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{settings?.scripture}</div>
          </div>

          <ul className="mobile-nav-list">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                  onClick={closeMobile}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link to="/donate" className="btn btn-gold" onClick={closeMobile} style={{ width: '100%', justifyContent: 'center' }}>
              <Heart size={16} fill="var(--navy-950)" />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
