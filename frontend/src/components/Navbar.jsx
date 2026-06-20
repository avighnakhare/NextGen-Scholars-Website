import React, { useState, useEffect } from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'NCSSM Prep', id: 'ncssm' },
    { name: 'Programs', id: 'programs' },
    { name: 'Success Quiz', id: 'quiz' },
    { name: 'About Us', id: 'about' },
    { name: 'Contact', id: 'contact' },
    { name: 'Admin', id: 'admin' }
  ];


  const handleLinkClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleLinkClick('home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="NextGen Scholars Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-title">NextGen</span>
            <span className="logo-subtitle">Scholars</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-btn ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop & mobile nav links */}
        <div className={`nav-menu-wrapper ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  className={`nav-link-item ${currentPage === link.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link.id)}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          
          <button 
            className="btn btn-secondary nav-cta"
            onClick={() => handleLinkClick('funnel')}
          >
            Register for Free Webinar
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background-color: rgba(3, 8, 14, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
          transition: all var(--transition-normal);
        }
        
        .navbar-scrolled {
          height: 70px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          background-color: rgba(3, 8, 14, 0.95);
        }
        
        .nav-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .logo-img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 50%;
          border: 1px solid var(--color-secondary);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
          background-color: #03080e;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        
        .logo-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        
        .logo-subtitle {
          font-size: 0.8rem;
          color: var(--color-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .nav-menu-wrapper {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }
        
        .nav-link-item {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.95rem;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0.5rem 0;
          position: relative;
        }
        
        .nav-link-item:hover, .nav-link-item.active {
          color: #ffffff;
        }
        
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--color-secondary);
          transition: width var(--transition-fast);
        }
        
        .nav-link-item:hover::after, .nav-link-item.active::after {
          width: 100%;
        }
        
        .nav-cta {
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          width: 30px;
          height: 24px;
          position: relative;
          z-index: 1100;
        }
        
        .mobile-menu-btn span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: #ffffff;
          border-radius: 9px;
          opacity: 1;
          left: 0;
          transform: rotate(0);
          transition: .25s ease-in-out;
        }
        
        .mobile-menu-btn span:nth-child(1) { top: 0px; }
        .mobile-menu-btn span:nth-child(2) { top: 10px; }
        .mobile-menu-btn span:nth-child(3) { top: 20px; }
        
        .mobile-menu-btn.open span:nth-child(1) {
          top: 10px;
          transform: rotate(135deg);
        }
        
        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
          left: -60px;
        }
        
        .mobile-menu-btn.open span:nth-child(3) {
          top: 10px;
          transform: rotate(-135deg);
        }
        
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .nav-menu-wrapper {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100vh;
            background-color: #03080e;
            border-left: 1px solid var(--border-color);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
            flex-direction: column;
            justify-content: flex-start;
            padding: 100px 2rem 2rem 2rem;
            transition: right var(--transition-normal);
            gap: 2.5rem;
            align-items: stretch;
            z-index: 999;
          }

          
          .nav-menu-wrapper.open {
            right: 0;
          }
          
          .nav-links {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .nav-link-item {
            font-size: 1.1rem;
            width: 100%;
            text-align: left;
          }
          
          .nav-cta {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}
