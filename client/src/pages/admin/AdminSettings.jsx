import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import Logo from '../../components/Logo';
import {
  Settings,
  Save,
  Upload,
  Lock,
  Smartphone,
  Landmark,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export default function AdminSettings() {
  const { token, user } = useAuth();
  const { settings, refreshContent } = useContent();

  const [formData, setFormData] = useState({
    foundation_name: settings?.foundation_name || 'Jehovah jireh Alby foundation',
    display_title: settings?.display_title || 'JEHOVAH JIREH ALBY FOUNDATION',
    phone: settings?.phone || '0248072279',
    email: settings?.email || 'Jehovahjirehalbyfoundation@gmail.com',
    tiktok: settings?.tiktok || '@jjaf_ghana',
    instagram: settings?.instagram || 'Jehovah jireh Alby Foundation',
    snapchat: settings?.snapchat || 'jjaf.foundation',
    momo_network: settings?.momo_network || 'MTN Mobile Money / Telecel Cash / AT Money',
    momo_number: settings?.momo_number || '0248072279',
    momo_account_name: settings?.momo_account_name || 'Jehovah Jireh Alby Foundation',
    momo_instructions: settings?.momo_instructions || '',
    bank_name: settings?.bank_name || '',
    bank_account_name: settings?.bank_account_name || '',
    bank_account_number: settings?.bank_account_number || '',
    bank_branch: settings?.bank_branch || '',
    bank_instructions: settings?.bank_instructions || '',
    custom_logo_url: settings?.custom_logo_url || '',
    stats_public_visible: Boolean(settings?.stats_public_visible),
    stat_children_supported: settings?.stat_children_supported || 0,
    stat_orphanages_supported: settings?.stat_orphanages_supported || 0,
    stat_projects_completed: settings?.stat_projects_completed || 1,
    stat_donations_received: settings?.stat_donations_received || 0
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Settings updated successfully!');
        refreshContent();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
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
        setFormData(prev => ({ ...prev, custom_logo_url: result.url }));
      }
    } catch (err) {
      alert('Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 10) {
      setPasswordError('Password must be at least 10 characters with upper-case, lower-case and a number.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();
      if (data.success) {
        setPasswordSuccess('Password successfully updated!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Network error while updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
          Foundation Settings &amp; Configuration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Configure foundation contact information, official logo, donation credentials, and administrator security.
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem 1rem', background: 'var(--emerald-50)', border: '1px solid var(--emerald-600)', color: 'var(--emerald-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        {/* Official Brand Identity & Logo */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Brand Identity &amp; Official Logo
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Active Brand Logo
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                <img
                  src={formData.custom_logo_url || '/images/logo.svg'}
                  alt="Official Logo"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {formData.custom_logo_url ? 'Custom Uploaded Logo' : 'Official Navy & Gold Vector Seal'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Preserves official navy-blue and gold colors
                  </div>
                  {formData.custom_logo_url && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, custom_logo_url: '' }))}
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: '0.75rem', color: 'var(--rose-600)', padding: 0 }}
                    >
                      Reset to Official Vector Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Upload New Official Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Accepts PNG, JPG, WebP, or SVG. Uploaded files instantly update the logo across the entire website and dashboard.
              </div>
              {uploadingLogo && <div style={{ fontSize: '0.8rem', color: 'var(--gold-600)', marginTop: '0.25rem' }}>Uploading new logo...</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Official Foundation Legal Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.foundation_name}
                onChange={(e) => setFormData({ ...formData, foundation_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Display Heading Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.display_title}
                onChange={(e) => setFormData({ ...formData, display_title: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Contact Information & Socials */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Contact Channels &amp; Social Profiles
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Primary Telephone Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">TikTok Handle</label>
              <input
                type="text"
                className="form-input"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram Profile Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Snapchat Handle</label>
              <input
                type="text"
                className="form-input"
                value={formData.snapchat}
                onChange={(e) => setFormData({ ...formData, snapchat: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Mobile Money & Bank Credentials Configuration */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Ghanaian Donation Payment Gateways &amp; Accounts
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Maintain official Mobile Money and Bank transfer details for public donation instructions.
          </p>

          <div style={{ background: 'var(--gold-50)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-200)', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={18} style={{ color: 'var(--gold-700)' }} />
              <span>Mobile Money Settings (Ghana)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Supported Networks</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.momo_network}
                  onChange={(e) => setFormData({ ...formData, momo_network: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">MoMo Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.momo_number}
                  onChange={(e) => setFormData({ ...formData, momo_number: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.momo_account_name}
                  onChange={(e) => setFormData({ ...formData, momo_account_name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Instructions Shown to Donors</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={formData.momo_instructions}
                onChange={(e) => setFormData({ ...formData, momo_instructions: e.target.value })}
              />
            </div>
          </div>

          <div style={{ background: 'var(--navy-50)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--navy-100)' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={18} style={{ color: 'var(--navy-700)' }} />
              <span>Bank Wire / Direct Transfer Settings</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. GCB Bank / Ecobank Ghana"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bank_account_name}
                  onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bank Instructions</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={formData.bank_instructions}
                onChange={(e) => setFormData({ ...formData, bank_instructions: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Impact Statistics Management (No Fake Stats) */}
        <div className="data-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Impact &amp; Statistics Display
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Strict guideline: Do not create fake numbers. Keep hidden until real statistics are verified.
          </p>

          <label className="form-checkbox-label" style={{ marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              checked={formData.stats_public_visible}
              onChange={(e) => setFormData({ ...formData, stats_public_visible: e.target.checked })}
            />
            <span style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
              Enable Public Verified Statistics Bar on Homepage
            </span>
          </label>

          {formData.stats_public_visible && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Children Supported Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.stat_children_supported}
                  onChange={(e) => setFormData({ ...formData, stat_children_supported: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Orphanages Visited Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.stat_orphanages_supported}
                  onChange={(e) => setFormData({ ...formData, stat_orphanages_supported: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Projects Completed Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.stat_projects_completed}
                  onChange={(e) => setFormData({ ...formData, stat_projects_completed: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
            <Save size={18} />
            <span>{loading ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* Administrator Security & Password Change */}
      <div className="data-table-card" style={{ padding: '2rem' }}>
        <h2 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
          Administrator Password &amp; Security
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Logged in as <strong>{user?.email}</strong>. Update your master password with bcrypt hashing.
        </p>

        {passwordSuccess && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--emerald-50)', border: '1px solid var(--emerald-600)', color: 'var(--emerald-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--rose-50)', border: '1px solid var(--rose-600)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ maxWidth: '500px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-current-password">Current Password</label>
            <input
              id="admin-current-password"
              type="password"
              className="form-input"
              required
              autoComplete="current-password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-new-password">New Password (min 10 chars, upper + lower + number)</label>
            <input
              id="admin-new-password"
              type="password"
              className="form-input"
              required
              autoComplete="new-password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-confirm-password">Confirm New Password</label>
            <input
              id="admin-confirm-password"
              type="password"
              className="form-input"
              required
              autoComplete="new-password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-navy" disabled={passwordLoading}>
            <Lock size={15} />
            <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', maxWidth: '640px' }}>
          <h3 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Data &amp; Backups
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
            Storage is currently a local JSON file. Download a backup regularly and store it offsite until managed database storage is configured.
          </p>
          <a
            className="btn btn-navy btn-sm"
            href="/api/admin/export"
            onClick={(e) => {
              e.preventDefault();
              fetch('/api/admin/export', { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json())
                .then(data => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `jjaf-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                })
                .catch(() => alert('Backup download failed.'));
            }}
          >
            Download JSON backup
          </a>
        </div>
      </div>
    </div>
  );
}
