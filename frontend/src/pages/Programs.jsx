import React from 'react';

export default function Programs({ setCurrentPage }) {
  const corePrograms = [
    { title: 'Admissions Mentorship', desc: 'Step-by-step guidance on course selection, resume positioning, recommendation letter strategies, and application planning.', icon: '🎓' },
    { title: 'Leadership Development', desc: 'Guidance to launch community service organizations, register student nonprofits, and organize regional academic workshops.', icon: '🌟' },
    { title: 'STEM & Coding Focus', desc: 'Support to enter mathematics contests, build software prototypes, write apps, and participate in high-status Olympiads.', icon: '💻' },
    { title: 'Research Guidance', desc: 'Learn scientific query building, research methodology, academic paper structures, and how to pitch to university laboratory PIs.', icon: '🧬' },
    { title: 'Interview Preparation', desc: 'Mock interviews, voice coaching, question drills, and feedback reports for prestigious high schools and Ivy league settings.', icon: '🗣️' },
    { title: 'Essay Review Sessions', desc: 'Professional structure feedback, hooks editing, narrative auditing, and formatting audits for personal statements.', icon: '📝' }
  ];

  const futurePrograms = [
    { title: 'AI Admissions Assessment', desc: 'Interactive algorithms generating immediate readiness audits against top boarding school and college admission models.', phase: 'Phase 2 (2026)' },
    { title: 'Mentor-Student Matching Engine', desc: 'Cohort assignment algorithms matching scholars directly with university students studying in their exact field.', phase: 'Phase 2 (2026)' },
    { title: 'Scholarship Database & Forum', desc: 'Aggregated lookup tools containing regional and national scholarship sources alongside student peer support forums.', phase: 'Phase 3 (2027)' }
  ];

  return (
    <div className="programs-page">
      {/* HEADER */}
      <section className="programs-header text-center">
        <div className="container">
          <h1 className="programs-title mb-2">Academic Programs</h1>
          <p className="programs-subtitle">Professional-grade training pathways to accelerate portfolios for highly selective boarding schools and elite colleges.</p>
        </div>
      </section>

      {/* CORE PROGRAMS */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Our Mentorship Offerings</h2>
            <p className="section-subtitle">Comprehensive cohorts led by alumni mentors to build credentials and build authority in admissions rosters.</p>
          </div>

          <div className="grid-3">
            {corePrograms.map((prog, idx) => (
              <div key={idx} className="card program-card">
                <div className="program-icon-box">{prog.icon}</div>
                <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>{prog.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{prog.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => {
                setCurrentPage('funnel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Sign Up For Admissions Assessment Webinar
            </button>
          </div>
        </div>
      </section>

      {/* FUTURE PIPELINE */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Future Program Extensions</h2>
            <p className="section-subtitle">Scaling our database and matching logic to support over 10,000+ applicants in the coming years.</p>
          </div>

          <div className="grid-3">
            {futurePrograms.map((prog, idx) => (
              <div key={idx} className="card future-card">
                <div className="badge badge-gold mb-3" style={{ alignSelf: 'flex-start' }}>{prog.phase}</div>
                <h3 className="mb-2" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{prog.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .programs-header {
          padding: 8rem 0 4rem 0;
          background: rgba(12, 35, 64, 0.1);
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
        }
        
        .programs-title {
          font-size: 2.75rem;
          color: #ffffff;
        }
        
        .programs-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 750px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .program-card {
          display: flex;
          flex-direction: column;
          padding: 2.25rem 1.75rem;
        }
        
        .program-icon-box {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1;
        }
        
        .future-card {
          display: flex;
          flex-direction: column;
          border-top: 3px dashed var(--color-secondary);
        }
        
        .future-card h3 {
          color: #ffffff;
        }
        
        .mt-5 {
          margin-top: 3rem;
        }
        
        @media (max-width: 768px) {
          .programs-header {
            padding: 7rem 0 3rem 0;
          }
          .programs-title {
            font-size: 2.15rem;
          }
          .programs-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
