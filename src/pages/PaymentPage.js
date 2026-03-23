import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';

    if (form.paymentMethod === 'card') {
      if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!form.expiry.trim()) newErrors.expiry = 'Expiry is required';
      if (!form.cvv.trim()) newErrors.cvv = 'CVV is required';
    }
    if (form.paymentMethod === 'upi') {
      if (!form.upiId.trim()) newErrors.upiId = 'UPI ID is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate('/order-success', {
        state: {
          product,
          buyerName: form.fullName,
          buyerInfo: {
            paymentMethod: form.paymentMethod === 'card' ? 'Credit/Debit Card' : form.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          }
        }
      });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  if (!product) {
    return (
      <div className="payment-layout">
        <div className="no-product">
          <p>No product selected.</p>
          <button onClick={() => navigate('/customer')}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-layout">
      <header className="payment-header">
        <button className="back-btn" onClick={() => navigate('/customer')}>← Back</button>
        <div className="header-brand">
          <span className="brand-mark-sm">LB</span>
          <span>LocalBuy Checkout</span>
        </div>
        <div className="secure-badge">🔒 Secure Payment</div>
      </header>

      <main className="payment-main">
        <div className="payment-grid">

          {/* LEFT — Form */}
          <div className="payment-form-section">
            <form onSubmit={handleSubmit}>

              {/* Delivery Details */}
              <div className="form-card">
                <h3>📦 Delivery Details</h3>
                <div className="form-row-2">
                  <div className="field-group">
                    <label>Full Name</label>
                    <input
                      name="fullName" placeholder="Your full name"
                      value={form.fullName} onChange={handleChange}
                    />
                    {errors.fullName && <span className="err">{errors.fullName}</span>}
                  </div>
                  <div className="field-group">
                    <label>Email</label>
                    <input
                      name="email" type="email" placeholder="you@example.com"
                      value={form.email} onChange={handleChange}
                    />
                    {errors.email && <span className="err">{errors.email}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label>Phone Number</label>
                  <input
                    name="phone" placeholder="+91 98765 43210"
                    value={form.phone} onChange={handleChange}
                  />
                  {errors.phone && <span className="err">{errors.phone}</span>}
                </div>

                <div className="field-group">
                  <label>Delivery Address</label>
                  <textarea
                    name="address" placeholder="House No, Street, Locality"
                    rows={2} value={form.address} onChange={handleChange}
                  />
                  {errors.address && <span className="err">{errors.address}</span>}
                </div>

                <div className="form-row-2">
                  <div className="field-group">
                    <label>City</label>
                    <input
                      name="city" placeholder="Hyderabad"
                      value={form.city} onChange={handleChange}
                    />
                    {errors.city && <span className="err">{errors.city}</span>}
                  </div>
                  <div className="field-group">
                    <label>Pincode</label>
                    <input
                      name="pincode" placeholder="500001"
                      value={form.pincode} onChange={handleChange}
                      maxLength={6}
                    />
                    {errors.pincode && <span className="err">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-card">
                <h3>💳 Payment Method</h3>

                <div className="payment-methods">
                  <label className={`method-option ${form.paymentMethod === 'card' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="card"
                      checked={form.paymentMethod === 'card'} onChange={handleChange} />
                    <span className="method-icon">💳</span>
                    <span>Credit / Debit Card</span>
                  </label>
                  <label className={`method-option ${form.paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="upi"
                      checked={form.paymentMethod === 'upi'} onChange={handleChange} />
                    <span className="method-icon">📱</span>
                    <span>UPI</span>
                  </label>
                  <label className={`method-option ${form.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod"
                      checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                    <span className="method-icon">💵</span>
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {/* Card Fields */}
                {form.paymentMethod === 'card' && (
                  <div className="payment-fields">
                    <div className="field-group">
                      <label>Card Number</label>
                      <input
                        name="cardNumber" placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                        maxLength={19}
                      />
                      {errors.cardNumber && <span className="err">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-row-2">
                      <div className="field-group">
                        <label>Expiry Date</label>
                        <input
                          name="expiry" placeholder="MM/YY"
                          value={form.expiry}
                          onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                          maxLength={5}
                        />
                        {errors.expiry && <span className="err">{errors.expiry}</span>}
                      </div>
                      <div className="field-group">
                        <label>CVV</label>
                        <input
                          name="cvv" placeholder="•••" type="password"
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          maxLength={3}
                        />
                        {errors.cvv && <span className="err">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Fields */}
                {form.paymentMethod === 'upi' && (
                  <div className="payment-fields">
                    <div className="field-group">
                      <label>UPI ID</label>
                      <input
                        name="upiId" placeholder="yourname@upi"
                        value={form.upiId} onChange={handleChange}
                      />
                      {errors.upiId && <span className="err">{errors.upiId}</span>}
                    </div>
                    <div className="upi-apps">
                      <span>Pay via:</span>
                      <div className="upi-icons">
                        <div className="upi-chip">GPay</div>
                        <div className="upi-chip">PhonePe</div>
                        <div className="upi-chip">Paytm</div>
                        <div className="upi-chip">BHIM</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD */}
                {form.paymentMethod === 'cod' && (
                  <div className="cod-note">
                    <span>💡</span>
                    <p>Pay in cash when your order is delivered. No advance payment needed.</p>
                  </div>
                )}
              </div>

              <button type="submit" className="pay-btn" disabled={loading}>
                {loading ? (
                  <span className="paying-animation">
                    <span className="spinner-white" /> Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${Number(product.price).toLocaleString()} →`
                )}
              </button>
            </form>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-product">
                <img
                  src={`http://localhost:8080/api/products/image/${product.id}`}
                  alt={product.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/80x80?text=Item'; }}
                />
                <div className="summary-product-info">
                  <h4>{product.name}</h4>
                  <p>Sold by {product.sellerName}</p>
                  <span className="summary-price">₹{Number(product.price).toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Item Price</span>
                  <span>₹{Number(product.price).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free-tag">FREE</span>
                </div>
                <div className="summary-row">
                  <span>Platform Fee</span>
                  <span>₹0</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span>₹{Number(product.price).toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-seller">
                <h4>Seller Info</h4>
                <p>🛖 {product.sellerName}</p>
                <p className="seller-note">Your order will be fulfilled directly by this local artisan.</p>
              </div>

              <div className="trust-badges">
                <div className="trust-item"><span>✅</span> Secure Checkout</div>
                <div className="trust-item"><span>🔄</span> Easy Returns</div>
                <div className="trust-item"><span>🤝</span> Support Local</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
