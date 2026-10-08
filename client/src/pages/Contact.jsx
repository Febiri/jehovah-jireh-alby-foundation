import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
  const { settings, refreshContent } = useContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Thank you! Your message has been received by the Jehovah Jireh Alby Foundation team. We will respond promptly.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        refreshContent();
      } else {
        setErrorMessage(data.error || 'Failed to submit contact message.');
      }
    } catch (err) {
      setErrorMessage('Network error while sending message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Get In Touch
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            Contact Jehovah Jireh Alby Foundation
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            Reach out to our leadership team for donations, orphanage outreach inquiries, volunteer work, or prayer requests.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3.5rem', alignItems: 'start' }}>
            {/* Contact Details & Social Media */}
            <div>
              <div style={{ background: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
                <h2 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--navy-900)', marginBottom: '1.5rem' }}>
                  Direct Contact Information
                </h2>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--navy-50)', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} style={{ color: 'var(--gold-600)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Telephone &amp; Mobile Money</div>
                    <a href={`tel:${settings?.phone || '0248072279'}`} style={{ fontSize: '1.15rem', color: 'var(--navy-900)', fontWeight: 700 }}>
                      {settings?.phone || '0248072279'}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--navy-50)', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} style={{ color: 'var(--gold-600)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Official Email Address</div>
                    <a href={`mailto:${settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}`} style={{ fontSize: '1.05rem', color: 'var(--navy-900)', fontWeight: 600, wordBreak: 'break-all' }}>
                      {settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--navy-50)', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} style={{ color: 'var(--gold-600)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Headquarters &amp; Field Areas</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-body)', fontWeight: 500 }}>
                      Santasi Apire, Kumasi, Ashanti Region &amp; Nationwide, Ghana
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Social Channels */}
              <div style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--white)', marginBottom: '1.25rem' }}>
                  Official Social Media Channels
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ minWidth: '85px', textAlign: 'center', padding: '0.35rem 0.65rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem' }}>
                      TikTok
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {settings?.tiktok || '@jjaf_ghana'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ minWidth: '85px', textAlign: 'center', padding: '0.35rem 0.65rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem' }}>
                      Instagram
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {settings?.instagram || 'Jehovah jireh Alby Foundation'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ minWidth: '85px', textAlign: 'center', padding: '0.35rem 0.65rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-400)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem' }}>
                      Snapchat
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {settings?.snapchat || 'jjaf.foundation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-xl)' }}>
              <h2 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Fill out this form and our administrative team will respond to you directly.
              </p>

              {successMessage && (
                <div style={{ padding: '1rem 1.25rem', background: 'var(--emerald-50)', border: '1px solid var(--emerald-600)', color: 'var(--emerald-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{successMessage}</div>
                </div>
              )}

              {errorMessage && (
                <div style={{ padding: '1rem 1.25rem', background: 'var(--rose-50)', border: '1px solid var(--rose-600)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Priscilla Darko"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. priscilla@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 0248072279"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Orphanage donation, volunteer inquiry, prayer request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="How would you like to connect with Jehovah Jireh Alby Foundation?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-navy btn-lg"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  <Send size={18} />
                  <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
