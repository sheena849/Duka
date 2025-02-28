import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './payments.css'; // Import the styles for Payments

const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      merchant_name: "John's Store",
      amount: "KES 15,000",
      status: "Pending"
    },
    {
      id: 2,
      merchant_name: "Green Grocers",
      amount: "KES 7,500",
      status: "Confirmed"
    },
    {
      id: 3,
      merchant_name: "Mama Safi",
      amount: "KES 12,000",
      status: "Rejected"
    },
    {
      id: 4,
      merchant_name: "FreshMart",
      amount: "KES 20,000",
      status: "Pending"
    }
  ]);

  useEffect(() => {
    axios.get('http://localhost:5000/payments')
      .then(response => {
        setPayments(response.data.payments);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  const handleConfirm = (paymentId) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId ? { ...payment, status: 'Confirmed' } : payment
    ));
  };

  const handleReject = (paymentId) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId ? { ...payment, status: 'Rejected' } : payment
    ));
  };

  return (
    <div className="payments">
      <h2>Payments</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Merchant Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.merchant_name}</td>
                <td>{payment.amount}</td>
                <td>
                  <span className={`status ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  {payment.status === 'Pending' && (
                    <div className="action-buttons">
                      <button className="confirm-btn" onClick={() => handleConfirm(payment.id)}>Confirm</button>
                      <button className="reject-btn" onClick={() => handleReject(payment.id)}>Reject</button>
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

export default Payments;
