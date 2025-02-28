import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <h1 className="about-title">About MyDuka</h1>
        <p className="about-description">
          MyDuka is an intuitive and powerful inventory management system designed for businesses of all sizes. 
          It allows merchants to easily manage their products, track stock levels, and generate detailed reports. 
          With role-based access, admins, merchants, and clerks can interact with the system in different capacities. 
        </p>
        <h3 className="about-features-title">Key Features:</h3>
        <ul className="about-features-list">
          <li>Product Management (Add, Update, Delete)</li>
          <li>Role-based Authentication</li>
          <li>Stock Tracking & Alerts</li>
          <li>Comprehensive Reporting with Graphs</li>
          <li>Responsive User Interface</li>
        </ul>
        <p className="about-footer">
          For more details, visit the official documentation or contact support.
        </p>
      </div>
    </div>
  );
};

export default About;
