import React, { useEffect } from 'react';
import { X, Tag } from 'lucide-react';

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose} aria-label="Close image preview">
          <X size={32} />
        </button>

        <img src={item.image} alt={item.title || item.caption} className="lightbox-image" />

        <div className="lightbox-caption-box">
          {item.category && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              <Tag size={13} />
              <span>{item.category}</span>
            </div>
          )}
          {item.title && <h3 style={{ color: 'var(--white)', fontSize: '1.35rem', marginBottom: '0.4rem' }}>{item.title}</h3>}
          {item.caption && <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>{item.caption}</p>}
        </div>
      </div>
    </div>
  );
}
