import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const navItems = [
    { path: '/dashboard',  label: 'Dashboard',  icon: '📊' },
    { path: '/owners',     label: 'Owners',      icon: '👤' },
    { path: '/properties', label: 'Properties',  icon: '🏠' },
    { path: '/tenants',    label: 'Tenants',     icon: '🧑‍🤝‍🧑' },
    { path: '/leases',     label: 'Leases',      icon: '📄' },
    { path: '/payments', label: 'Payments', icon: '💰' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 24px;
          margin-bottom: 40px;
        }

        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          background: #fbbf24;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .sidebar-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #fff;
          font-weight: 700;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 0 24px;
          margin-bottom: 8px;
          font-family: 'DM Sans', sans-serif;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 12px;
          flex: 1;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          border: 1px solid transparent;
          text-decoration: none;
        }

        .sidebar-item:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
        }

        .sidebar-item.active {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.1);
        }

        .sidebar-item-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 16px 24px;
        }

        .sidebar-bottom {
          padding: 0 12px;
        }

        .sidebar-admin {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }

        .sidebar-admin-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #fbbf24, #ef4444);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #fff;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }

        .sidebar-admin-info {
          flex: 1;
          overflow: hidden;
        }

        .sidebar-admin-name {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-admin-role {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .sidebar-logout:hover {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }
      `}</style>

      <div className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏠</div>
          <span className="sidebar-logo-text">RentAdmin</span>
        </div>

        {/* Nav Items */}
        <div className="sidebar-section-label">Main Menu</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom - Admin Info + Logout */}
        <div className="sidebar-divider" />
        <div className="sidebar-bottom">
          <div className="sidebar-admin">
            <div className="sidebar-admin-avatar">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="sidebar-admin-info">
              <div className="sidebar-admin-name">{admin?.name || 'Admin'}</div>
              <div className="sidebar-admin-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;