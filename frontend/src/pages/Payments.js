import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    lease_id: '', amount: '', payment_date: '',
    payment_method: 'UPI', payment_status: 'Paid'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [paymentsRes, leasesRes] = await Promise.all([
        API.get('/payments'),
        API.get('/leases'),
      ]);
      setPayments(paymentsRes.data);
      setLeases(leasesRes.data);
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setForm({ lease_id: '', amount: '', payment_date: '', payment_method: 'UPI', payment_status: 'Paid' });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.lease_id || !form.amount || !form.payment_date) {
      setError('Lease, amount and date are required');
      return;
    }
    try {
      await API.post('/payments', form);
      setSuccess('Payment recorded successfully');
      closeModal();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleMarkPaid = async (payment_id) => {
    try {
      await API.put(`/payments/${payment_id}/status`, { payment_status: 'Paid' });
      setSuccess('Payment marked as Paid');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update payment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/payments/${id}`);
      setDeleteConfirm(null);
      setSuccess('Payment deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete payment');
    }
  };

  const filteredPayments = filterStatus === 'All'
    ? payments
    : payments.filter(p => p.payment_status === filterStatus);

  const totalPaid = payments
    .filter(p => p.payment_status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPending = payments
    .filter(p => p.payment_status === 'Pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

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

        /* Summary Cards */
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .summary-card {
          background: #fff; border-radius: 14px; padding: 24px;
          border: 1px solid #e5e7eb; transition: transform 0.2s ease;
        }
        .summary-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .summary-card-accent { height: 3px; border-radius: 2px; margin-bottom: 16px; }
        .summary-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .summary-amount { font-family: 'Playfair Display', serif; font-size: 28px; color: #0a0a0a; }
        .summary-count { font-size: 13px; color: #9ca3af; margin-top: 4px; }

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
          display: grid; grid-template-columns: 0.8fr 1.5fr 1.5fr 1.5fr 1.2fr 1.5fr;
          padding: 14px 24px; background: #f9fafb;
          border-bottom: 1px solid #e5e7eb; font-size: 11px;
          font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;
        }
        .table-row {
          display: grid; grid-template-columns: 0.8fr 1.5fr 1.5fr 1.5fr 1.2fr 1.5fr;
          padding: 16px 24px; border-bottom: 1px solid #f9fafb;
          align-items: center; transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #fafafa; }

        .cell-main { font-size: 15px; font-weight: 600; color: #0a0a0a; font-family: 'Playfair Display', serif; }
        .cell-text { font-size: 14px; color: #374151; }
        .cell-sub { font-size: 13px; color: #9ca3af; }

        .method-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; padding: 4px 10px; border-radius: 8px;
          background: #f3f4f6; color: #374151;
        }

        .status-badge {
          font-size: 11px; font-weight: 500; padding: 4px 10px;
          border-radius: 100px; text-transform: capitalize; display: inline-block;
        }

        .actions { display: flex; gap: 6px; align-items: center; }
        .btn-mark-paid {
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1px solid #bbf7d0; background: #f0fdf4; color: #16a34a; transition: all 0.15s;
        }
        .btn-mark-paid:hover { background: #dcfce7; }
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
          width: 480px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
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
        <div className="loading-screen">Loading payments...</div>
      ) : (
        <div className="page-root">
          <Navbar />
          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Payments</h1>
                <p className="page-subtitle">{payments.length} payment{payments.length !== 1 ? 's' : ''} recorded</p>
              </div>
              <button className="btn-primary" onClick={openAddModal}>+ Record Payment</button>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card-accent" style={{ background: '#e5e7eb' }} />
                <div className="summary-label">Total Payments</div>
                <div className="summary-amount">{payments.length}</div>
                <div className="summary-count">all records</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-accent" style={{ background: '#34d399' }} />
                <div className="summary-label">Total Collected</div>
                <div className="summary-amount">₹{totalPaid.toLocaleString('en-IN')}</div>
                <div className="summary-count">{payments.filter(p => p.payment_status === 'Paid').length} paid</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-accent" style={{ background: '#fbbf24' }} />
                <div className="summary-label">Pending Amount</div>
                <div className="summary-amount" style={{ color: totalPending > 0 ? '#d97706' : '#0a0a0a' }}>
                  ₹{totalPending.toLocaleString('en-IN')}
                </div>
                <div className="summary-count">{payments.filter(p => p.payment_status === 'Pending').length} pending</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              {['All', 'Paid', 'Pending'].map(status => (
                <button
                  key={status}
                  className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status} ({status === 'All' ? payments.length : payments.filter(p => p.payment_status === status).length})
                </button>
              ))}
            </div>

            {success && <div className="success-bar">✅ {success}</div>}

            {/* Table */}
            <div className="table-card">
              <div className="table-header">
                <span>#</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Method</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="empty-state">No payments found.</div>
              ) : (
                filteredPayments.map((payment) => (
                  <div className="table-row" key={payment.payment_id}>
                    <span className="cell-sub">#{payment.payment_id}</span>
                    <span className="cell-main">₹{Number(payment.amount).toLocaleString('en-IN')}</span>
                    <span className="cell-text">{payment.payment_date?.split('T')[0]}</span>
                    <span className="method-badge">
                      {payment.payment_method === 'UPI' ? '📱' : payment.payment_method === 'Cash' ? '💵' : '🏦'}
                      {payment.payment_method}
                    </span>
                    <span
                      className="status-badge"
                      style={{
                        background: payment.payment_status === 'Paid' ? '#f0fdf4' : '#fef3c7',
                        color: payment.payment_status === 'Paid' ? '#16a34a' : '#d97706'
                      }}
                    >
                      {payment.payment_status}
                    </span>
                    <div className="actions">
                      {payment.payment_status === 'Pending' && (
                        <button className="btn-mark-paid" onClick={() => handleMarkPaid(payment.payment_id)}>
                          ✓ Mark Paid
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => setDeleteConfirm(payment)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Record Payment</h2>
            <p className="modal-subtitle">Add a new payment entry against a lease</p>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="form-field">
              <label className="form-label">Lease</label>
              <select className="form-select" value={form.lease_id}
                onChange={(e) => setForm({ ...form, lease_id: e.target.value })}>
                <option value="">Select a lease</option>
                {leases.filter(l => l.lease_status === 'Active').map(l => (
                  <option key={l.lease_id} value={l.lease_id}>
                    Lease #{l.lease_id} — Tenant {l.tenant_id} / Property {l.property_id}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 18000" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Payment Date</label>
                <input className="form-input" type="date" value={form.payment_date}
                  onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Payment Method</label>
                <select className="form-select" value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.payment_status}
                  onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>Record Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">🗑️</div>
            <h2 className="delete-title">Delete Payment?</h2>
            <p className="delete-desc">
              Are you sure you want to delete payment of{' '}
              <strong>₹{Number(deleteConfirm.amount).toLocaleString('en-IN')}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm.payment_id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Payments;