import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MerchantDashboard.css';

const MerchantDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity_received: '',
    quantity_in_stock: '',
    quantity_spoilt: '',
    buying_price: '',
    selling_price: '',
    payment_status: '',
    supplier: ''
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [activeSection, setActiveSection] = useState('inventory');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await axios.put(`http://localhost:5000/inventory/${editingItemId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEditingItemId(null);
      } else {
        await axios.post('http://localhost:5000/inventory', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setFormData({
        product_name: '',
        quantity_received: '',
        quantity_in_stock: '',
        quantity_spoilt: '',
        buying_price: '',
        selling_price: '',
        payment_status: '',
        supplier: ''
      });
      fetchInventory();
    } catch (error) {
      console.error('Error adding/updating inventory:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      product_name: item.product_name,
      quantity_received: item.quantity_received,
      quantity_in_stock: item.quantity_in_stock,
      quantity_spoilt: item.quantity_spoilt,
      buying_price: item.buying_price,
      selling_price: item.selling_price,
      payment_status: item.payment_status,
      supplier: item.supplier
    });
    setEditingItemId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="merchant-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="dashboard-title">Merchant Dashboard</h1>
        <ul className="nav-links">
          <li className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>
            Inventory Management
          </li>
          <li className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`} onClick={() => setActiveSection('payments')}>
            Payments
          </li>
          <li className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`} onClick={() => setActiveSection('reports')}>
            Reports
          </li>
          <li className={`nav-item ${activeSection === 'supplyRequests' ? 'active' : ''}`} onClick={() => setActiveSection('supplyRequests')}>
            Supply Requests
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'inventory' && (
          <div className="section">
            <h2>Inventory Management</h2>
            <form onSubmit={handleSubmit} className="inventory-form">
              <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" required />
              <input type="number" name="quantity_received" value={formData.quantity_received} onChange={handleChange} placeholder="Quantity Received" required />
              <input type="number" name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleChange} placeholder="Quantity in Stock" required />
              <input type="number" name="quantity_spoilt" value={formData.quantity_spoilt} onChange={handleChange} placeholder="Quantity Spoilt" required />
              <input type="number" name="buying_price" value={formData.buying_price} onChange={handleChange} placeholder="Buying Price" required />
              <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} placeholder="Selling Price" required />
              <input type="text" name="payment_status" value={formData.payment_status} onChange={handleChange} placeholder="Payment Status" required />
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Supplier" required />
              <button type="submit">{editingItemId ? 'Update' : 'Add'} Inventory Item</button>
            </form>

            <h2>Current Inventory</h2>
            <ul className="inventory-list">
              {inventory.map(item => (
                <li key={item.id}>
                  {item.product_name} - {item.quantity_in_stock} in stock
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'payments' && (
          <div className="section">
            <h2>Payments</h2>
            {/* Payment content goes here */}
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="section">
            <h2>Reports</h2>
            {/* Reports content goes here */}
          </div>
        )}

        {activeSection === 'supplyRequests' && (
          <div className="section">
            <h2>Supply Requests</h2>
            {/* Supply requests content goes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
