import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [inventoryId, setInventoryId] = useState("");
    const [status, setStatus] = useState("pending");
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/payment", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments", error);
        }
    };

    const processPayment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://127.0.0.1:5000/payment",
                { inventory_id: inventoryId, status },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setInventoryId("");
            fetchPayments();
        } catch (error) {
            console.error("Error processing payment", error);
        }
    };

    const cancelPayment = async (id, paymentStatus) => {
        if (paymentStatus !== "pending") {
            alert("Only pending payments can be canceled.");
            return;
        }
        try {
            await axios.delete(`http://127.0.0.1:5000/payment/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchPayments();
        } catch (error) {
            console.error("Error canceling payment", error);
        }
    };

    return (
        <div className="payment-container">
            <h2>Manage Payments</h2>
            <form onSubmit={processPayment} className="payment-form">
                <input
                    type="text"
                    placeholder="Inventory ID"
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)}
                    required
                />
                <button type="submit">Process Payment</button>
            </form>
            <table className="payment-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Inventory ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.inventory_id}</td>
                            <td>{payment.status}</td>
                            <td>
                                {payment.status === "pending" && (
                                    <button
                                        onClick={() => cancelPayment(payment.id, payment.status)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentManagement;
