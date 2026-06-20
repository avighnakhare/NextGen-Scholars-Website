import React from 'react';

const INSTAGRAM_URL = 'https://www.instagram.com/scholars.nextgen';
const INSTAGRAM_HANDLE = '@scholars.nextgen';

export default function Footer({ setCurrentPage, openPolicyModal }) {
  const handleLinkClick = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="nav-logo mb-4">
              <img src="/logo.png" alt="NextGen Scholars Logo" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title white-text">NextGen</span>
                <span className="logo-subtitle gold-text">Scholars</span>
              </div>
            </div>
            <p className="footer-desc">
              Empowering ambitious high school students through personalized academic mentorship, leadership development, and high-impact STEM opportunities.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-insta-pill"
              aria-label="Follow NextGen Scholars on Instagram"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span>{INSTAGRAM_HANDLE}</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-title">Explore</h4>
            <ul>
              <li><button onClick={() => handleLinkClick('home')}>Homepage</button></li>
              <li><button onClick={() => handleLinkClick('ncssm')}>NCSSM Prep</button></li>
              <li><button onClick={() => handleLinkClick('programs')}>Our Programs</button></li>
              <li><button onClick={() => handleLinkClick('about')}>About Mission</button></li>
              <li><button onClick={() => handleLinkClick('quiz')}>Success Quiz</button></li>
              <li><button onClick={() => handleLinkClick('contact')}>Contact Us</button></li>
              <li><button onClick={() => handleLinkClick('funnel')}>Book Assessment</button></li>
            </ul>
          </div>

          {/* Instagram / Social CTA Column */}
          <div className="footer-social-cta">
            <h4 className="footer-title">Follow Our Journey</h4>
            <p className="footer-social-desc">
              Get daily admissions tips, student success stories, NCSSM insights, and STEM opportunities — directly on your feed.
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="insta-cta-card"
              aria-label="Visit our Instagram page"
            >
              <div className="insta-cta-top">
                <div className="insta-avatar">
                  <svg width="22" height="22" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <div className="insta-meta">
                  <span className="insta-name">NextGen Scholars</span>
                  <span className="insta-handle">{INSTAGRAM_HANDLE}</span>
                </div>
                <span className="insta-follow-badge">Follow</span>
              </div>
              <div className="insta-cta-bottom">
                <span className="insta-preview-tag">#NCSSMPrep</span>
                <span className="insta-preview-tag">#CollegeAdmissions</span>
                <span className="insta-preview-tag">#STEMScholars</span>
                <span className="insta-preview-tag">#NextGenScholars</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Trust & Legitimacy Links */}
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright">&copy; {new Date().getFullYear()} NextGen Scholars Nonprofit. All rights reserved.</p>
          
          <div className="trust-links">
            <button onClick={() => openPolicyModal('privacy')}>Privacy Policy</button>
            <span className="separator">|</span>
            <button onClick={() => openPolicyModal('terms')}>Terms of Service</button>
            <span className="separator">|</span>
            <button onClick={() => openPolicyModal('consent')}>Parent Consent</button>
            <span className="separator">|</span>
            <button onClick={() => openPolicyModal('data')}>Data Protection</button>
            <span className="separator">|</span>
            <button onClick={() => openPolicyModal('antispam')}>Anti-Spam</button>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-primary);
          color: #ffffff;
          border-top: 5px solid var(--color-secondary);
        }
        
        .footer-top {
          padding: 4.5rem 0 3rem 0;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.9fr 1.5fr;
          gap: 3rem;
        }
        
        .mb-4 {
          margin-bottom: 1rem;
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
        
        .white-text {
          color: #ffffff !important;
        }
        
        .gold-text {
          color: var(--color-secondary) !important;
        }
        
        .footer-desc {
          color: #cbd5e1;
          font-size: 0.92rem;
          margin-bottom: 1.5rem;
          max-width: 300px;
          line-height: 1.65;
        }

        /* Instagram pill button in brand column */
        .footer-insta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        
        .footer-insta-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(253, 29, 29, 0.35);
          color: #ffffff;
        }
        
        .footer-title {
          color: #ffffff;
          font-family: var(--font-serif);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .footer-title::after {
          content: '';
          display: block;
          width: 35px;
          height: 2px;
          background-color: var(--color-secondary);
          margin-top: 0.4rem;
        }
        
        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .footer-links button {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0;
          text-align: left;
        }
        
        .footer-links button:hover {
          color: var(--color-secondary);
        }

        /* Social CTA column */
        .footer-social-cta {
          display: flex;
          flex-direction: column;
        }

        .footer-social-desc {
          color: #cbd5e1;
          font-size: 0.92rem;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }

        .insta-cta-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: linear-gradient(135deg, rgba(131,58,180,0.25), rgba(253,29,29,0.2), rgba(252,176,69,0.18));
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .insta-cta-card:hover {
          transform: translateY(-3px);
          border-color: rgba(252,176,69,0.5);
          box-shadow: 0 12px 30px rgba(131,58,180,0.3);
          color: inherit;
        }

        .insta-cta-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
        }

        .insta-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .insta-meta {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .insta-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #ffffff;
        }

        .insta-handle {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .insta-follow-badge {
          background: linear-gradient(135deg, #833ab4, #fd1d1d);
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          flex-shrink: 0;
        }

        .insta-cta-bottom {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.75rem 1.25rem 1rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .insta-preview-tag {
          background: rgba(255,255,255,0.08);
          color: #cbd5e1;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .footer-bottom {
          background-color: var(--color-primary-hover);
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          color: #94a3b8;
        }
        
        .bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .trust-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .trust-links button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        
        .trust-links button:hover {
          color: var(--color-secondary);
        }
        
        .separator {
          color: rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .footer-desc {
            max-width: 100%;
          }
          .bottom-container {
            flex-direction: column;
            text-align: center;
          }
          .trust-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
