import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function AdminProjects() {
  const { token } = useAuth();
  const { projects, refreshContent } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '/images/cherubs-outreach.jpg',
    status_mode: 'auto', // 'auto', 'upcoming', 'current', 'completed'
    featured: false
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: '/images/cherubs-outreach.jpg',
      status_mode: 'auto',
      featured: false
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title || '',
      description: p.description || '',
      date: p.date || '',
      time: p.time || '',
      location: p.location || '',
      image: p.image || '/images/cherubs-outreach.jpg',
      status_mode: p.status_mode || 'auto',
      featured: Boolean(p.featured)
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
    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

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
      setError('Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
            Projects &amp; Events Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, update, and manage foundation charity missions. Past projects automatically resolve to Completed based on the date.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-navy">
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="data-table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Project Details</th>
                <th>Date &amp; Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Homepage Feature</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={p.image || '/images/cherubs-outreach.jpg'}
                        alt={p.title}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>{p.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{p.date || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.time || '—'}</div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--navy-800)' }}>
                      {p.location || 'Santasi Apire'}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background:
                          p.status === 'completed'
                            ? 'var(--emerald-50)'
                            : p.status === 'current'
                            ? 'var(--gold-50)'
                            : 'var(--blue-50)',
                        color:
                          p.status === 'completed'
                            ? 'var(--emerald-600)'
                            : p.status === 'current'
                            ? 'var(--gold-700)'
                            : 'var(--blue-600)',
                        border: `1px solid ${
                          p.status === 'completed'
                            ? 'rgba(5, 150, 105, 0.2)'
                            : p.status === 'current'
                            ? 'rgba(212, 175, 55, 0.4)'
                            : 'rgba(37, 99, 235, 0.2)'
                        }`
                      }}
                    >
                      {p.status}
                      {p.status_mode === 'auto' && <span style={{ opacity: 0.65, fontSize: '0.7rem' }}> (auto)</span>}
                    </span>
                  </td>

                  <td>
                    {p.featured ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-600)', fontWeight: 700, fontSize: '0.8rem' }}>
                        <Star size={14} fill="var(--gold-500)" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(p)}
                        className="btn btn-sm btn-ghost"
                        title="Edit Project"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="btn btn-sm btn-ghost"
                        style={{ color: 'var(--rose-600)' }}
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '600px', maxWidth: '95%', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'var(--text-dark)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                {editingProject ? 'Edit Project' : 'Create New Outreach Project'}
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
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Charity Donation to cherubs orphanage home- 30th September 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Project Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time &amp; Day</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Wednesday: morning 9am"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Santasi Apire"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Status Mode</label>
                  <select
                    className="form-select"
                    value={formData.status_mode}
                    onChange={(e) => setFormData({ ...formData, status_mode: e.target.value })}
                  >
                    <option value="auto">Auto (Calculated from Date)</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="form-group">
                <label className="form-label">Project Image</label>
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
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Details of the initiative, donations distributed, partner orphanage, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
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
                  {loading ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
