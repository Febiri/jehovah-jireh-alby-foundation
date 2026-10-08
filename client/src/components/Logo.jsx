import React from 'react';
import { useContent } from '../context/ContentContext';

export default function Logo({ size = 'md', showText = true, lightTheme = false, className = '' }) {
  const { settings } = useContent();

  const dimensions = {
    sm: { imgWidth: 38, imgHeight: 38, titleSize: '0.85rem', subtitleSize: '0.65rem' },
    md: { imgWidth: 50, imgHeight: 50, titleSize: '1.05rem', subtitleSize: '0.725rem' },
    lg: { imgWidth: 68, imgHeight: 68, titleSize: '1.35rem', subtitleSize: '0.85rem' },
    xl: { imgWidth: 90, imgHeight: 90, titleSize: '1.65rem', subtitleSize: '0.95rem' }
  }[size] || { imgWidth: 50, imgHeight: 50, titleSize: '1.05rem', subtitleSize: '0.725rem' };

  // Use the real foundation logo — custom_logo_url from admin settings overrides, else the real logo.jpeg
  const logoSrc = settings?.custom_logo_url || '/logo.jpeg';

  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <img
        src={logoSrc}
        alt="Jehovah Jireh Alby Foundation Logo"
        width={dimensions.imgWidth}
        height={dimensions.imgHeight}
        style={{
          width: dimensions.imgWidth,
          height: dimensions.imgHeight,
          objectFit: 'contain',
          borderRadius: '4px',
          flexShrink: 0,
        }}
      />
      {showText && (
        <div className="brand-text-block">
          <span
            className="brand-title font-heading"
            style={{
              fontSize: dimensions.titleSize,
              color: lightTheme ? 'var(--white)' : 'var(--navy-900)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              display: 'block',
            }}
          >
            {settings?.display_title || 'JEHOVAH JIREH ALBY FOUNDATION'}
          </span>
          <span
            className="brand-subtitle"
            style={{
              fontSize: dimensions.subtitleSize,
              color: lightTheme ? 'var(--gold-300)' : 'var(--gold-600)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
            }}
          >
            {settings?.motto || 'The Lord Will Provide'}
          </span>
        </div>
      )}
    </div>
  );
}
