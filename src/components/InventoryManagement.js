import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InventoryManagement.css';

const InventoryManagement = () => {
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
      await axios.delete(`http://localhost:5000/inventory/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" required />
        <input type="number" name="quantity_received" value={formData.quantity_received} onChange={handleChange} placeholder="Quantity Received" required />
        <input type="number" name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleChange} placeholder="Quantity in Stock" required />
        <input type="number" name="quantity_spoilt" value={formData.quantity_spoilt} onChange={handleChange} placeholder="Quantity Spoilt" />
        <input type="number" name="buying_price" value={formData.buying_price} onChange={handleChange} placeholder="Buying Price" required />
        <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} placeholder="Selling Price" required />
        <input type="text" name="payment_status" value={formData.payment_status} onChange={handleChange} placeholder="Payment Status" required />
        <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Supplier" required />
        <button type="submit">{editingItemId ? 'Update' : 'Add'} Item</button>
      </form>

      <h2>Current Inventory</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Received</th>
            <th>Stock</th>
            <th>Spoilt</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
            <th>Payment</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.quantity_received}</td>
              <td>{item.quantity_in_stock}</td>
              <td>{item.quantity_spoilt}</td>
              <td>${item.buying_price}</td>
              <td>${item.selling_price}</td>
              <td>{item.payment_status}</td>
              <td>{item.supplier}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
