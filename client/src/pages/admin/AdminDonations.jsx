import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, ShieldCheck, Download, CheckCircle, Clock } from 'lucide-react';

export default function AdminDonations() {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const fetchDonations = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter) params.append('status', statusFilter);
    if (currencyFilter) params.append('currency', currencyFilter);
    if (methodFilter) params.append('method', methodFilter);
    params.append('limit', '100');

    fetch(`/api/donations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDonations(Array.isArray(data.data) ? data.data : []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const setStatus = async (id, status) => {
    if (!window.confirm(`Mark donation #${id} as ${status}?`)) return;
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      }).then(r => r.json());
      if (res.success) fetchDonations();
      else alert(res.error || 'Failed to update donation.');
    } catch (e) {
      alert('Network error updating donation.');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [search, statusFilter, currencyFilter, methodFilter]);

  const totalGHS = donations
    .filter(d => d.currency === 'GHS')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const totalUSD = donations
    .filter(d => d.currency === 'USD')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>
            Donation Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Secure log of all seeds sown into Jehovah Jireh Alby Foundation. Sensitive donor records remain confidential.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '0.65rem 1.25rem', background: 'var(--emerald-50)', border: '1px solid rgba(5, 150, 105, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--emerald-600)', fontWeight: 700 }}>Total GH₵</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>GH₵ {totalGHS.toLocaleString()}</div>
          </div>
          <div style={{ padding: '0.65rem 1.25rem', background: 'var(--blue-50)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--blue-600)', fontWeight: 700 }}>Total USD</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>$ {totalUSD.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by donor name, email, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending (awaiting receipt)</option>
          <option value="Completed">Completed (verified)</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '130px' }}
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
        >
          <option value="">All Currencies</option>
          <option value="GHS">GHS (GH₵)</option>
          <option value="USD">USD ($)</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="">All Payment Types</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>
      </div>

      {/* Donations Table */}
      <div className="data-table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Donor Info</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Date</th>
                <th>Verify</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading donations...</td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No donation records found matching criteria.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {d.transaction_ref}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                        {d.donor_name} {d.is_anonymous && <span style={{ fontSize: '0.75rem', color: 'var(--gold-600)', fontStyle: 'italic' }}>(Anonymous)</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {d.email || d.phone || 'No direct contact'}
                      </div>
                      {d.message && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                          “{d.message}”
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--navy-950)' }}>
                        {d.currency} {Number(d.amount).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{d.payment_method}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                        {d.frequency}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--emerald-50)',
                          color: 'var(--emerald-600)',
                          border: '1px solid rgba(5, 150, 105, 0.25)'
                        }}
                      >
                        {d.payment_status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {d.payment_status !== 'Completed' && (
                          <button type="button" className="btn btn-sm btn-navy" onClick={() => setStatus(d.id, 'Completed')}>
                            Confirm
                          </button>
                        )}
                        {d.payment_status !== 'Failed' && (
                          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setStatus(d.id, 'Failed')}>
                            Fail
                          </button>
                        )}
                        {d.payment_status !== 'Pending' && (
                          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setStatus(d.id, 'Pending')}>
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
