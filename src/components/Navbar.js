// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">My Duka</Link> {/* You can change BrandName to your logo */}
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-item">Home</Link></li>
          <li><Link to="/about" className="navbar-item">About</Link></li>
          <li><Link to="/login" className="navbar-item">Login</Link></li>
          <li><Link to="/signup" className="navbar-item">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
