import React from 'react';

export default function About() {
  const board = [
    { name: 'Avighna Khare', role: 'Co-Founder & Director', affiliation: 'NCSSM' },
    { name: 'Kavish Shah', role: 'Co-Founder & Director', affiliation: 'NCSSM' },
    { name: 'Siddhant Gutgutia', role: 'Co-Founder & Director', affiliation: 'NCSSM' }
  ];

  return (
    <div className="about-page">
      {/* HEADER SECTION */}
      <section className="about-header text-center">
        <div className="container">
          <h1 className="about-title mb-2">Our Mission</h1>
          <p className="about-subtitle">To democratize elite admissions preparation, scientific research opportunities, and leadership guidance for high-potential scholars.</p>
        </div>
      </section>

      {/* CORE FOCUS */}
      <section className="section">
        <div className="container grid-2">
          <div className="about-mission-text">
            <h2 className="mb-3">Why NextGen Scholars Exists</h2>
            <p className="mb-3">
              Every year, thousands of exceptionally talented high school students from diverse backgrounds miss out on premier education opportunities simply due to a lack of guidance and resources. Top public high schools (like NCSSM), research summer programs, and selective universities require a complex web of portfolio assets: independent research, community action, advanced testing, and persuasive essay narratives.
            </p>
            <p>
              NextGen Scholars is built to bridge this gap. We provide the structure, the network, and the mentorship completely free of charge to build confidence, establish legitimacy, and open doors for future leaders.
            </p>
          </div>
          <div className="about-pillars">
            <h3 className="mb-3" style={{ borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem' }}>Our Strategic Commitments</h3>
            <ul className="pillar-list">
              <li>
                <strong>Mentorship:</strong> Pairing scholars with NCSSM students who successfully navigated the same pathways.
              </li>
              <li>
                <strong>Academic Rigor:</strong> Designing portfolios around scientific inquiry, coding projects, and advanced reading.
              </li>
              <li>
                <strong>Leadership Audits:</strong> Guiding students to build their own local service networks and create measurable community impact.
              </li>
              <li>
                <strong>Democratized Admissions:</strong> Providing free assessments, webinar schedules, and checklists to parents and students.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BOARD OF DIRECTORS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Board of Directors</h2>
            <p className="section-subtitle">The founding team governing NextGen Scholars' mission, programs, and student impact.</p>
          </div>

          <div className="grid-3">
            {board.map((item, idx) => (
              <div key={idx} className="card advisor-card text-center">
                <div className="board-initial">{item.name.split(' ').map(n => n[0]).join('')}</div>
                <h4 className="mb-1">{item.name}</h4>
                <p className="text-muted mb-2">{item.role}</p>
                <div className="badge badge-navy" style={{ fontSize: '0.75rem' }}>{item.affiliation}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM COMING SOON */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle">We're building our advisory council, executive team, and academic staff. Stay tuned.</p>
          </div>

          <div className="coming-soon-card card text-center">
            <div className="coming-soon-icon">🚧</div>
            <h3 className="mb-2">Team Announcements Coming Soon</h3>
            <p className="text-muted" style={{ maxWidth: '520px', margin: '0 auto' }}>
              We're in the process of finalizing our advisors, program directors, and academic partners. Check back soon — exciting announcements are on the way.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .about-header {
          padding: 8rem 0 4rem 0;
          background: rgba(12, 35, 64, 0.1);
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
        }
        
        .about-title {
          font-size: 2.75rem;
          color: #ffffff;
        }
        
        .about-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 750px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .pillar-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .pillar-list li {
          position: relative;
          padding-left: 1.5rem;
          color: var(--text-secondary);
        }
        
        .pillar-list li::before {
          content: '✔';
          position: absolute;
          left: 0;
          color: var(--color-secondary);
          font-weight: 700;
        }

        .board-initial {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(12, 35, 64, 0.5);
          border: 2px solid var(--color-secondary);
          color: #fff;
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }
        
        .advisor-card {
          padding: 2rem 1.5rem;
        }

        .coming-soon-card {
          padding: 4rem 2rem;
          max-width: 680px;
          margin: 0 auto;
          border: 1px dashed rgba(212, 175, 55, 0.35);
          background: rgba(212, 175, 55, 0.04);
        }

        .coming-soon-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .about-header {
            padding: 7rem 0 3rem 0;
          }
          .about-title {
            font-size: 2.15rem;
          }
          .about-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
