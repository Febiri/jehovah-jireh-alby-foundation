import React from 'react';
import { Outlet, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import Logo from '../../components/Logo';
import {
  LayoutDashboard,
  CalendarDays,
  Image as ImageIcon,
  HeartHandshake,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Shield
} from 'lucide-react';

export default function AdminLayout() {
  const { user, token, logout, loading } = useAuth();
  const { settings } = useContent();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading Admin Session...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Logo size="sm" lightTheme={true} showText={false} />
          <div>
            <div style={{ color: 'var(--white)', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
              JJAF CMS
            </div>
            <div style={{ color: 'var(--gold-400)', fontSize: '0.7rem', fontWeight: 600 }}>
              ADMINISTRATION
            </div>
          </div>
        </div>

        <ul className="admin-nav-list">
          <li className="admin-nav-item">
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
              <CalendarDays size={18} />
              <span>Projects &amp; Events</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ImageIcon size={18} />
              <span>Gallery Management</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/donations" className={({ isActive }) => (isActive ? 'active' : '')}>
              <HeartHandshake size={18} />
              <span>Donation Records</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'active' : '')}>
              <MessageSquare size={18} />
              <span>Contact Messages</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/content" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FileText size={18} />
              <span>Foundation Wording</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Settings size={18} />
              <span>Settings &amp; Logo</span>
            </NavLink>
          </li>
        </ul>

        <div className="admin-user-footer">
          <div>
            <div style={{ color: 'var(--white)', fontSize: '0.85rem', fontWeight: 600 }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ color: 'var(--gold-400)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
              {user?.role || 'Admin'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            style={{ color: '#94a3b8', padding: '0.4rem', borderRadius: '4px' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main-content">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              {settings?.display_title || 'JEHOVAH JIREH ALBY FOUNDATION'}
            </span>
            <span style={{ fontSize: '0.75rem', background: 'var(--gold-50)', color: 'var(--gold-700)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700, border: '1px solid var(--gold-200)' }}>
              Live Connected CMS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-navy"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>View Public Website</span>
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rose-600)' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
