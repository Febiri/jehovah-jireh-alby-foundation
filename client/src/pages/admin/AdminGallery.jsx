import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { Plus, Trash2, Pencil, Star, Upload, X, Tag } from 'lucide-react';

export default function AdminGallery() {
  const { token } = useAuth();
  const { gallery, refreshContent } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Orphanage Visits',
    image: '/images/cherubs-outreach.jpg',
    featured: true
  });

  const categories = [
    'Charity Events',
    'Orphanage Visits',
    'Food & Clothing Drives',
    'Children & Education',
    'Healthcare',
    'Spiritual Guidance',
    'Community Outreach'
  ];

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      caption: '',
      category: 'Orphanage Visits',
      image: '/images/cherubs-outreach.jpg',
      featured: true
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'Orphanage Visits',
      image: item.image || '/images/cherubs-outreach.jpg',
      featured: Boolean(item.featured)
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.url }));
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('File upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      setError('Please provide an image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = editingItem ? `/api/gallery/${editingItem.id}` : '/api/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        refreshContent();
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save gallery item.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete photo "${title || 'this item'}"?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshContent();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Delete operation failed.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
            Gallery &amp; Album Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Upload, organize into albums, caption, and select featured pictures for the homepage preview.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-navy">
          <Plus size={16} />
          <span>Upload New Photo</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {gallery.map((item) => (
          <div
            key={item.id}
            style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ position: 'relative', height: '180px' }}>
              <img
                src={item.image}
                alt={item.title || item.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', background: 'rgba(10, 25, 47, 0.85)', color: 'var(--gold-400)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                {item.category}
              </span>
              {item.featured && (
                <span style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', background: 'var(--gold-500)', color: 'var(--navy-950)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800 }}>
                  Featured
                </span>
              )}
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                {item.title || 'Untitled Photo'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1rem', flexGrow: 1 }}>
                {item.caption || 'No caption provided.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => openEditModal(item)}
                  className="btn btn-sm btn-ghost"
                  title="Edit Caption / Category"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--rose-600)' }}
                  title="Delete Photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '560px', maxWidth: '95%', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'var(--text-dark)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                {editingItem ? 'Edit Photo Details' : 'Upload Gallery Photo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: 'var(--rose-50)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Photo Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <img
                    src={formData.image || '/images/cherubs-outreach.jpg'}
                    alt="Preview"
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {uploadingImage && <div style={{ fontSize: '0.75rem', color: 'var(--gold-600)' }}>Uploading...</div>}
                  </div>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Or enter image URL path (/images/...)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Photo Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cherubs Orphanage Book Distribution"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Album / Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Caption / Context</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the occasion, smiles, or donation impact..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Feature on Homepage Preview</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-navy"
                  disabled={loading || uploadingImage}
                >
                  {loading ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
