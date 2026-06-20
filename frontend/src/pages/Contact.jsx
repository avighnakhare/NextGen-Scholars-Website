import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      alert(err.message || 'Unable to send. Please email scholar.nextgens@gmail.com directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* HEADER */}
      <section className="contact-header text-center">
        <div className="container">
          <h1 className="contact-title mb-2">Contact Us</h1>
          <p className="contact-subtitle">Have questions about our programs, webinars, or partnership channels? Get in touch with our team.</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        <div className="container grid-2">
          {/* Contact Details */}
          <div className="contact-info">
            <h2 className="mb-3">Get in Touch</h2>
            <p className="mb-4">
              We respond to all student and parent inquiries within <strong>24–48 hours</strong>. Please check our FAQ page or attend our weekly webinar as most questions are covered in those forums.
            </p>

            <div className="info-block mb-3">
              <div className="info-icon">📧</div>
              <div>
                <h4>Direct Email Support</h4>
                <p><a href="mailto:scholar.nextgens@gmail.com">scholar.nextgens@gmail.com</a></p>
              </div>
            </div>

            <div className="info-block mb-3">
              <div className="info-icon">📸</div>
              <div>
                <h4>Instagram Channel</h4>
                <p><a href="https://www.instagram.com/scholars.nextgen" target="_blank" rel="noopener noreferrer">@scholars.nextgen</a></p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">📍</div>
              <div>
                <h4>Office Location</h4>
                <p>Charlotte, North Carolina (Virtual Services Worldwide)</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="card">
              <h3 className="mb-3" style={{ borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.75rem' }}>Send Us a Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contactName">Full Name</label>
                  <input
                    type="text"
                    id="contactName"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactEmail">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactMessage">Message Details</label>
                  <textarea
                    id="contactMessage"
                    rows="4"
                    className="form-control"
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? 'Submitting Message...' : 'Send Message'}
                </button>
              </form>

              {submitted && (
                <div className="contact-success-toast">
                  Message sent successfully! Our administrative team will reply in 24-48 hours.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-header {
          padding: 8rem 0 4rem 0;
          background: rgba(12, 35, 64, 0.1);
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
        }
        
        .contact-title {
          font-size: 2.75rem;
          color: #ffffff;
        }
        
        .contact-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 750px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .info-block {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .info-icon {
          font-size: 1.8rem;
          line-height: 1.2;
          background-color: var(--bg-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }
        
        .info-block h4 {
          font-size: 1rem;
          color: #ffffff;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }
        
        .info-block p, .info-block a {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        .info-block a:hover {
          color: var(--color-secondary);
        }
        
        .contact-success-toast {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid var(--color-success);
          border-radius: var(--radius-md);
          color: var(--color-success);
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
          animation: fadeIn 0.3s forwards;
        }
        
        @media (max-width: 768px) {
          .contact-header {
            padding: 7rem 0 3rem 0;
          }
          .contact-title {
            font-size: 2.15rem;
          }
          .contact-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
