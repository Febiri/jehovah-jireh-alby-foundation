import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { FileText, Save, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminContent() {
  const { token } = useAuth();
  const { settings, whatWeDo, refreshContent } = useContent();

  const [formData, setFormData] = useState({
    description: settings?.description || '',
    mission: settings?.mission || '',
    vision: settings?.vision || '',
    motto: settings?.motto || '',
    scripture: settings?.scripture || '',
    display_title: settings?.display_title || 'JEHOVAH JIREH ALBY FOUNDATION'
  });

  const [whatItems, setWhatItems] = useState(whatWeDo || []);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const [resSettings, resWhat] = await Promise.all([
        fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }),
        fetch('/api/what-we-do', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(whatItems)
        })
      ]);

      const dataSettings = await resSettings.json();
      const dataWhat = await resWhat.json();

      if (dataSettings.success && dataWhat.success) {
        setSavedSuccess(true);
        refreshContent();
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setError('Failed to update content.');
      }
    } catch (err) {
      setError('Network error saving content.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToOfficial = () => {
    if (!window.confirm('Reset wording back to the official foundation supplied text?')) return;
    setFormData({
      display_title: 'JEHOVAH JIREH ALBY FOUNDATION',
      description: 'Jehovah jireh Alby foundation is a Christian charitable foundation, committed to caring for orphans, street children,vulnerable children and the needy. We believe every child deserves love, hope , education and a future.',
      mission: 'to provide food, shelter, education, medical support and spiritual guidance to orphaned and less privileged children in Ghana.',
      vision: 'To see every vulnerable child smile, thrive, and know that God provides.',
      motto: 'the lord will provide',
      scripture: 'Genesis 22:14'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
            Official Foundation Wording &amp; Statements
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage the sacred pillars and core messages of Jehovah Jireh Alby Foundation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToOfficial}
          className="btn btn-sm btn-outline-navy"
          title="Restore official wording"
        >
          <RefreshCw size={14} />
          <span>Restore Official Text</span>
        </button>
      </div>

      {/* Warning Notice Box */}
      <div style={{ background: 'var(--gold-50)', border: '1px solid var(--gold-300)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
        <AlertTriangle size={20} style={{ color: 'var(--gold-700)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
          <strong>Critical Requirement:</strong> The foundation's wording is official and should not be rewritten or substituted with AI-generated alternatives. Any revisions should be approved directly by foundation leadership.
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.85rem 1rem', background: 'var(--emerald-50)', border: '1px solid var(--emerald-600)', color: 'var(--emerald-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Website content updated successfully! The public site now reflects these changes.</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', background: 'var(--rose-50)', border: '1px solid var(--rose-600)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        {/* Core Wording Card */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.5rem' }}>
            Foundation Pillars
          </h2>

          <div className="form-group">
            <label className="form-label">Foundation Display Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.display_title}
              onChange={(e) => setFormData({ ...formData, display_title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Foundation Description (About Us)</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Official Mission</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Vision</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Foundation Motto</label>
              <input
                type="text"
                className="form-input"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bible Scripture Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.scripture}
                onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* What We Do Programs Card */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            What We Do Program Descriptions
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            The 5 core supplied activities of Jehovah Jireh Alby Foundation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {whatItems.map((item, index) => (
              <div key={item.id} style={{ background: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  {index + 1}. {item.title}
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Subtitle / Header Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    value={item.subtitle || ''}
                    onChange={(e) => {
                      const updated = [...whatItems];
                      updated[index].subtitle = e.target.value;
                      setWhatItems(updated);
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Program Description</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...whatItems];
                      updated[index].description = e.target.value;
                      setWhatItems(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-gold btn-lg"
            disabled={loading}
          >
            <Save size={18} />
            <span>{loading ? 'Saving Content...' : 'Publish Content Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
