import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Leases = () => {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewLease, setViewLease] = useState(null);
  const [leaseDetails, setLeaseDetails] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    tenant_id: '', property_id: '', start_date: '',
    end_date: '', deposit_amount: '', lease_status: 'Active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [leasesRes, tenantsRes, propertiesRes] = await Promise.all([
        API.get('/leases'),
        API.get('/tenants'),
        API.get('/properties'),
      ]);
      setLeases(leasesRes.data);
      setTenants(tenantsRes.data);
      setProperties(propertiesRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setForm({
      tenant_id: '', property_id: '', start_date: '',
      end_date: '', deposit_amount: '', lease_status: 'Active'
    });
    setShowModal(true);
    setError('');
  };

  const openViewLease = async (lease) => {
    setViewLease(lease);
    try {
      const res = await API.get(`/leases/${lease.lease_id}/details`);
      setLeaseDetails(res.data);
    } catch (err) {
      setLeaseDetails(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const closeView = () => {
    setViewLease(null);
    setLeaseDetails(null);
  };

  const handleSubmit = async () => {
    if (!form.tenant_id || !form.property_id || !form.start_date || !form.end_date || !form.deposit_amount) {
      setError('All fields are required');
      return;
    }
    try {
      await API.post('/leases', form);
      setSuccess('Lease created successfully');
      closeModal();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleStatusUpdate = async (lease_id, newStatus) => {
    try {
      await API.put(`/leases/${lease_id}/status`, { lease_status: newStatus });
      setSuccess(`Lease marked as ${newStatus}`);
      closeView();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/leases/${id}`);
      setDeleteConfirm(null);
      setSuccess('Lease deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete lease');
    }
  };

  const getTenantName = (id) => {
    const t = tenants.find(t => t.tenant_id === id);
    return t ? t.name : 'Unknown';
  };

  const getPropertyTitle = (id) => {
    const p = properties.find(p => p.property_id === id);
    return p ? p.title : 'Unknown';
  };

  const statusColor = (status) => {
    if (!status) return { bg: '#f3f4f6', text: '#6b7280' };
    const s = status.toLowerCase();
    if (s === 'active') return { bg: '#f0fdf4', text: '#16a34a' };
    if (s === 'completed') return { bg: '#f3f4f6', text: '#6b7280' };
    if (s === 'cancelled') return { bg: '#fef2f2', text: '#ef4444' };
    return { bg: '#f3f4f6', text: '#6b7280' };
  };

  const filteredLeases = filterStatus === 'All'
    ? leases
    : leases.filter(l => l.lease_status === filterStatus);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .page-root { display: flex; min-height: 100vh; background: #f5f5f0; font-family: 'DM Sans', sans-serif; }
        .page-content { margin-left: 240px; flex: 1; padding: 40px; }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0a0a0a; margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: #9ca3af; }

        .btn-primary {
          background: #0a0a0a; color: #fff; border: none; padding: 12px 24px;
          border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s ease;
        }
        .btn-primary:hover { background: #1f1f1f; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

        .filter-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
        .filter-tab {
          padding: 8px 20px; border-radius: 100px; font-size: 13px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; transition: all 0.2s;
        }
        .filter-tab.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
        .filter-tab:hover:not(.active) { background: #f3f4f6; }

        .success-bar {
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
          padding: 12px 20px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;
        }

        /* TABLE */
        .table-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; }
        .table-header {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1.2fr 1.2fr;
          padding: 14px 24px; background: #f9fafb;
          border-bottom: 1px solid #e5e7eb; font-size: 11px;
          font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;
        }
        .table-row {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1.2fr 1.2fr;
          padding: 16px 24px; border-bottom: 1px solid #f9fafb;
          align-items: center; transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #fafafa; }

        .cell-main { font-size: 14px; font-weight: 500; color: #0a0a0a; }
        .cell-sub { font-size: 13px; color: #9ca3af; }
        .cell-text { font-size: 14px; color: #374151; }

        .status-badge {
          font-size: 11px; font-weight: 500; padding: 4px 10px;
          border-radius: 100px; text-transform: capitalize; display: inline-block;
        }

        .actions { display: flex; gap: 6px; }
        .btn-view {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #bfdbfe; background: #eff6ff; color: #2563eb; transition: all 0.15s;
        }
        .btn-view:hover { background: #dbeafe; }
        .btn-delete {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #fecaca; background: #fff; color: #ef4444; transition: all 0.15s;
        }
        .btn-delete:hover { background: #fef2f2; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: #fff; border-radius: 16px; padding: 36px;
          width: 540px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #0a0a0a; margin-bottom: 8px; }
        .modal-subtitle { font-size: 14px; color: #9ca3af; margin-bottom: 28px; }

        /* Lease Detail View */
        .detail-section { margin-bottom: 24px; }
        .detail-section-title {
          font-size: 11px; font-weight: 500; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
        }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .detail-item { background: #f9fafb; border-radius: 10px; padding: 12px 16px; }
        .detail-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .detail-value { font-size: 14px; color: #0a0a0a; font-weight: 500; }

        .lease-status-section {
          background: #0a0a0a; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;
        }
        .lease-status-title { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .lease-status-buttons { display: flex; gap: 8px; }
        .btn-status {
          flex: 1; padding: 10px; border-radius: 8px; font-size: 13px;
          font-family: 'DM Sans', sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08); color: #fff; transition: all 0.2s;
        }
        .btn-status:hover { background: rgba(255,255,255,0.15); }
        .btn-status-complete { border-color: #34d399; color: #34d399; }
        .btn-status-complete:hover { background: rgba(52,211,153,0.15); }
        .btn-status-cancel { border-color: #f87171; color: #f87171; }
        .btn-status-cancel:hover { background: rgba(248,113,113,0.15); }

        /* FORM */
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-field { margin-bottom: 18px; }
        .form-label { display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .form-input, .form-select {
          width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #0a0a0a; outline: none; transition: all 0.2s; background: #fff;
        }
        .form-input:focus, .form-select:focus { border-color: #0a0a0a; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }
        .form-error { color: #ef4444; font-size: 13px; margin-bottom: 16px; }

        .modal-actions { display: flex; gap: 12px; margin-top: 8px; }
        .btn-cancel {
          flex: 1; padding: 12px; border-radius: 10px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1.5px solid #e5e7eb; background: #fff; color: #374151; transition: all 0.2s;
        }
        .btn-cancel:hover { background: #f3f4f6; }
        .btn-save {
          flex: 1; padding: 12px; border-radius: 10px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: none; background: #0a0a0a; color: #fff; transition: all 0.2s;
        }
        .btn-save:hover { background: #1f1f1f; }

        .delete-modal { text-align: center; }
        .delete-icon { font-size: 48px; margin-bottom: 16px; }
        .delete-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #0a0a0a; margin-bottom: 8px; }
        .delete-desc { font-size: 14px; color: #9ca3af; margin-bottom: 28px; }
        .btn-confirm-delete {
          flex: 1; padding: 12px; border-radius: 10px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: none; background: #ef4444; color: #fff; transition: all 0.2s;
        }
        .btn-confirm-delete:hover { background: #dc2626; }

        .empty-state { padding: 60px; text-align: center; color: #9ca3af; font-size: 15px; }
        .loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 16px; color: #9ca3af; }
      `}</style>

      {loading ? (
        <div className="loading-screen">Loading leases...</div>
      ) : (
        <div className="page-root">
          <Navbar />
          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Leases</h1>
                <p className="page-subtitle">{leases.length} lease{leases.length !== 1 ? 's' : ''} total</p>
              </div>
              <button className="btn-primary" onClick={openAddModal}>+ New Lease</button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              {['All', 'Active', 'Completed', 'Cancelled'].map(status => (
                <button
                  key={status}
                  className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status} ({status === 'All' ? leases.length : leases.filter(l => l.lease_status === status).length})
                </button>
              ))}
            </div>

            {success && <div className="success-bar">✅ {success}</div>}

            {/* Table */}
            <div className="table-card">
              <div className="table-header">
                <span>Tenant</span>
                <span>Property</span>
                <span>Start Date</span>
                <span>End Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredLeases.length === 0 ? (
                <div className="empty-state">No leases found.</div>
              ) : (
                filteredLeases.map((lease) => (
                  <div className="table-row" key={lease.lease_id}>
                    <span className="cell-main">{getTenantName(lease.tenant_id)}</span>
                    <span className="cell-text">{getPropertyTitle(lease.property_id)}</span>
                    <span className="cell-sub">{lease.start_date?.split('T')[0]}</span>
                    <span className="cell-sub">{lease.end_date?.split('T')[0]}</span>
                    <span
                      className="status-badge"
                      style={{
                        background: statusColor(lease.lease_status).bg,
                        color: statusColor(lease.lease_status).text
                      }}
                    >
                      {lease.lease_status}
                    </span>
                    <div className="actions">
                      <button className="btn-view" onClick={() => openViewLease(lease)}>Details</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirm(lease)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* View Lease Details Modal */}
      {viewLease && leaseDetails && (
        <div className="modal-overlay" onClick={closeView}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Lease Details</h2>
            <p className="modal-subtitle">Lease #{viewLease.lease_id}</p>

            {/* Tenant Info */}
            <div className="detail-section">
              <div className="detail-section-title">Tenant Information</div>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{leaseDetails.tenant_name}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{leaseDetails.tenant_phone}</div>
                </div>
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{leaseDetails.tenant_email}</div>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="detail-section">
              <div className="detail-section-title">Property Information</div>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Property</div>
                  <div className="detail-value">{leaseDetails.property_title}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{leaseDetails.location}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Monthly Rent</div>
                  <div className="detail-value">₹{Number(leaseDetails.rent_amount).toLocaleString('en-IN')}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Deposit</div>
                  <div className="detail-value">₹{Number(leaseDetails.deposit_amount).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Lease Info */}
            <div className="detail-section">
              <div className="detail-section-title">Lease Period</div>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Start Date</div>
                  <div className="detail-value">{leaseDetails.start_date?.split('T')[0]}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">End Date</div>
                  <div className="detail-value">{leaseDetails.end_date?.split('T')[0]}</div>
                </div>
              </div>
            </div>

            {/* Update Status — only show if Active */}
            {leaseDetails.lease_status === 'Active' && (
              <div className="lease-status-section">
                <div className="lease-status-title">Update Lease Status</div>
                <div className="lease-status-buttons">
                  <button
                    className="btn-status btn-status-complete"
                    onClick={() => handleStatusUpdate(viewLease.lease_id, 'Completed')}
                  >
                    ✅ Mark Completed
                  </button>
                  <button
                    className="btn-status btn-status-cancel"
                    onClick={() => handleStatusUpdate(viewLease.lease_id, 'Cancelled')}
                  >
                    ❌ Mark Cancelled
                  </button>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeView}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lease Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Lease</h2>
            <p className="modal-subtitle">Link a tenant to a property with lease details</p>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="form-field">
              <label className="form-label">Tenant</label>
              <select className="form-select" value={form.tenant_id}
                onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}>
                <option value="">Select a tenant</option>
                {tenants.map(t => (
                  <option key={t.tenant_id} value={t.tenant_id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Property</label>
              <select className="form-select" value={form.property_id}
                onChange={(e) => setForm({ ...form, property_id: e.target.value })}>
                <option value="">Select a property</option>
                {properties.filter(p => p.status === 'Available').map(p => (
                  <option key={p.property_id} value={p.property_id}>
                    {p.title} — {p.location} (₹{Number(p.rent_amount).toLocaleString('en-IN')}/mo)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Security Deposit (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 36000" value={form.deposit_amount}
                onChange={(e) => setForm({ ...form, deposit_amount: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>Create Lease</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">🗑️</div>
            <h2 className="delete-title">Delete Lease?</h2>
            <p className="delete-desc">
              Are you sure you want to delete this lease for{' '}
              <strong>{getTenantName(deleteConfirm.tenant_id)}</strong>?
              All associated payments will also be deleted.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm.lease_id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Leases;