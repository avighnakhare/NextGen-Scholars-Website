import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('ngs_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Change Credentials State
  const [showCredPanel, setShowCredPanel] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [credMsg, setCredMsg] = useState({ text: '', type: '' });
  const [credLoading, setCredLoading] = useState(false);

  // Dashboard Data State
  const [data, setData] = useState({
    registrations: [],
    subscribers: [],
    analytics: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modals & Detailed View State
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to fetch dashboard data.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (response.ok && result.token) {
        localStorage.setItem('ngs_admin_token', result.token);
        setToken(result.token);
        setLoginError('');
      } else {
        setLoginError(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Server connection error.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ngs_admin_token');
    setToken('');
    setNewEmail('');
    setNewPassword('');
    setCredMsg({ text: '', type: '' });
    setShowCredPanel(false);
    setData({ registrations: [], subscribers: [], analytics: [] });
  };

  const handleChangeCredentials = async (e) => {
    e.preventDefault();
    setCredLoading(true);
    setCredMsg({ text: '', type: '' });
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newEmail, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCredMsg({ text: '✅ ' + data.message, type: 'success' });
        setNewEmail('');
        setNewPassword('');
      } else {
        setCredMsg({ text: '❌ ' + (data.message || 'Update failed'), type: 'error' });
      }
    } catch (err) {
      setCredMsg({ text: '❌ Server connection error', type: 'error' });
    } finally {
      setCredLoading(false);
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this student registration? This will immediately free up their slot and send a cancellation notification email.')) return;
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setData({ ...data, registrations: result.registrations });
        if (selectedStudent && selectedStudent.id === id) {
          setSelectedStudent(null);
        }
      } else {
        alert(result.message || 'Failed to delete registration.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  const handleExportCSV = () => {
    fetch('/api/admin/export', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webinar_registrations.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.error(err));
  };

  // Analytics helper metrics
  const uniquePageviews = data.analytics.filter(e => e.event_type === 'pageview').length;
  const registrationsCount = data.registrations.length;
  const conversionRate = uniquePageviews > 0 ? ((registrationsCount / uniquePageviews) * 100).toFixed(1) : '0';

  // Filter registrations by search query
  const filteredRegistrations = data.registrations.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(term) ||
      r.student_email.toLowerCase().includes(term) ||
      r.school.toLowerCase().includes(term) ||
      r.interests.toLowerCase().includes(term) ||
      (r.booking_date && r.booking_date.toLowerCase().includes(term)) ||
      (r.booking_time && r.booking_time.toLowerCase().includes(term))
    );
  });

  /* LOGIN VIEW */
  if (!token) {
    return (
      <div className="admin-login-page animate-fade-in">
        <div className="login-card card text-center">
          <div className="login-logo-icon">🔐</div>
          <h2 className="mb-2">Admin Control Panel</h2>
          <p className="mb-4 text-muted">Verify administrator credentials to access student registrations database.</p>
          
          {loginError && <div className="form-error-toast mb-4">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="adminEmail">Admin Email</label>
              <input
                type="email"
                id="adminEmail"
                className="form-control"
                placeholder="Admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminPassword">Password</label>
              <input
                type="password"
                id="adminPassword"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Decrypt Database Connection
            </button>
          </form>
          
          <div className="mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Note: Admin credentials configured in backend .env setup.
          </div>
        </div>

        <style>{`
          .admin-login-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-secondary);
            padding: 2rem;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            padding: 3rem 2rem;
          }
          .login-logo-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  /* DASHBOARD MAIN PANEL VIEW */
  return (
    <div className="admin-dashboard-page animate-fade-in">
      <header className="dashboard-header">
        <div className="container dashboard-header-container">
          <div>
            <h1>Admin Control Panel</h1>
            <p className="text-muted">NextGen Scholars nonprofit registrations, dynamic calendar scheduling, and real-time site conversion audits.</p>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Close Dashboard (Logout)
          </button>
        </div>
      </header>

      <div className="container py-4">
        {error && <div className="form-error-toast mb-4">{error}</div>}

        {/* CHANGE CREDENTIALS PANEL */}
        <div className="card cred-panel mb-4">
          <div className="cred-panel-header" onClick={() => { setShowCredPanel(!showCredPanel); setCredMsg({ text: '', type: '' }); }}>
            <span>🔑 Change Admin Login Credentials</span>
            <span className="cred-toggle">{showCredPanel ? '▲ Hide' : '▼ Expand'}</span>
          </div>
          {showCredPanel && (
            <div className="cred-panel-body">
              <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                Update the admin username (email) and password. Changes are saved permanently to the server and take effect immediately — no restart needed.
              </p>
              {credMsg.text && (
                <div className={`form-error-toast mb-3 ${credMsg.type === 'success' ? 'success-alert' : ''}`}>
                  {credMsg.text}
                </div>
              )}
              <form onSubmit={handleChangeCredentials} className="cred-form">
                <div className="form-group">
                  <label htmlFor="newAdminEmail">New Admin Email</label>
                  <input
                    type="email"
                    id="newAdminEmail"
                    className="form-control"
                    placeholder="Enter new admin email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newAdminPassword">New Password</label>
                  <input
                    type="password"
                    id="newAdminPassword"
                    className="form-control"
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" disabled={credLoading} className="btn btn-secondary">
                  {credLoading ? 'Saving...' : '💾 Save New Credentials'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* METRICS ROW */}
        <div className="metrics-row mb-4">
          <div className="card metric-card">
            <span className="metric-icon">👥</span>
            <div>
              <div className="metric-val">{data.registrations.length}</div>
              <div className="metric-label">Scholars Registered</div>
            </div>
          </div>
          <div className="card metric-card">
            <span className="metric-icon">📈</span>
            <div>
              <div className="metric-val">{conversionRate}%</div>
              <div className="metric-label">Sign-up Conversion</div>
            </div>
          </div>
          <div className="card metric-card">
            <span className="metric-icon">✉</span>
            <div>
              <div className="metric-val">{data.subscribers.length}</div>
              <div className="metric-label">Newsletter Subscribers</div>
            </div>
          </div>
        </div>

        {/* REGISTRATIONS DATABASE */}
        <div className="card">
          <div className="section-header mb-3">
            <h3>Registered Scholars Database</h3>
            <div className="header-actions">
              <input
                type="text"
                className="form-control table-search"
                placeholder="Search name, school, interests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                Export Attendee CSV
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>High School</th>
                  <th>Interests</th>
                  <th>Scheduled Slot</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <strong>{student.student_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.student_email}</div>
                    </td>
                    <td>{student.grade}</td>
                    <td>{student.school}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{student.interests}</td>
                    <td>
                      {student.booking_date ? (
                        <>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{student.booking_date}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.booking_time}</div>
                        </>
                      ) : (
                        <span className="text-muted">Unlinked slot</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-table view" onClick={() => setSelectedStudent(student)}>
                          View Profile
                        </button>
                        <button className="btn-table delete" onClick={() => handleDeleteRegistration(student.id)}>
                          Cancel Slot
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No student profiles match the search parameters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STUDENT PROFILE POPUP MODAL */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Scholars Detailed Portfolio Profile</h3>
              <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>&times;</button>
            </div>
            
            <div className="modal-body animate-fade-in">
              <div className="profile-grid">
                <div>
                  <h5 className="profile-sec-title">Personal Details</h5>
                  <table className="profile-table">
                    <tbody>
                      <tr>
                        <td>Student Name:</td>
                        <td><strong>{selectedStudent.student_name}</strong></td>
                      </tr>
                      <tr>
                        <td>Student Email:</td>
                        <td>{selectedStudent.student_email}</td>
                      </tr>
                      <tr>
                        <td>Phone Number:</td>
                        <td>{selectedStudent.phone}</td>
                      </tr>
                      <tr>
                        <td>Grade / School:</td>
                        <td>{selectedStudent.grade} &bull; {selectedStudent.school}</td>
                      </tr>
                      <tr>
                        <td>Location:</td>
                        <td>{selectedStudent.city}, {selectedStudent.state}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h5 className="profile-sec-title">Parent Guardian Details</h5>
                  <table className="profile-table">
                    <tbody>
                      <tr>
                        <td>Parent Name:</td>
                        <td><strong>{selectedStudent.parent_name}</strong></td>
                      </tr>
                      <tr>
                        <td>Parent Email:</td>
                        <td>{selectedStudent.parent_email}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h5 className="profile-sec-title mt-3">Scheduled Assessment Slot</h5>
                  <table className="profile-table">
                    <tbody>
                      <tr>
                        <td>Booking Date:</td>
                        <td><strong>{selectedStudent.booking_date}</strong></td>
                      </tr>
                      <tr>
                        <td>Time Slot:</td>
                        <td><strong>{selectedStudent.booking_time}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3">
                <h5 className="profile-sec-title">Academic &amp; Portfolio Assessment</h5>
                <table className="profile-table full">
                  <tbody>
                    <tr>
                      <td style={{ width: '180px' }}>GPA Data:</td>
                      <td>{selectedStudent.gpa || <span className="text-muted">None Provided</span>}</td>
                    </tr>
                    <tr>
                      <td>Target Institutions:</td>
                      <td>{selectedStudent.target_programs || <span className="text-muted">None Provided</span>}</td>
                    </tr>
                    <tr>
                      <td>Academic Interests:</td>
                      <td>{selectedStudent.interests}</td>
                    </tr>
                    <tr>
                      <td>Extracurriculars:</td>
                      <td>{selectedStudent.extracurriculars || <span className="text-muted">None Provided</span>}</td>
                    </tr>
                    <tr>
                      <td>Admissions/Career Goals:</td>
                      <td>{selectedStudent.goals}</td>
                    </tr>
                    <tr>
                      <td>Referral Channel:</td>
                      <td>{selectedStudent.referral}</td>
                    </tr>
                    <tr>
                      <td>Signup Timestamp:</td>
                      <td>{new Date(selectedStudent.timestamp).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer mt-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleDeleteRegistration(selectedStudent.id)}>
                Delete Registration (Cancel Booking)
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding-top: 80px;
        }
        
        .dashboard-header {
          background-color: rgba(12, 35, 64, 0.15);
          padding: 2rem 0;
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
        }
        
        .dashboard-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        
        .py-4 {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .cred-panel {
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .cred-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-secondary);
          background: rgba(212, 175, 55, 0.06);
          transition: background 0.2s ease;
        }

        .cred-panel-header:hover {
          background: rgba(212, 175, 55, 0.12);
        }

        .cred-toggle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .cred-panel-body {
          padding: 1.5rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        .cred-form {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: flex-end;
        }

        .cred-form .form-group {
          flex: 1;
          min-width: 220px;
          margin-bottom: 0;
        }

        .success-alert {
          background-color: rgba(34, 197, 94, 0.1) !important;
          border-color: var(--color-success) !important;
          color: var(--color-success) !important;
        }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        
        .metric-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }
        
        .metric-icon {
          font-size: 2.25rem;
          background-color: rgba(12, 35, 64, 0.3);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }
        
        .metric-val {
          font-size: 1.75rem;
          font-family: var(--font-serif);
          font-weight: 800;
          color: var(--color-secondary);
          line-height: 1.2;
        }
        
        .metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .table-search {
          max-width: 250px;
        }
        
        /* TABLE STYLING */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .admin-table th, .admin-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .admin-table th {
          background-color: rgba(12, 35, 64, 0.4);
          color: var(--color-secondary);
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .admin-table td {
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .text-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-table {
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        
        .btn-table.view { color: var(--color-accent); background-color: rgba(0, 180, 216, 0.15); }
        .btn-table.view:hover { background-color: rgba(0, 180, 216, 0.3); }
        .btn-table.delete { color: var(--color-danger); background-color: rgba(239, 68, 68, 0.15); }
        .btn-table.delete:hover { background-color: rgba(239, 68, 68, 0.3); }
        
        /* MODAL OVERLAY */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(3, 8, 14, 0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        
        .modal-card {
          width: 100%;
          max-width: 650px;
          animation: slideUp 0.3s ease-out;
          background: #03080e;
          border: 1px solid var(--border-color);
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: var(--text-muted);
          line-height: 1;
        }
        
        .modal-close-btn:hover {
          color: var(--color-danger);
        }
        
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .profile-sec-title {
          font-size: 0.95rem;
          color: var(--color-secondary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.25rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .profile-table {
          width: 100%;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        
        .profile-table td {
          padding: 0.4rem 0;
        }
        
        .profile-table td:first-child {
          font-weight: 600;
          color: var(--color-secondary);
          width: 110px;
        }
        
        .profile-table.full td:first-child {
          width: 150px;
        }
        
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-header-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
