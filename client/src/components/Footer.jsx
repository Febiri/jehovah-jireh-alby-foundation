import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';
import { Phone, Mail, MapPin, Heart, ArrowRight, BookOpen } from 'lucide-react';

export default function Footer() {
  const { settings } = useContent();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Foundation Profile */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo size="md" lightTheme={true} />
            </div>

            <div className="footer-brand-motto">
              “{settings?.motto || 'The Lord will provide'}” — <span style={{ color: 'var(--gold-400)' }}>{settings?.scripture || 'Genesis 22:14'}</span>
            </div>

            <p className="footer-desc">
              {settings?.description ||
                'Jehovah Jireh Alby Foundation is a Christian charitable foundation caring for orphans, street children, vulnerable children and the needy. Every child deserves love, hope, education and a future.'}
            </p>

            <Link to="/donate" className="btn btn-sm btn-gold">
              <Heart size={14} fill="var(--navy-950)" />
              <span>Support Our Mission</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> Home</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/about"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> About Us</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/what-we-do"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> What We Do</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/projects"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> Projects / Events</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/gallery"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> Gallery</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/donate"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> Donate</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/contact"><ArrowRight size={13} style={{ color: 'var(--gold-500)' }} /> Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Contact Foundation</h4>
            <div className="footer-contact-item">
              <Phone size={17} style={{ color: 'var(--gold-500)', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: 700 }}>Phone / Mobile</div>
                <a href={`tel:+233${String(settings?.phone || '0248072279').replace(/\D/g, '').replace(/^0/, '')}`} style={{ color: '#f1f5f9', fontWeight: 600 }}>
                  {settings?.phone ? `${settings.phone} (+233 ${String(settings.phone).replace(/\D/g, '').replace(/^0/, '')})` : '0248072279 (+233 248 072 279)'}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={17} style={{ color: 'var(--gold-500)', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: 700 }}>Official Email</div>
                <a href={`mailto:${settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}`} style={{ color: '#f1f5f9', wordBreak: 'break-all' }}>
                  {settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={17} style={{ color: 'var(--gold-500)', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: 700 }}>Region</div>
                <span>Ghana, West Africa (Kumasi / Santasi Apire & Nationwide)</span>
              </div>
            </div>
          </div>

          {/* Social Media Channels */}
          <div>
            <h4 className="footer-heading">Connect With Us</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
              Follow our community outreach, orphanage visits, and donation distributions across our social platforms:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* TikTok */}
              <a
                href={`https://www.tiktok.com/${(settings?.tiktok || '@jjaf_ghana').replace(/^@/, '@')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-badge">TikTok</span>
                <span>{settings?.tiktok || '@jjaf_ghana'}</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/jehovahjirehalbyfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-badge">Instagram</span>
                <span>{settings?.instagram || 'Jehovah Jireh Alby Foundation'}</span>
              </a>

              {/* Snapchat */}
              <a
                href={`https://www.snapchat.com/add/${(settings?.snapchat || 'jjaf.foundation')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-badge">Snapchat</span>
                <span>{settings?.snapchat || 'jjaf.foundation'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © 2026 Jehovah Jireh Alby Foundation. All Rights Reserved.
          </div>

          <div className="footer-bottom-scripture">
            <BookOpen size={16} />
            <span>“{settings?.motto || 'The Lord will provide'}” — {settings?.scripture || 'Genesis 22:14'}</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/privacy" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Terms</Link>
            <Link to="/safeguarding" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Safeguarding</Link>
            <Link to="/transparency" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Transparency</Link>
          </div>

          <div>
            <span style={{ color: '#475569', fontSize: '0.8rem' }}>
              Registered Charitable Foundation · Ghana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
