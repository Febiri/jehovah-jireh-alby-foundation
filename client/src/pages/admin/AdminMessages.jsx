import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Check, Trash2, Archive, MessageSquare, Reply, X } from 'lucide-react';

export default function AdminMessages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage({ ...activeMessage, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
            Contact Inquiries &amp; Messages
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Inquiries received from the public website contact form.
          </p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject &amp; Snippet</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading messages...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No messages received yet.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr
                    key={m.id}
                    style={{ background: m.status === 'unread' ? 'var(--blue-50)' : 'transparent', cursor: 'pointer' }}
                    onClick={() => setActiveMessage(m)}
                  >
                    <td>
                      <div style={{ fontWeight: m.status === 'unread' ? 800 : 600, color: 'var(--navy-900)' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.email}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: m.status === 'unread' ? 700 : 500, color: 'var(--navy-900)', fontSize: '0.9rem' }}>
                        {m.subject || 'General Inquiry'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.message}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{m.phone || '—'}</span>
                    </td>

                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: m.status === 'unread' ? 'var(--rose-50)' : 'var(--bg-light)',
                          color: m.status === 'unread' ? 'var(--rose-600)' : 'var(--text-muted)',
                          border: `1px solid ${m.status === 'unread' ? 'rgba(225, 29, 72, 0.3)' : 'var(--border-light)'}`
                        }}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {m.status === 'unread' ? (
                          <button
                            onClick={() => handleStatusChange(m.id, 'read')}
                            className="btn btn-sm btn-ghost"
                            title="Mark as Read"
                          >
                            <Check size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(m.id, 'unread')}
                            className="btn btn-sm btn-ghost"
                            title="Mark as Unread"
                          >
                            <Mail size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(m.id, 'archived')}
                          className="btn btn-sm btn-ghost"
                          title="Archive Message"
                        >
                          <Archive size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--rose-600)' }}
                          title="Delete Message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal */}
      {activeMessage && (
        <div className="lightbox-backdrop" onClick={() => setActiveMessage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '600px', maxWidth: '95%', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', color: 'var(--text-dark)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                  {activeMessage.subject || 'Contact Inquiry'}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Received {new Date(activeMessage.created_at).toLocaleString()}
                </div>
              </div>
              <button onClick={() => setActiveMessage(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div><strong>From:</strong> {activeMessage.name}</div>
              <div><strong>Email:</strong> <a href={`mailto:${activeMessage.email}`} style={{ color: 'var(--navy-700)' }}>{activeMessage.email}</a></div>
              {activeMessage.phone && <div><strong>Phone:</strong> {activeMessage.phone}</div>}
            </div>

            <div style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--navy-950)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {activeMessage.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {activeMessage.status === 'unread' ? (
                  <button
                    onClick={() => handleStatusChange(activeMessage.id, 'read')}
                    className="btn btn-sm btn-outline-navy"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(activeMessage.id, 'unread')}
                    className="btn btn-sm btn-outline-navy"
                  >
                    Mark as Unread
                  </button>
                )}
                <button
                  onClick={() => handleDelete(activeMessage.id)}
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--rose-600)' }}
                >
                  Delete
                </button>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=RE: ${encodeURIComponent(activeMessage.subject || 'Inquiry to Jehovah Jireh Alby Foundation')}`}
                className="btn btn-sm btn-gold"
              >
                <Reply size={14} />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
