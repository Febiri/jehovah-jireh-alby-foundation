import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import Lightbox from '../components/Lightbox';
import { Tag, Sparkles } from 'lucide-react';

export default function Gallery() {
  const { gallery, loading } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);

  // Extract unique categories that actually have items
  const categories = ['All', ...new Set(gallery.map(g => g.category).filter(Boolean))];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div>
      {/* Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Photo Archives
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            Foundation Gallery
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            Inspiring photographic moments of dignity, outreach, smiles, and community support in Ghana.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          {/* Category Filters (only categories that have items) */}
          <div className="gallery-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="skeleton-grid" aria-busy="true" aria-label="Loading gallery">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-lg)' }}>
              <Sparkles size={36} style={{ color: 'var(--gold-500)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--navy-900)', marginBottom: '0.5rem' }}>No photos in this album yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Please check back soon — new outreach photos are added regularly.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setActiveLightboxItem(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open photo: ${item.title || item.caption || 'outreach photo'}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxItem(item); } }}
                >
                  <img src={item.image} alt={item.title || item.caption} loading="lazy" />
                  <div className="gallery-card-overlay">
                    <span className="gallery-card-category">{item.category}</span>
                    <div className="gallery-card-title">{item.title}</div>
                    <div className="gallery-card-caption">{item.caption}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <Lightbox item={activeLightboxItem} onClose={() => setActiveLightboxItem(null)} />
      )}
    </div>
  );
}
