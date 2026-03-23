import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import './CustomerPage.css';

export default function CustomerPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(products); return; }
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.sellerName?.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const fetchAll = async () => {
    try {
      const res = await productAPI.getAllProducts();
      setProducts(res.data);
      setFiltered(res.data);
    } catch { setProducts([]); setFiltered([]); }
    finally { setLoading(false); }
  };

  const handleBuy = (product) => {
    navigate('/payment', { state: { product } });
  };

  return (
    <div className="page-layout">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/home')}>← Home</button>
        <div className="page-title-area">
          <h2>Marketplace</h2>
          <span className="seller-name">{products.length} items available</span>
        </div>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products or artisans..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="page-main">
        {loading ? (
          <div className="loading-state">Discovering local products...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>🛍️</p>
            <h4>{search ? 'No results found' : 'No products yet'}</h4>
            <p>{search ? 'Try a different search term' : 'Check back soon — artisans are adding products!'}</p>
          </div>
        ) : (
          <>
            <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="products-grid">
              {filtered.map(product => (
                <div key={product.id} className="product-card customer-product-card">
                  <div className="product-img-wrap">
                    <img
                      src={`http://localhost:8080/api/products/image/${product.id}`}
                      alt={product.name}
                      onError={e => { e.target.src = 'https://via.placeholder.com/280x200?text=No+Image'; }}
                    />
                    <div className="seller-chip">by {product.sellerName || 'Artisan'}</div>
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
                      <button className="buy-btn" onClick={() => handleBuy(product)}>Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
