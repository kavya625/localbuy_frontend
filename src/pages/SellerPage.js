import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import './SellerPage.css';

export default function SellerPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('localbuy_user') || '{}');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: null });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getMyProducts();
      setProducts(res.data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.image) { setError('Please select a product image'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('description', form.description);
      fd.append('image', form.image);
      await productAPI.addProduct(fd);
      setSuccess('Product added successfully!');
      setForm({ name: '', price: '', description: '', image: null });
      setPreview(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch { alert('Failed to delete product'); }
  };

  return (
    <div className="page-layout">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/home')}>← Home</button>
        <div className="page-title-area">
          <h2>My Shop</h2>
          <span className="seller-name">{user.name}</span>
        </div>
        <button className="add-product-btn" onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </header>

      <main className="page-main">
        {/* Add Product Form */}
        {showForm && (
          <div className="add-product-panel">
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="image-upload-area">
                  <label className="image-upload-label" htmlFor="img-input">
                    {preview
                      ? <img src={preview} alt="preview" className="img-preview" />
                      : <div className="img-placeholder"><span>📷</span><p>Click to upload</p></div>
                    }
                  </label>
                  <input id="img-input" type="file" accept="image/*" onChange={handleImageChange} hidden />
                </div>

                <div className="form-fields">
                  <div className="field-group">
                    <label>Product Name</label>
                    <input
                      type="text" placeholder="e.g. Handwoven Basket"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field-group">
                    <label>Price (₹)</label>
                    <input
                      type="number" placeholder="0.00" min="0" step="0.01"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe your product..."
                      rows={3}
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="error-msg">{error}</p>}
              {success && <p className="success-msg">{success}</p>}

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="section-header">
          <h3>Listed Products <span className="count-badge">{products.length}</span></h3>
        </div>

        {loading ? (
          <div className="loading-state">Loading your products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>🛖</p>
            <h4>No products yet</h4>
            <p>Add your first product to start selling</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card seller-product-card">
                <div className="product-img-wrap">
                  <img
                    src={`http://localhost:8080/api/products/image/${product.id}`}
                    alt={product.name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/280x200?text=No+Image'; }}
                  />
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
