import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClerkDashboard.css';

const ClerkDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity_requested: ''
  });
  const [activeSection, setActiveSection] = useState('inventory');

  useEffect(() => {
    fetchInventory();
    fetchSupplyRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory/assigned', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchSupplyRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/supply_request', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSupplyRequests(response.data.supply_requests);
    } catch (error) {
      console.error('Error fetching supply requests:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitSupplyRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/supply_request', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData({ product_name: '', quantity_requested: '' });
      fetchSupplyRequests(); // Refresh the supply requests list
    } catch (error) {
      console.error('Error creating supply request:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="clerk-dashboard">
      <div className="sidebar">
        <h1 className="dashboard-title">Clerk Dashboard</h1>
        <ul className="nav-links">
          <li className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>
            Inventory Management
          </li>
          <li className={`nav-item ${activeSection === 'supplyRequests' ? 'active' : ''}`} onClick={() => setActiveSection('supplyRequests')}>
            Supply Requests
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        {activeSection === 'inventory' && (
          <div className="section">
            <h2>Current Inventory</h2>
            <ul className="inventory-list">
              {inventory.map(item => (
                <li key={item.id}>
                  {item.product_name} - In Stock: {item.quantity_in_stock}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'supplyRequests' && (
          <div className="section">
            <h2>Your Supply Requests</h2>
            <form onSubmit={handleSubmitSupplyRequest}>
              <input
                type="text"
                name="product_name"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="quantity_requested"
                placeholder="Quantity Requested"
                value={formData.quantity_requested}
                onChange={handleChange}
                required
              />
              <button type="submit">Request Supply</button>
            </form>
            <ul className="supply-request-list">
              {supplyRequests.map(request => (
                <li key={request.id}>
                  {request.product_name} - Status: {request.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkDashboard;