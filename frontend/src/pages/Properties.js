import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    owner_id: '', title: '', location: '',
    rent_amount: '', status: 'Available', description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [propRes, ownerRes] = await Promise.all([
        API.get('/properties'),
        API.get('/owners'),
      ]);
      setProperties(propRes.data);
      setOwners(ownerRes.data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setEditProperty(null);
    setForm({ owner_id: '', title: '', location: '', rent_amount: '', status: 'Available', description: '' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (property) => {
    setEditProperty(property);
    setForm({
      owner_id: property.owner_id,
      title: property.title,
      location: property.location,
      rent_amount: property.rent_amount,
      status: property.status,
      description: property.description,
    });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProperty(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.owner_id || !form.title || !form.location || !form.rent_amount) {
      setError('Owner, title, location and rent are required');
      return;
    }
    try {
      if (editProperty) {
        await API.put(`/properties/${editProperty.property_id}`, form);
        setSuccess('Property updated successfully');
      } else {
        await API.post('/properties', form);
        setSuccess('Property added successfully');
      }
      closeModal();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/properties/${id}`);
      setDeleteConfirm(null);
      setSuccess('Property deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  const getOwnerName = (owner_id) => {
    const owner = owners.find(o => o.owner_id === owner_id);
    return owner ? owner.name : 'Unknown';
  };

  const filteredProperties = filterStatus === 'All'
    ? properties
    : properties.filter(p => p.status === filterStatus);

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

        /* Filter tabs */
        .filter-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
        .filter-tab {
          padding: 8px 20px; border-radius: 100px; font-size: 13px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
          transition: all 0.2s;
        }
        .filter-tab.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
        .filter-tab:hover:not(.active) { background: #f3f4f6; }

        .success-bar {
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
          padding: 12px 20px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;
        }

        /* Property Cards Grid */
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .property-card {
          background: #fff; border-radius: 14px; border: 1px solid #e5e7eb;
          overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .property-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

        .property-card-top {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f3f4f6;
          position: relative;
        }

        .property-status-badge {
          position: absolute; top: 16px; right: 16px;
          font-size: 11px; font-weight: 500; padding: 4px 10px;
          border-radius: 100px; text-transform: capitalize;
        }

        .status-available { background: #f0fdf4; color: #16a34a; }
        .status-rented { background: #fef3c7; color: #d97706; }

        .property-icon { font-size: 28px; margin-bottom: 12px; }
        .property-title { font-size: 16px; font-weight: 500; color: #0a0a0a; margin-bottom: 4px; }
        .property-location { font-size: 13px; color: #9ca3af; }

        .property-card-bottom { padding: 16px 20px; }

        .property-detail-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 8px;
        }
        .property-detail-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
        .property-detail-value { font-size: 13px; color: #374151; font-weight: 500; }
        .property-rent { font-size: 18px; font-weight: 700; color: #0a0a0a; font-family: 'Playfair Display', serif; }

        .property-actions { display: flex; gap: 8px; margin-top: 14px; }
        .btn-edit {
          flex: 1; padding: 8px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #e5e7eb; background: #fff; color: #374151; transition: all 0.15s;
        }
        .btn-edit:hover { background: #f3f4f6; }
        .btn-delete {
          flex: 1; padding: 8px; border-radius: 8px; font-size: 12px;
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
          width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
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
        .form-textarea {
          width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #0a0a0a; outline: none; transition: all 0.2s; resize: vertical; min-height: 80px;
        }
        .form-textarea:focus { border-color: #0a0a0a; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }

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
        <div className="loading-screen">Loading properties...</div>
      ) : (
        <div className="page-root">
          <Navbar />
          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Properties</h1>
                <p className="page-subtitle">{properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} listed</p>
              </div>
              <button className="btn-primary" onClick={openAddModal}>+ Add Property</button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              {['All', 'Available', 'Rented'].map(status => (
                <button
                  key={status}
                  className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status} ({status === 'All' ? properties.length : properties.filter(p => p.status === status).length})
                </button>
              ))}
            </div>

            {success && <div className="success-bar">✅ {success}</div>}

            {/* Property Cards */}
            {filteredProperties.length === 0 ? (
              <div className="empty-state">No properties found.</div>
            ) : (
              <div className="properties-grid">
                {filteredProperties.map((property) => (
                  <div className="property-card" key={property.property_id}>
                    <div className="property-card-top">
                      <span className={`property-status-badge ${property.status === 'Available' ? 'status-available' : 'status-rented'}`}>
                        {property.status}
                      </span>
                      <div className="property-icon">🏠</div>
                      <div className="property-title">{property.title}</div>
                      <div className="property-location">📍 {property.location}</div>
                    </div>
                    <div className="property-card-bottom">
                      <div className="property-detail-row">
                        <span className="property-detail-label">Monthly Rent</span>
                        <span className="property-rent">₹{Number(property.rent_amount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="property-detail-row">
                        <span className="property-detail-label">Owner</span>
                        <span className="property-detail-value">{getOwnerName(property.owner_id)}</span>
                      </div>
                      {property.description && (
                        <div className="property-detail-row">
                          <span className="property-detail-label">Note</span>
                          <span className="property-detail-value">{property.description}</span>
                        </div>
                      )}
                      <div className="property-actions">
                        <button className="btn-edit" onClick={() => openEditModal(property)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => setDeleteConfirm(property)}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editProperty ? 'Edit Property' : 'Add New Property'}</h2>
            <p className="modal-subtitle">{editProperty ? 'Update property details below' : 'Fill in the details to list a new property'}</p>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="form-field">
              <label className="form-label">Owner</label>
              <select className="form-select" value={form.owner_id}
                onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
                <option value="">Select an owner</option>
                {owners.map(o => (
                  <option key={o.owner_id} value={o.owner_id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Property Title</label>
              <input className="form-input" placeholder="e.g. 2BHK Apartment" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Pune" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Monthly Rent (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 15000" value={form.rent_amount}
                  onChange={(e) => setForm({ ...form, rent_amount: e.target.value })} />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="e.g. Near metro station, fully furnished..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>
                {editProperty ? 'Save Changes' : 'Add Property'}
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
            <h2 className="delete-title">Delete Property?</h2>
            <p className="delete-desc">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?
              This will also delete all associated leases and payments.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm.property_id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Properties;