import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'http://localhost:3000/api/v1/products';

const emptyForm = {
  name: '',
  price: '',
  image: '',
  description: '',
  category: '',
  stock: ''
};

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const authHeaders = () => ({
    headers: { Authorization: localStorage.getItem('token') }
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setProducts(res.data.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openNewModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.attributes.name || '',
      price: product.attributes.price || '',
      image: product.attributes.image || '',
      description: product.attributes.description || '',
      category: product.attributes.category || '',
      stock: product.attributes.stock || ''
    });
    setEditingId(product.id);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { product: form }, authHeaders());
        flashSuccess('Product updated successfully!');
      } else {
        await axios.post(API_URL, { product: form }, authHeaders());
        flashSuccess('Product created successfully!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`, authHeaders());
      flashSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  return (
    <div className="adminPanel">
      <div className="adminHeader">
        <div>
          <h1>Admin Panel</h1>
          <p className="adminSubtitle">Manage your product inventory</p>
        </div>
        <button className="btnPrimary" onClick={openNewModal}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          New Product
        </button>
      </div>

      {successMsg && <div className="alertSuccess">{successMsg}</div>}
      {error && !showModal && <div className="alertError">{error}</div>}

      {loading ? (
        <div className="loadingState">
          <div className="spinner" />
          <p>Loading products…</p>
        </div>
      ) : (
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th className="thActions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="emptyRow">No products found. Add your first product!</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="tdId">#{p.id}</td>
                    <td className="tdName">{p.attributes.name}</td>
                    <td className="tdPrice">${parseFloat(p.attributes.price).toFixed(2)}</td>
                    <td>
                      <span className={`stockBadge ${p.attributes.stock > 10 ? 'inStock' : p.attributes.stock > 0 ? 'lowStock' : 'outOfStock'}`}>
                        {p.attributes.stock}
                      </span>
                    </td>
                    <td className="tdCategory">{p.attributes.category}</td>
                    <td className="tdActions">
                      <button className="btnEdit" onClick={() => openEditModal(p)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 1.5l2 2L4.5 11.5H2.5v-2l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                        Edit
                      </button>
                      <button className="btnDelete" onClick={() => handleDelete(p.id)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 4.5h9M5 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5M4 4.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modalClose" onClick={() => setShowModal(false)}>×</button>
            </div>

            {error && <div className="alertError modalError">{error}</div>}

            <form onSubmit={handleSubmit} className="modalForm">
              <div className="formGrid">
                <div className="formGroup">
                  <label>Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wireless Headphones" />
                </div>
                <div className="formGroup">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Electronics" />
                </div>
                <div className="formGroup">
                  <label>Price ($)</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="29.99" />
                </div>
                <div className="formGroup">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="100" />
                </div>
              </div>
              <div className="formGroup">
                <label>Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
              </div>
              <div className="formGroup">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows="3" placeholder="Brief product description…" />
              </div>
              <div className="modalActions">
                <button type="button" className="btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btnPrimary">{editingId ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
