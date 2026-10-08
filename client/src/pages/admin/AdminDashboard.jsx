import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDays,
  Image as ImageIcon,
  HeartHandshake,
  MessageSquare,
  Activity,
  ArrowUpRight,
  PlusCircle,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard Analytics...</div>;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '2.25rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-400)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Administrative Command
          </span>
          <h1 className="font-heading" style={{ fontSize: '1.85rem', color: 'var(--white)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            Welcome to the Foundation CMS
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Real-time management for projects, gallery, donations, and foundation wording.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/projects" className="btn btn-sm btn-gold">
            <PlusCircle size={15} />
            <span>Manage Projects</span>
          </Link>
          <Link to="/admin/gallery" className="btn btn-sm btn-outline-white">
            <Upload size={15} />
            <span>Upload Photo</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Projects */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Projects</div>
            <div className="kpi-value">{stats?.totalProjects || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {stats?.completedProjects || 0} completed • {stats?.upcomingProjects || 0} upcoming
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'var(--navy-50)', color: 'var(--navy-800)' }}>
            <CalendarDays size={24} />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Gallery Photos</div>
            <div className="kpi-value">{stats?.totalGallery || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-700)', marginTop: '0.35rem', fontWeight: 600 }}>
              Live in albums
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'var(--gold-50)', color: 'var(--gold-600)' }}>
            <ImageIcon size={24} />
          </div>
        </div>

        {/* Donations */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Donation Seeds</div>
            <div className="kpi-value">
              GH₵ {stats?.totalDonationGHS?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--emerald-600)', marginTop: '0.35rem', fontWeight: 600 }}>
              {stats?.totalDonationsCount || 0} gifts recorded (+ ${stats?.totalDonationUSD || 0})
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}>
            <HeartHandshake size={24} />
          </div>
        </div>

        {/* Contact Inquiries */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Inquiries</div>
            <div className="kpi-value">{stats?.totalMessages || 0}</div>
            <div style={{ fontSize: '0.75rem', color: stats?.unreadMessages > 0 ? 'var(--rose-600)' : 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 600 }}>
              {stats?.unreadMessages || 0} unread messages
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
            <MessageSquare size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Activity Stream & Quick Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* System Activity Log */}
        <div className="data-table-card">
          <div className="data-table-header">
            <div className="data-table-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--gold-600)' }} />
              <span>Foundation Activity Log</span>
            </div>
          </div>

          <div style={{ padding: '1.25rem' }}>
            {(!stats?.activityLogs || stats.activityLogs.length === 0) ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No recent activity.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.activityLogs.slice(0, 7).map((log) => (
                  <div key={log.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--navy-50)', color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>{log.action}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>{log.details}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="data-table-card" style={{ padding: '1.75rem' }}>
            <h3 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '1rem' }}>
              Direct Content Shortcuts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/admin/projects" className="btn btn-outline-navy" style={{ justifyContent: 'space-between' }}>
                <span>Create / Edit Outreach Project</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link to="/admin/gallery" className="btn btn-outline-navy" style={{ justifyContent: 'space-between' }}>
                <span>Manage Gallery &amp; Albums</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link to="/admin/donations" className="btn btn-outline-navy" style={{ justifyContent: 'space-between' }}>
                <span>Review Donor Contributions</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link to="/admin/content" className="btn btn-outline-navy" style={{ justifyContent: 'space-between' }}>
                <span>Review Official Wording</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link to="/admin/settings" className="btn btn-outline-navy" style={{ justifyContent: 'space-between' }}>
                <span>Settings &amp; Logo Upload</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div style={{ background: 'var(--gold-50)', border: '1px solid var(--gold-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', fontSize: '0.875rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sparkles size={16} style={{ color: 'var(--gold-600)' }} />
              <span>Automatic Date Computation</span>
            </div>
            <p style={{ color: 'var(--text-body)', lineHeight: '1.5' }}>
              The system automatically flags past events (like Cherubs orphanage on 30 Sept 2026) as <strong>Completed</strong> while permitting manual administrative override at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
