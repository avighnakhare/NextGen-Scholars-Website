import React from 'react';
import TrustBadges from '../components/TrustBadges';

export default function Home({ setCurrentPage }) {
  const stats = [
    { number: '100%', label: 'Free Services' },
    { number: '95%', label: 'Admissions Boost' },
    { number: '500+', label: 'Mentor Hours Logged' },
    { number: '50+', label: 'Ivy & STEM Placements' }
  ];

  const founders = [
    {
      name: 'Avighna Khare',
      role: 'Co-Founder',
      bio: 'Passionate about making elite academic pathways accessible to every driven student regardless of background.',
      prevSchool: 'William A. Hough High School',
      currentSchool: 'NCSSM',
      photo: '/founders/avighna.png'
    },
    {
      name: 'Kavish Shah',
      role: 'Co-Founder',
      bio: 'Dedicated to bridging the gap between potential and opportunity through personalized mentorship and strategic planning.',
      prevSchool: 'Olympic High School',
      currentSchool: 'NCSSM',
      photo: '/founders/kavish.png'
    },
    {
      name: 'Siddhant Gutgutia',
      role: 'Co-Founder',
      bio: 'Committed to empowering scholars with the tools, network, and guidance needed to reach top programs nationwide.',
      prevSchool: 'Mallard Creek High School',
      currentSchool: 'NCSSM',
      photo: '/founders/siddhant.jpg'
    }
  ];

  const testimonials = [
    { text: "NextGen Scholars completely changed my trajectory. The mentorship and research advice helped me secure a lab internship that got me into NCSSM and Yale.", student: "Aria Patel", status: "NCSSM Class of '25, Yale '29" },
    { text: "As a parent, I was overwhelmed. The admissions webinars gave us a clear roadmap and timelines. Best of all, it's run by people who genuinely care.", student: "David Chen", status: "Parent of 11th Grade Scholar" }
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="container hero-container grid-2">
          <div className="hero-content text-left">
            <span className="hero-tagline">Building the Next Generation of Leaders</span>
            <h1 className="hero-title">Unlock Your Potential. Build Your Future.</h1>
            <p className="hero-desc">
              Personalized mentorship, admissions guidance, leadership development, and high-impact STEM opportunities for ambitious high school students. 
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('funnel')}
              >
                Register For Free Webinar
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  const section = document.getElementById('pillars');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <div className="hero-accent-blob-1"></div>
            <div className="hero-accent-blob-2"></div>
            <div className="hero-card card">
              <div className="hero-card-header">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot font"></span>
              </div>
              <div className="hero-card-body">
                <div className="badge badge-gold mb-2">Live Admissions Workshop</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Admissions Competitiveness Seminar</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Join top admissions mentors for an audit of how to maximize your portfolio for selective programs.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>Seats Remaining: 12</span>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => setCurrentPage('funnel')}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Claim Seat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST BADGES */}
      <TrustBadges />

      {/* METRICS SECTION */}
      <section className="section stats-section">
        <div className="container text-center">
          <div className="grid-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-num">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS / MISSION SUMMARY */}
      <section id="pillars" className="section section-alt">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Our Core Focus</h2>
            <p className="section-subtitle">We equip young scholars with the pillars necessary to excel in selective admissions and future leadership roles.</p>
          </div>
          
          <div className="grid-3">
            <div className="card text-center">
              <div className="pillar-icon">🧬</div>
              <h3 className="mb-3">STEM &amp; Research</h3>
              <p>Connecting students with research laboratories, academic writing mentors, and prestigious engineering competitions.</p>
            </div>
            <div className="card text-center">
              <div className="pillar-icon">🤝</div>
              <h3 className="mb-3">Mentorship</h3>
              <p>One-on-one sessions with university alumni to guide target course planning, resume building, and admissions interviews.</p>
            </div>
            <div className="card text-center">
              <div className="pillar-icon">🌟</div>
              <h3 className="mb-3">Leadership Development</h3>
              <p>Supporting students to establish service organizations, complete community audits, and pitch entrepreneurial projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">Hear from the students and parents who have walked the path with NextGen Scholars.</p>
          </div>

          <div className="grid-2">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card testimonial-card">
                <div className="quote-mark">“</div>
                <p className="testimonial-text mb-4">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.student[0]}</div>
                  <div>
                    <h4 className="author-name">{t.student}</h4>
                    <p className="author-status">{t.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Meet Our Founders</h2>
            <p className="section-subtitle">NextGen Scholars was built by NCSSM students who went through the same journey — and want to make it easier for you.</p>
          </div>

          <div className="grid-3">
            {founders.map((f, idx) => (
              <div key={idx} className="card founder-card text-center">
                <div className="founder-photo-wrapper">
                  <img
                    src={f.photo}
                    alt={`${f.name} - ${f.role}`}
                    className="founder-photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="founder-avatar-fallback" style={{ display: 'none' }}>
                    {f.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="founder-name mb-1">{f.name}</h3>
                <div className="badge badge-navy mb-3">{f.role}</div>
                <p className="founder-bio mb-4">{f.bio}</p>
                <div className="founder-school-path">
                  <div className="school-from">
                    <span className="school-label">Previously</span>
                    <span className="school-name">{f.prevSchool}</span>
                  </div>
                  <div className="school-arrow">→</div>
                  <div className="school-to">
                    <span className="school-label">Now at</span>
                    <span className="school-name ncssm-name">{f.currentSchool}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ CTA */}
      <section className="section quiz-cta-section text-center">
        <div className="container">
          <div className="quiz-cta-box">
            <h2 className="mb-2">How Competitive is Your Profile?</h2>
            <p className="mb-4">Evaluate your GPA, rigor, extracurriculars, and STEM alignment with our rapid audit tool.</p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setCurrentPage('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Take the Application Quiz
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          padding: 8rem 0 5rem 0;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        
        .hero-container {
          align-items: center;
        }
        
        .hero-content {
          max-width: 550px;
        }
        
        .hero-tagline {
          color: var(--color-secondary);
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }
        
        .hero-title {
          font-size: 3.25rem;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: #ffffff;
        }
        
        .hero-desc {
          font-size: 1.15rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          color: var(--text-secondary);
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .hero-image-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 350px;
        }
        
        .hero-accent-blob-1 {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(13,56,107,0.3) 0%, rgba(3,8,14,0) 70%);
          top: -20px;
          right: -20px;
          z-index: 1;
        }
        
        .hero-accent-blob-2 {
          position: absolute;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(3,8,14,0) 70%);
          bottom: -40px;
          left: -20px;
          z-index: 1;
        }
        
        .hero-card {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 2;
          border-top: 4px solid var(--color-secondary);
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .hero-card-header {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        
        .hero-card-header .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--border-color);
        }
        
        .hero-card-header .dot:nth-child(1) { background-color: var(--color-danger); }
        .hero-card-header .dot:nth-child(2) { background-color: var(--color-warning); }
        .hero-card-header .dot:nth-child(3) { background-color: var(--color-success); }
        
        .stats-section {
          background-color: rgba(12, 35, 64, 0.15);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
          padding: 3.5rem 0;
        }

        
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-num {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 800;
          color: var(--color-secondary);
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .pillar-icon {
          font-size: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1;
        }
        
        .testimonial-card {
          position: relative;
          padding: 2.5rem;
        }
        
        .quote-mark {
          position: absolute;
          top: 10px;
          left: 20px;
          font-size: 5rem;
          line-height: 1;
          color: rgba(217, 119, 6, 0.1);
          font-family: Georgia, serif;
        }
        
        .testimonial-text {
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        
        .author-avatar {
          width: 44px;
          height: 44px;
          background-color: var(--color-secondary-light);
          color: var(--color-warning);
          font-family: var(--font-serif);
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .author-name {
          font-size: 1rem;
          color: var(--color-primary);
          margin-bottom: 0.15rem;
        }
        
        .author-status {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .founder-card {
          padding: 2.25rem 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .founder-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.12);
        }
        
        .founder-photo-wrapper {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin: 0 auto 1.25rem auto;
          border: 3px solid var(--color-secondary);
          box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.12);
          overflow: hidden;
          position: relative;
        }

        .founder-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .founder-avatar-fallback {
          width: 100%;
          height: 100%;
          background-color: rgba(12, 35, 64, 0.4);
          color: #ffffff;
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 800;
          align-items: center;
          justify-content: center;
        }
        
        .founder-name {
          font-size: 1.25rem;
        }
        
        .founder-bio {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }

        .founder-school-path {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          border-top: 1px solid var(--border-color);
          padding-top: 0.85rem;
          margin-top: auto;
        }

        .school-from, .school-to {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .school-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .school-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .ncssm-name {
          color: var(--color-secondary);
        }

        .school-arrow {
          font-size: 1rem;
          color: var(--color-secondary);
          font-weight: 700;
          flex-shrink: 0;
        }

        .quiz-cta-section {
          padding: 5rem 0;
          background: transparent;
        }
        
        .quiz-cta-box {
          max-width: 650px;
          margin: 0 auto;
          background: rgba(12, 35, 64, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          box-shadow: var(--shadow-premium);
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 7rem 0 3.5rem 0;
            text-align: center;
          }
          
          .hero-content {
            margin: 0 auto;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.35rem;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .hero-image-wrapper {
            margin-top: 2.5rem;
            height: auto;
          }
          
          .hero-card {
            margin: 0 auto;
          }
          
          .quiz-cta-box {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

