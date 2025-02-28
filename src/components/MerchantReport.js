import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MerchantReport.css'; // Optional: Add your CSS for styling

const MerchantReport = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    report_type: ''
  });

  useEffect(() => {
    fetchReports(); // Fetch reports when the component mounts
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/report', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/report', { report_type: formData.report_type }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData({ report_type: '' }); // Reset report type
      fetchReports(); // Refresh the reports list
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="merchant-report">
      <h2>Generate Report</h2>
      <form onSubmit={handleSubmitReport} className="report-form">
        <input
          type="text"
          name="report_type"
          value={formData.report_type}
          onChange={handleChange}
          placeholder="Report Type"
          required
        />
        <button type="submit">Generate Report</button>
      </form>

      <h2>Your Reports</h2>
      <ul className="report-list">
        {reports.map(report => (
          <li key={report.id}>
            {report.report_type} - Created at: {new Date(report.created_at).toLocaleString()}
            {/* You can add buttons for viewing or deleting reports if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MerchantReport;