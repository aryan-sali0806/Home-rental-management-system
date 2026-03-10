import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    owners: 0,
    properties: 0,
    tenants: 0,
    leases: 0,
    available: 0,
    rented: 0,
    pending: 0,
  });

  const [maintenance, setMaintenance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [owners, properties, tenants, leases, available, pending, maint, pays] =
          await Promise.all([
            API.get('/owners'),
            API.get('/properties'),
            API.get('/tenants'),
            API.get('/leases'),
            API.get('/properties/status/Available'),
            API.get('/payments/pending'),
            API.get('/maintenance'),
            API.get('/payments'),
          ]);

        setStats({
          owners: owners.data.length,
          properties: properties.data.length,
          tenants: tenants.data.length,
          leases: leases.data.length,
          available: available.data.length,
          rented: properties.data.length - available.data.length,
          pending: pending.data.length,
        });

        setMaintenance(maint.data.slice(0, 5));
        setPayments(pays.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statusColor = (status) => {
    if (!status) return '#6b7280';
    const s = status.toLowerCase();
    if (s === 'paid' || s === 'resolved' || s === 'active') return '#10b981';
    if (s === 'pending' || s === 'open' || s === 'in progress') return '#f59e0b';
    if (s === 'cancelled' || s === 'completed') return '#6b7280';
    return '#6b7280';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .page-root {
          display: flex;
          min-height: 100vh;
          background: #f5f5f0;
          font-family: 'DM Sans', sans-serif;
        }

        .page-content {
          margin-left: 240px;
          flex: 1;
          padding: 40px;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 36px;
        }

        .page-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #0a0a0a;
          margin-bottom: 6px;
        }

        .page-subtitle {
          font-size: 14px;
          color: #9ca3af;
        }

        .page-date {
          font-size: 13px;
          color: #9ca3af;
          background: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        /* STAT CARDS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .stat-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .stat-icon {
          font-size: 28px;
          margin-bottom: 16px;
          display: block;
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: #0a0a0a;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 13px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* QUICK INFO ROW */
        .quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .quick-card {
          background: #0a0a0a;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .quick-card-label {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .quick-card-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #fff;
        }

        .quick-card-icon {
          font-size: 32px;
          opacity: 0.6;
        }

        /* TABLES */
        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .table-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #0a0a0a;
        }

        .table-card-count {
          font-size: 12px;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .table-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid #f9fafb;
          transition: background 0.15s;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: #fafafa;
        }

        .table-row-main {
          font-size: 14px;
          color: #0a0a0a;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .table-row-sub {
          font-size: 12px;
          color: #9ca3af;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: capitalize;
        }

        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 16px;
          color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {loading ? (
        <div className="loading-screen">Loading dashboard...</div>
      ) : (
        <div className="page-root">
          <Navbar />

          <div className="page-content">

            {/* Header */}
            <div className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Dashboard</h1>
                  <p className="page-subtitle">Welcome back! Here's what's happening.</p>
                </div>
                <div className="page-date">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long', year: 'numeric',
                    month: 'long', day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
              {[
                { icon: '👤', num: stats.owners,     label: 'Total Owners',     color: '#fbbf24' },
                { icon: '🏠', num: stats.properties,  label: 'Total Properties', color: '#60a5fa' },
                { icon: '🧑‍🤝‍🧑', num: stats.tenants,   label: 'Total Tenants',    color: '#34d399' },
                { icon: '📄', num: stats.leases,      label: 'Total Leases',     color: '#f472b6' },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-card-accent" style={{ background: s.color }} />
                  <span className="stat-icon">{s.icon}</span>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Info */}
            <div className="quick-grid">
              <div className="quick-card">
                <div>
                  <div className="quick-card-label">Available</div>
                  <div className="quick-card-num">{stats.available}</div>
                </div>
                <div className="quick-card-icon">✅</div>
              </div>
              <div className="quick-card">
                <div>
                  <div className="quick-card-label">Rented Out</div>
                  <div className="quick-card-num">{stats.rented}</div>
                </div>
                <div className="quick-card-icon">🔑</div>
              </div>
              <div className="quick-card" style={{ background: stats.pending > 0 ? '#7f1d1d' : '#0a0a0a' }}>
                <div>
                  <div className="quick-card-label">Pending Payments</div>
                  <div className="quick-card-num">{stats.pending}</div>
                </div>
                <div className="quick-card-icon">⏳</div>
              </div>
            </div>

            {/* Recent Tables */}
            <div className="tables-grid">

              {/* Recent Maintenance */}
              <div className="table-card">
                <div className="table-card-header">
                  <span className="table-card-title">Maintenance Requests</span>
                  <span className="table-card-count">{maintenance.length} recent</span>
                </div>
                {maintenance.length === 0 ? (
                  <div style={{ padding: '24px', color: '#9ca3af', fontSize: '14px' }}>No requests found</div>
                ) : (
                  maintenance.map((m) => (
                    <div className="table-row" key={m.request_id}>
                      <div>
                        <div className="table-row-main">{m.description}</div>
                        <div className="table-row-sub">{m.property_title} · {m.tenant_name}</div>
                      </div>
                      <span
                        className="status-badge"
                        style={{
                          background: statusColor(m.status) + '20',
                          color: statusColor(m.status)
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Recent Payments */}
              <div className="table-card">
                <div className="table-card-header">
                  <span className="table-card-title">Recent Payments</span>
                  <span className="table-card-count">{payments.length} recent</span>
                </div>
                {payments.length === 0 ? (
                  <div style={{ padding: '24px', color: '#9ca3af', fontSize: '14px' }}>No payments found</div>
                ) : (
                  payments.map((p) => (
                    <div className="table-row" key={p.payment_id}>
                      <div>
                        <div className="table-row-main">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                        <div className="table-row-sub">{p.payment_date} · {p.payment_method}</div>
                      </div>
                      <span
                        className="status-badge"
                        style={{
                          background: statusColor(p.payment_status) + '20',
                          color: statusColor(p.payment_status)
                        }}
                      >
                        {p.payment_status}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;