import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import ClerkDashboard from './components/ClerkDashboard'; // Import ClerkDashboard
import InventoryManagement from './components/InventoryManagement';
import SupplyRequests from './components/SupplyRequests';
import Payments from './components/Payments';
import MerchantReport from './components/MerchantReport'; // Import MerchantReport
import About from './components/About';
import PaymentManagement from './components/PaymentManagement';

function App() {
  const role = localStorage.getItem('role'); // Get the role from localStorage

  console.log('User  role:', role); // Debugging output

  // Ensure role-based access
  const getDashboardRoute = () => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/admin-dashboard';
      case 'merchant':
        return '/merchant-dashboard';
      case 'clerk':
        return '/clerk-dashboard';
      default:
        return '/';
    }
  };

  return (
    <Router>
      <Navbar /> {/* Navbar displayed on all pages */}
      <Routes>
        {/* Redirect logged-in users to their respective dashboards */}
        {role && <Route path="/" element={<Navigate to={getDashboardRoute()} />} />}
        
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Dashboard and its sub-routes */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />}>
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="supply-requests" element={<SupplyRequests />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<MerchantReport />} /> {/* Assuming Admin can view reports */}
        </Route>
        
        {/* Merchant Dashboard and its sub-routes */}
        <Route path="/merchant-dashboard/*" element={<MerchantDashboard />}>
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="reports" element={<MerchantReport />} /> {/* Updated to use MerchantReport */}
        </Route>
        
        {/* Clerk Dashboard and its sub-routes */}
        <Route path="/clerk-dashboard/*" element={<ClerkDashboard />}>
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="supply-requests" element={<SupplyRequests />} />
        </Route>
        
        {/* Catch-All Route (Redirects unknown paths to Home) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;