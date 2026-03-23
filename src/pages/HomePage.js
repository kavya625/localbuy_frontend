import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('localbuy_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('localbuy_user');
    navigate('/login');
  };

  return (
    <div className="home-layout">
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-mark">LB</span>
          <span className="home-brand-name">LocalBuy</span>
        </div>
        <div className="home-user-bar">
          <span>Hello, <strong>{user.name || 'Friend'}</strong></span>
          <button className="track-btn" onClick={() => navigate('/my-orders')}>📦 My Orders</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="home-main">
        <div className="home-hero">
          <p className="home-eyebrow">What brings you here today?</p>
          <h1 className="home-title">Choose your<br />experience</h1>
          <p className="home-subtitle">
            LocalBuy connects artisans with buyers who care about craft and community.
          </p>
        </div>

        <div className="role-cards">
          <div className="role-card seller-card" onClick={() => navigate('/seller')}>
            <div className="role-card-icon">🛖</div>
            <div className="role-card-label">Seller</div>
            <h3>List & Sell</h3>
            <p>Showcase your handcrafted products to local buyers. Add photos, set prices, and manage your shop.</p>
            <div className="role-card-cta">Open My Shop →</div>
            <div className="role-card-deco" />
          </div>

          <div className="role-card customer-card" onClick={() => navigate('/customer')}>
            <div className="role-card-icon">🛍️</div>
            <div className="role-card-label">Customer</div>
            <h3>Browse & Buy</h3>
            <p>Explore unique handmade products from talented artisans in your community.</p>
            <div className="role-card-cta">Start Browsing →</div>
            <div className="role-card-deco" />
          </div>

          <div className="role-card track-card" onClick={() => navigate('/my-orders')}>
            <div className="role-card-icon">📦</div>
            <div className="role-card-label">Orders</div>
            <h3>Track Orders</h3>
            <p>View your order history, track delivery status, and check estimated arrival dates.</p>
            <div className="role-card-cta">View My Orders →</div>
            <div className="role-card-deco" />
          </div>
        </div>
      </main>
    </div>
  );
}
