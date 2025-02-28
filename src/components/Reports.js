// src/components/Reports.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch report data from the backend
    axios.get('/api/reports/sales')
      .then(response => {
        setSalesData(response.data.sales);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
      });
  }, []);

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Sales Over Time',
        data: salesData.map(item => item.sales),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="reports">
      <h2>Sales Report</h2>
      <Line data={chartData} />
    </div>
  );
};

export default Reports;
