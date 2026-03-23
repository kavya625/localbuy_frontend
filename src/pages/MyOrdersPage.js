import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrdersPage.css';

const STATUS_STEPS = ['Order Placed', 'Confirmed', 'Preparing', 'Shipped', 'Out for Delivery', 'Delivered'];

function getStatusIndex(status) {
  return STATUS_STEPS.indexOf(status);
}

function getDaysAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Load orders from localStorage (saved on order success)
    const saved = JSON.parse(localStorage.getItem('localbuy_orders') || '[]');
    setOrders(saved);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#2D4A3E';
    if (status === 'Shipped' || status === 'Out for Delivery') return '#C4704A';
    return '#7A7570';
  };

  return (
    <div className="orders-layout">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/home')}>← Home</button>
        <div className="page-title-area">
          <h2>My Orders</h2>
          <span className="seller-name">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="orders-main">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you make a purchase.</p>
            <button className="shop-now-btn" onClick={() => navigate('/customer')}>
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const stepIndex = getStatusIndex(order.status);
              const isExpanded = expandedId === order.id;

              return (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                    <div className="order-left">
                      <div className="order-img-wrap">
                        <img
                          src={order.productImage || `http://localhost:8080/api/products/image/${order.productId}`}
                          alt={order.productName}
                          onError={e => { e.target.src = 'https://via.placeholder.com/60x60?text=Item'; }}
                        />
                      </div>
                      <div className="order-info">
                        <h4>{order.productName}</h4>
                        <p className="order-seller">by {order.sellerName}</p>
                        <p className="order-meta">Order #{order.id} · {getDaysAgo(order.date)}</p>
                      </div>
                    </div>
                    <div className="order-right">
                      <span className="order-amount">₹{Number(order.amount).toLocaleString()}</span>
                      <span
                        className="order-status-badge"
                        style={{ color: getStatusColor(order.status), borderColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                      <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded Tracking */}
                  {isExpanded && (
                    <div className="order-tracking">
                      <div className="tracking-header">
                        <h4>📍 Order Tracking</h4>
                        <p className="est-delivery">Estimated Delivery: <strong>{order.deliveryDate}</strong></p>
                      </div>

                      {/* Progress Bar */}
                      <div className="progress-track">
                        {STATUS_STEPS.map((step, idx) => (
                          <div key={step} className="progress-step">
                            <div className={`step-dot ${idx <= stepIndex ? 'done' : ''} ${idx === stepIndex ? 'active' : ''}`}>
                              {idx < stepIndex ? '✓' : idx === stepIndex ? '●' : ''}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`step-line ${idx < stepIndex ? 'done' : ''}`} />
                            )}
                            <span className={`step-label ${idx === stepIndex ? 'active-label' : ''}`}>{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="order-details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Order ID</span>
                          <span className="detail-value">#{order.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Order Date</span>
                          <span className="detail-value">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment</span>
                          <span className="detail-value">{order.paymentMethod}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Deliver To</span>
                          <span className="detail-value">{order.address}, {order.city} - {order.pincode}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
