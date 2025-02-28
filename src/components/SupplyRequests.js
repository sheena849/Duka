import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './supplyRequests.css'; // Import the styles for Supply Requests

const SupplyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity_requested: ''
  });

  useEffect(() => {
    fetchSupplyRequests();
  }, []);

  const fetchSupplyRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/supply_request', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(response.data.supply_requests);
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

  const handleApprove = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/supply_request/${requestId}`, { status: 'Approved' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSupplyRequests(); // Refresh the supply requests list
    } catch (error) {
      console.error('Error approving supply request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/supply_request/${requestId}`, { status: 'Declined' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSupplyRequests(); // Refresh the supply requests list
    } catch (error) {
      console.error('Error rejecting supply request:', error);
    }
  };

  return (
    <div className="supply-requests">
      <h2>Supply Requests</h2>
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
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Clerk Name</th> {/* Display Clerk Name */}
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.clerk_name}</td> {/* Display the clerk's name */}
                <td>{request.product_name}</td>
                <td>{request.quantity_requested}</td>
                <td>
                  <span className={`status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === 'Pending' && (
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => handleApprove(request.id)}>Approve</button>
                      <button className="reject-btn" onClick={() => handleReject(request.id)}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

 export default SupplyRequests;