import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import NcssmPrep from './pages/NcssmPrep';
import WebinarFunnel from './pages/WebinarFunnel';
import AdminDashboard from './pages/AdminDashboard';
import SuccessQuiz from './components/SuccessQuiz';
import AnalyticsTracker from './components/AnalyticsTracker';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [policyType, setPolicyType] = useState(null); // 'privacy', 'terms', 'consent', 'data', 'antispam'

  useEffect(() => {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    const handleMouseMove = (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openPolicyModal = (type) => {
    setPolicyType(type);
  };

  const closePolicyModal = () => {
    setPolicyType(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'ncssm':
        return <NcssmPrep setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'programs':
        return <Programs setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'quiz':
        return (
          <div style={{ padding: '8rem 0 5rem 0', minHeight: '80vh' }}>
            <div className="container">
              <div className="section-title-wrapper">
                <h1 className="section-title">Application Competitiveness Quiz</h1>
                <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Get immediate diagnostic scoring and admissions planning recommendations.</p>
              </div>
              <SuccessQuiz setCurrentPage={setCurrentPage} />
            </div>
          </div>
        );
      case 'funnel':
        return <WebinarFunnel />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  const getPolicyContent = () => {
    switch (policyType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          body: 'At NextGen Scholars, we are committed to protecting the privacy of our student and parent users. We only collect the necessary profile details (such as grades, school names, and contact information) to process admissions seminar bookings. We never sell, rent, or lease attendee lists to commercial entities. All data is processed using secure server-side controls.'
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          body: 'By accessing this platform, reserving webinar slots, or subscribing to our email newsletters, you agree to provide authentic and accurate academic and contact details. Student profiles are monitored for double signups or spam details. We reserve the right to remove entries that fail integrity audits.'
        };
      case 'consent':
        return {
          title: 'Parent Consent Policy',
          body: 'Because NextGen Scholars serves high school students (including minors), parent email and name fields are mandatory for all webinar registrations. We CC parents on booking confirmations to ensure complete transparent visibility regarding the online seminars, target schools, and mentorship sessions.'
        };
      case 'data':
        return {
          title: 'Data Protection Notice',
          body: 'All database transactions are stored on encrypted servers with sqlite3. Access to registrations is restricted to authenticated administrators utilizing JSON Web Tokens. If you wish to delete your records or request copies of your files, write to scholar.nextgens@gmail.com.'
        };
      case 'antispam':
        return {
          title: 'Anti-Spam Compliance',
          body: 'NextGen Scholars complies with the CAN-SPAM Act. All weekly newsletters contain easy, one-click opt-out footers. Automated transaction notifications are strictly sent to confirm direct student bookings or schedule modifications. We do not dispatch unsolicited promotional campaigns.'
        };
      default:
        return { title: '', body: '' };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="app-wrapper">
      {/* Dynamic Cursor Glow */}
      <div className="cursor-glow" id="cursorGlow"></div>

      {/* Decorative Orbs */}
      <div className="bg-orb orb-primary"></div>
      <div className="bg-orb orb-secondary"></div>

      {/* Analytics Page Tracker */}
      <AnalyticsTracker currentPage={currentPage} />

      {/* Header Navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Page Area */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <Footer setCurrentPage={setCurrentPage} openPolicyModal={openPolicyModal} />

      {/* Global Trust Policy Modal Overlay */}
      {policyType && (
        <div className="modal-overlay" onClick={closePolicyModal}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{policy.title}</h3>
              <button className="modal-close-btn" onClick={closePolicyModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-color)' }}>{policy.body}</p>
            </div>
            <div className="modal-footer mt-4">
              <button className="btn btn-primary" onClick={closePolicyModal}>Acknowledge Policy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
