import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewTenant, setViewTenant] = useState(null);
  const [tenantProfile, setTenantProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', id_proof: '', occupation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTenants = async () => {
    try {
      const res = await API.get('/tenants');
      setTenants(res.data);
    } catch (err) {
      setError('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const openAddModal = () => {
    setEditTenant(null);
    setForm({ name: '', email: '', phone: '', id_proof: '', occupation: '' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (tenant) => {
    setEditTenant(tenant);
    setForm({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      id_proof: tenant.id_proof,
      occupation: tenant.occupation,
    });
    setShowModal(true);
    setError('');
  };

  const openViewProfile = async (tenant) => {
    setViewTenant(tenant);
    try {
      const res = await API.get(`/tenants/${tenant.tenant_id}/lease`);
      setTenantProfile(res.data);
    } catch (err) {
      setTenantProfile(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTenant(null);
    setError('');
  };

  const closeProfile = () => {
    setViewTenant(null);
    setTenantProfile(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    try {
      if (editTenant) {
        await API.put(`/tenants/${editTenant.tenant_id}`, form);
        setSuccess('Tenant updated successfully');
      } else {
        await API.post('/tenants', form);
        setSuccess('Tenant added successfully');
      }
      closeModal();
      fetchTenants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tenants/${id}`);
      setDeleteConfirm(null);
      setSuccess('Tenant deleted successfully');
      fetchTenants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete tenant');
    }
  };

  const statusColor = (status) => {
    if (!status) return { bg: '#f3f4f6', text: '#6b7280' };
    const s = status.toLowerCase();
    if (s === 'active') return { bg: '#f0fdf4', text: '#16a34a' };
    if (s === 'completed') return { bg: '#f3f4f6', text: '#6b7280' };
    if (s === 'cancelled') return { bg: '#fef2f2', text: '#ef4444' };
    return { bg: '#f3f4f6', text: '#6b7280' };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .page-root { display: flex; min-height: 100vh; background: #f5f5f0; font-family: 'DM Sans', sans-serif; }
        .page-content { margin-left: 240px; flex: 1; padding: 40px; }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0a0a0a; margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: #9ca3af; }

        .btn-primary {
          background: #0a0a0a; color: #fff; border: none; padding: 12px 24px;
          border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s ease;
        }
        .btn-primary:hover { background: #1f1f1f; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

        .success-bar {
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
          padding: 12px 20px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;
        }

        /* TABLE */
        .table-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; }
        .table-header {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1.5fr;
          padding: 14px 24px; background: #f9fafb;
          border-bottom: 1px solid #e5e7eb; font-size: 11px;
          font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;
        }
        .table-row {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1.5fr;
          padding: 16px 24px; border-bottom: 1px solid #f9fafb;
          align-items: center; transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #fafafa; }

        .tenant-name-cell { display: flex; align-items: center; gap: 12px; }
        .tenant-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #60a5fa, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
        }
        .tenant-name { font-size: 14px; font-weight: 500; color: #0a0a0a; }
        .cell-text { font-size: 14px; color: #374151; }
        .cell-sub { font-size: 13px; color: #9ca3af; }

        .actions { display: flex; gap: 6px; }
        .btn-view {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #bfdbfe; background: #eff6ff; color: #2563eb; transition: all 0.15s;
        }
        .btn-view:hover { background: #dbeafe; }
        .btn-edit {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #e5e7eb; background: #fff; color: #374151; transition: all 0.15s;
        }
        .btn-edit:hover { background: #f3f4f6; }
        .btn-delete {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #fecaca; background: #fff; color: #ef4444; transition: all 0.15s;
        }
        .btn-delete:hover { background: #fef2f2; }

        /* PROFILE MODAL */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: #fff; border-radius: 16px; padding: 36px;
          width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .profile-avatar {
          width: 56px; height: 56px; border-radius: 14px;
          background: linear-gradient(135deg, #60a5fa, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 22px; flex-shrink: 0;
        }
        .profile-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #0a0a0a; margin-bottom: 4px; }
        .profile-occupation { font-size: 13px; color: #9ca3af; }

        .profile-section-title {
          font-size: 11px; font-weight: 500; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
        }

        .profile-info-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
        }
        .profile-info-item {
          background: #f9fafb; border-radius: 10px; padding: 12px 16px;
        }
        .profile-info-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .profile-info-value { font-size: 14px; color: #0a0a0a; font-weight: 500; }

        .lease-card {
          background: #0a0a0a; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px;
        }
        .lease-card-title { font-family: 'Playfair Display', serif; font-size: 16px; color: #fff; margin-bottom: 16px; }
        .lease-detail-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .lease-detail-label { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; }
        .lease-detail-value { font-size: 13px; color: #fff; font-weight: 500; }
        .lease-status-badge {
          font-size: 11px; font-weight: 500; padding: 4px 10px;
          border-radius: 100px; text-transform: capitalize;
        }
        .no-lease {
          background: #f9fafb; border-radius: 12px; padding: 24px;
          text-align: center; color: #9ca3af; font-size: 14px; margin-bottom: 16px;
        }

        /* ADD/EDIT MODAL */
        .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #0a0a0a; margin-bottom: 8px; }
        .modal-subtitle { font-size: 14px; color: #9ca3af; margin-bottom: 28px; }
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
        <div className="loading-screen">Loading tenants...</div>
      ) : (
        <div className="page-root">
          <Navbar />
          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Tenants</h1>
                <p className="page-subtitle">{tenants.length} tenant{tenants.length !== 1 ? 's' : ''} registered</p>
              </div>
              <button className="btn-primary" onClick={openAddModal}>+ Add Tenant</button>
            </div>

            {success && <div className="success-bar">✅ {success}</div>}

            {/* Table */}
            <div className="table-card">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Occupation</span>
                <span>Actions</span>
              </div>

              {tenants.length === 0 ? (
                <div className="empty-state">No tenants found.</div>
              ) : (
                tenants.map((tenant) => (
                  <div className="table-row" key={tenant.tenant_id}>
                    <div className="tenant-name-cell">
                      <div className="tenant-avatar">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="tenant-name">{tenant.name}</span>
                    </div>
                    <span className="cell-text">{tenant.email}</span>
                    <span className="cell-text">{tenant.phone}</span>
                    <span className="cell-sub">{tenant.occupation}</span>
                    <div className="actions">
                      <button className="btn-view" onClick={() => openViewProfile(tenant)}>Profile</button>
                      <button className="btn-edit" onClick={() => openEditModal(tenant)}>Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirm(tenant)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewTenant && (
        <div className="modal-overlay" onClick={closeProfile}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="profile-header">
              <div className="profile-avatar">
                {viewTenant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="profile-name">{viewTenant.name}</div>
                <div className="profile-occupation">{viewTenant.occupation}</div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="profile-section-title">Personal Information</div>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <div className="profile-info-label">Email</div>
                <div className="profile-info-value">{viewTenant.email}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Phone</div>
                <div className="profile-info-value">{viewTenant.phone}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">ID Proof</div>
                <div className="profile-info-value">{viewTenant.id_proof}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Occupation</div>
                <div className="profile-info-value">{viewTenant.occupation}</div>
              </div>
            </div>

            {/* Lease Info */}
            <div className="profile-section-title">Lease Information</div>
            {tenantProfile && tenantProfile.lease_id ? (
              <div className="lease-card">
                <div className="lease-card-title">🏠 {tenantProfile.title}</div>
                <div className="lease-detail-row">
                  <span className="lease-detail-label">Location</span>
                  <span className="lease-detail-value">📍 {tenantProfile.location}</span>
                </div>
                <div className="lease-detail-row">
                  <span className="lease-detail-label">Monthly Rent</span>
                  <span className="lease-detail-value">₹{Number(tenantProfile.rent_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="lease-detail-row">
                  <span className="lease-detail-label">Start Date</span>
                  <span className="lease-detail-value">{tenantProfile.start_date?.split('T')[0]}</span>
                </div>
                <div className="lease-detail-row">
                  <span className="lease-detail-label">End Date</span>
                  <span className="lease-detail-value">{tenantProfile.end_date?.split('T')[0]}</span>
                </div>
                <div className="lease-detail-row">
                  <span className="lease-detail-label">Status</span>
                  <span
                    className="lease-status-badge"
                    style={{
                      background: statusColor(tenantProfile.lease_status).bg,
                      color: statusColor(tenantProfile.lease_status).text
                    }}
                  >
                    {tenantProfile.lease_status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-lease">No active lease found for this tenant.</div>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeProfile}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editTenant ? 'Edit Tenant' : 'Add New Tenant'}</h2>
            <p className="modal-subtitle">{editTenant ? 'Update tenant details below' : 'Fill in the details to register a new tenant'}</p>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Aryan Gupta" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="e.g. aryan@gmail.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="e.g. 9876543210" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Occupation</label>
                <input className="form-input" placeholder="e.g. Software Engineer" value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">ID Proof Type</label>
              <select className="form-select" value={form.id_proof}
                onChange={(e) => setForm({ ...form, id_proof: e.target.value })}>
                <option value="">Select ID proof</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="Passport">Passport</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>
                {editTenant ? 'Save Changes' : 'Add Tenant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">🗑️</div>
            <h2 className="delete-title">Delete Tenant?</h2>
            <p className="delete-desc">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              This will also delete all their leases and maintenance requests.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm.tenant_id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Tenants;