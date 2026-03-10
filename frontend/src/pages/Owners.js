import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editOwner, setEditOwner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOwners = async () => {
    try {
      const res = await API.get('/owners');
      setOwners(res.data);
    } catch (err) {
      setError('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOwners(); }, []);

  const openAddModal = () => {
    setEditOwner(null);
    setForm({ name: '', email: '', phone: '', address: '' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (owner) => {
    setEditOwner(owner);
    setForm({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      address: owner.address,
    });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditOwner(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    try {
      if (editOwner) {
        await API.put(`/owners/${editOwner.owner_id}`, form);
        setSuccess('Owner updated successfully');
      } else {
        await API.post('/owners', form);
        setSuccess('Owner added successfully');
      }
      closeModal();
      fetchOwners();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/owners/${id}`);
      setDeleteConfirm(null);
      setSuccess('Owner deleted successfully');
      fetchOwners();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete owner');
    }
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
          cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: #1f1f1f; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

        .success-bar {
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
          padding: 12px 20px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;
          display: flex; align-items: center; gap: 8px;
        }

        .table-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; }

        .table-header {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 2fr 1fr;
          padding: 14px 24px; background: #f9fafb;
          border-bottom: 1px solid #e5e7eb; font-size: 11px;
          font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;
        }

        .table-row {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 2fr 1fr;
          padding: 16px 24px; border-bottom: 1px solid #f9fafb;
          align-items: center; transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #fafafa; }

        .owner-name-cell { display: flex; align-items: center; gap: 12px; }
        .owner-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #fbbf24, #ef4444);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
        }
        .owner-name { font-size: 14px; font-weight: 500; color: #0a0a0a; }
        .cell-text { font-size: 14px; color: #374151; }
        .cell-sub { font-size: 13px; color: #9ca3af; }

        .actions { display: flex; gap: 8px; }
        .btn-edit {
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: 1px solid #e5e7eb; background: #fff; color: #374151;
          transition: all 0.15s;
        }
        .btn-edit:hover { background: #f3f4f6; }
        .btn-delete {
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: 1px solid #fecaca; background: #fff; color: #ef4444;
          transition: all 0.15s;
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
          width: 480px; max-width: 95vw;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #0a0a0a; margin-bottom: 8px; }
        .modal-subtitle { font-size: 14px; color: #9ca3af; margin-bottom: 28px; }

        .form-field { margin-bottom: 18px; }
        .form-label { display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .form-input {
          width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #0a0a0a; outline: none; transition: all 0.2s;
        }
        .form-input:focus { border-color: #0a0a0a; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }

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

        /* DELETE CONFIRM */
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
        <div className="loading-screen">Loading owners...</div>
      ) : (
        <div className="page-root">
          <Navbar />
          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Owners</h1>
                <p className="page-subtitle">{owners.length} owner{owners.length !== 1 ? 's' : ''} registered</p>
              </div>
              <button className="btn-primary" onClick={openAddModal}>
                + Add Owner
              </button>
            </div>

            {/* Success message */}
            {success && (
              <div className="success-bar">✅ {success}</div>
            )}

            {/* Table */}
            <div className="table-card">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Address</span>
                <span>Actions</span>
              </div>

              {owners.length === 0 ? (
                <div className="empty-state">No owners found. Add one to get started.</div>
              ) : (
                owners.map((owner) => (
                  <div className="table-row" key={owner.owner_id}>
                    <div className="owner-name-cell">
                      <div className="owner-avatar">
                        {owner.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="owner-name">{owner.name}</span>
                    </div>
                    <span className="cell-text">{owner.email}</span>
                    <span className="cell-text">{owner.phone}</span>
                    <span className="cell-sub">{owner.address}</span>
                    <div className="actions">
                      <button className="btn-edit" onClick={() => openEditModal(owner)}>Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirm(owner)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editOwner ? 'Edit Owner' : 'Add New Owner'}</h2>
            <p className="modal-subtitle">{editOwner ? 'Update owner details below' : 'Fill in the details to add a new owner'}</p>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Raj Sharma" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="e.g. raj@gmail.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="e.g. 9876543210" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="e.g. Pune, Maharashtra" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>
                {editOwner ? 'Save Changes' : 'Add Owner'}
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
            <h2 className="delete-title">Delete Owner?</h2>
            <p className="delete-desc">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              This will also delete all their properties and leases.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm.owner_id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Owners;