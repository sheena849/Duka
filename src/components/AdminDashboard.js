import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Debugging output
  console.log("AdminDashboard - Token:", token);
  console.log("AdminDashboard - Role:", role);

  // Check if the user is not logged in or not an admin
  if (!token || role?.toLowerCase() !== 'admin') {
    navigate('/login');  // Redirect to login if unauthorized
    return null;  // Prevent rendering the dashboard
  }

  // Logout function to clear local storage and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <ul className="nav-links">
          <li><Link to="inventory" className="nav-item">Inventory</Link></li>
          <li><Link to="supply-requests" className="nav-item">Supply Requests</Link></li>
          <li><Link to="payments" className="nav-item">Payments</Link></li>
          <li><Link to="reports" className="nav-item">Reports</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="main-content">
        <Outlet /> {/* Nested routes will render here */}
      </div>
    </div>
  );
};

export default AdminDashboard;