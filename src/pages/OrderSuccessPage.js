import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';

const STATUS_FLOW = ['Order Placed', 'Confirmed', 'Preparing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const buyerName = location.state?.buyerName || 'Friend';
  const buyerInfo = location.state?.buyerInfo || {};
  const [show, setShow] = useState(false);

  const orderId = 'LB' + Math.floor(100000 + Math.random() * 900000);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  useEffect(() => {
    setTimeout(() => setShow(true), 100);

    // Save order to localStorage for tracking
    if (product) {
      const newOrder = {
        id: orderId,
        productId: product.id,
        productName: product.name,
        sellerName: product.sellerName,
        amount: product.price,
        status: STATUS_FLOW[1], // "Confirmed"
        date: new Date().toISOString(),
        deliveryDate: deliveryStr,
        paymentMethod: buyerInfo.paymentMethod || 'Card',
        address: buyerInfo.address || 'N/A',
        city: buyerInfo.city || 'N/A',
        pincode: buyerInfo.pincode || 'N/A',
      };

      const existing = JSON.parse(localStorage.getItem('localbuy_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('localbuy_orders', JSON.stringify(existing));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="success-layout">
      <div className={`success-card ${show ? 'visible' : ''}`}>

        {/* Checkmark Animation */}
        <div className="check-circle">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <h1>Order Placed!</h1>
        <p className="success-greeting">
          Thank you, <strong>{buyerName}</strong>! Your order has been confirmed.
        </p>

        {/* Order Details */}
        <div className="order-details-box">
          <div className="order-detail-row">
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>
          {product && (
            <div className="order-detail-row">
              <span>Item</span>
              <strong>{product.name}</strong>
            </div>
          )}
          {product && (
            <div className="order-detail-row">
              <span>Amount Paid</span>
              <strong>₹{Number(product.price).toLocaleString()}</strong>
            </div>
          )}
          <div className="order-detail-row">
            <span>Estimated Delivery</span>
            <strong>{deliveryStr}</strong>
          </div>
          <div className="order-detail-row">
            <span>Status</span>
            <span className="status-badge">✅ Confirmed</span>
          </div>
        </div>

        {/* Product Preview */}
        {product && (
          <div className="success-product-preview">
            <img
              src={`http://localhost:8080/api/products/image/${product.id}`}
              alt={product.name}
              onError={e => { e.target.src = 'https://via.placeholder.com/70x70?text=Item'; }}
            />
            <div>
              <p className="preview-name">{product.name}</p>
              <p className="preview-seller">by {product.sellerName}</p>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="whats-next">
          <h4>What happens next?</h4>
          <div className="steps-row">
            <div className="step-item">
              <span className="step-icon">📩</span>
              <p>Confirmation sent to your email</p>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <span className="step-icon">🛖</span>
              <p>Artisan prepares your order</p>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <span className="step-icon">🚚</span>
              <p>Delivered within 5 business days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <button className="btn-continue" onClick={() => navigate('/customer')}>
            🛍️ Continue Shopping
          </button>
          <button className="btn-track" onClick={() => navigate('/my-orders')}>
            📦 Track Order
          </button>
          <button className="btn-home" onClick={() => navigate('/home')}>
            Home
          </button>
        </div>

        <p className="support-text">
          Need help? Contact us at <strong>support@localbuy.in</strong>
        </p>
      </div>
    </div>
  );
}

