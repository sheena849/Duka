import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API requests
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    product_name: '',
    quantity_received: 0,
    quantity_in_stock: 0,
    quantity_spoilt: 0,
    buying_price: 0,
    selling_price: 0,
    payment_status: 'Unpaid',
    supplier: ''
  });

  // Fetch inventory data when the component is mounted
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch all inventory items from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/inventory', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Add new inventory item
  const addInventory = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/inventory', newItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setInventory([...inventory, response.data]); // Add new item to state
      // Reset the newItem state
      setNewItem({
        product_name: '',
        quantity_received: 0,
        quantity_in_stock: 0,
        quantity_spoilt: 0,
        buying_price: 0,
        selling_price: 0,
        payment_status: 'Unpaid',
        supplier: ''
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  // Update an inventory item
  const updateInventory = async (id, updatedItem) => {
    try {
      await axios.put(`http://127.0.0.1:5000/inventory/${id}`, updatedItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setInventory(inventory.map(item => (item.id === id ? { ...item, ...updatedItem } : item)));
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  // Delete an inventory item
  const deleteInventory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/inventory/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInventory(inventory.filter(item => item.id !== id)); // Remove item from state
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    addInventory(); // Call the addInventory function
  };

  return (
    <div className="inventory">
      <h2>Inventory</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="product_name"
            placeholder="Enter product name"
            value={newItem.product_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity Received:
          <input
            type="number"
            name="quantity_received"
            placeholder="Enter quantity received"
            value={newItem.quantity_received}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity in Stock:
          <input
            type="number"
            name="quantity_in_stock"
            placeholder="Enter quantity in stock"
            value={newItem.quantity_in_stock}
            on Change={handleChange}
            required
          />
        </label>
        <label>
          Quantity Spoilt:
          <input
            type="number"
            name="quantity_spoilt"
            placeholder="Enter quantity spoilt"
            value={newItem.quantity_spoilt}
            onChange={handleChange}
          />
        </label>
        <label>
          Buying Price:
          <input
            type="number"
            name="buying_price"
            placeholder="Enter buying price"
            value={newItem.buying_price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Selling Price:
          <input
            type="number"
            name="selling_price"
            placeholder="Enter selling price"
            value={newItem.selling_price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Supplier:
          <input
            type="text"
            name="supplier"
            placeholder="Enter supplier name"
            value={newItem.supplier}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Payment Status:
          <select
            name="payment_status"
            value={newItem.payment_status}
            onChange={handleChange}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </label>
        <button type="submit">Add Item</button>
      </form>
      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-item">
            <h3>{item.product_name}</h3>
            <p>Quantity: {item.quantity_in_stock}</p>
            <p>Buying Price: ${item.buying_price}</p>
            <p>Selling Price: ${item.selling_price}</p>
            <p>Supplier: {item.supplier}</p>
            <div className="actions">
              <button className="edit-btn" onClick={() => updateInventory(item.id, { ...item, quantity_in_stock: item.quantity_in_stock + 1 })}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => deleteInventory(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;