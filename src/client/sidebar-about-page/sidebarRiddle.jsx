import React, { useState } from 'react';
import './sidebarRiddle.css';
import { createSheetAndInsertData } from './sheetsUtils';

const REPORT_TYPES = [
  { value: 'customers', label: 'Customers' },
  { value: 'products', label: 'Products' },
  { value: 'orders', label: 'Orders' },
  { value: 'items', label: 'Items' },
  { value: 'stores', label: 'Stores' },
  { value: 'supplies', label: 'Supplies' },
];

const SidebarRiddle = () => {
  const [reportType, setReportType] = useState(REPORT_TYPES[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Save selected values in localStorage (optional, for persistence)
  React.useEffect(() => {
    localStorage.setItem('riddle_reportType', reportType);
    localStorage.setItem('riddle_startDate', startDate);
    localStorage.setItem('riddle_endDate', endDate);
  }, [reportType, startDate, endDate]);

  // On mount, restore from localStorage
  React.useEffect(() => {
    const savedReportType = localStorage.getItem('riddle_reportType');
    const savedStartDate = localStorage.getItem('riddle_startDate');
    const savedEndDate = localStorage.getItem('riddle_endDate');
    if (savedReportType) setReportType(savedReportType);
    if (savedStartDate) setStartDate(savedStartDate);
    if (savedEndDate) setEndDate(savedEndDate);
  }, []);

  const handleImport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!reportType || !startDate || !endDate) {
      setError('Please select report type and both dates.');
      return;
    }
    setLoading(true);
    try {
      await createSheetAndInsertData(reportType, startDate, endDate);
      setSuccess('Data imported successfully!');
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="app-body" className="ms-Fabric">
      {/* Purple header with Riddle */}
      <header className="riddle-header">
        <h1 className="ms-font-xxl">Riddle</h1>
      </header>

      {/* Content container */}
      <div className="riddle-content">
        {/* Section header */}
        <h2 className="ms-font-xl section-header">Import data</h2>

        {/* Error and success messages */}
        {error && <div style={{color: 'white', background: '#c00', padding: 8, borderRadius: 4, marginBottom: 8}}>{error}</div>}
        {success && <div style={{color: 'white', background: '#4caf50', padding: 8, borderRadius: 4, marginBottom: 8}}>{success}</div>}

        {/* Report type dropdown */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label" htmlFor="report-type">Report Type</label>
            <select
              id="report-type"
              className="simple-dropdown"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              disabled={loading}
            >
              {REPORT_TYPES.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date pickers */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label" htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              className="form-input"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-row">
            <label className="form-label" htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              className="form-input"
              required
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Import button */}
        <div className="form-group">
          <button className="import-btn" onClick={handleImport} disabled={loading}>
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarRiddle;
