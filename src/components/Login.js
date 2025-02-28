import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", formData);
  
    try {
      // Send the login request to the backend
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        // Login successful, save token and role in localStorage
        alert(`Login successful! Role: ${data.role}`);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);

        // Redirect based on the role
        if (data.role.toLowerCase() === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.role.toLowerCase() === 'merchant') {
          navigate('/merchant-dashboard');
        } else if (data.role.toLowerCase() === 'clerk') {
          navigate('/clerk-dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;