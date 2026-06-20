import React, { useState } from 'react';

const STEPS = [
  {
    id: 1,
    title: "Academics & Rigor",
    summary: "Take the hardest courses available to you.",
    details: "NCSSM wants to see that you stretch yourself. If your school has Honors, AP, IB, or dual-enrollment classes, take them. Admissions officers tell us they care much more about seeing you stretch yourself and get a B in AP Calculus than taking an easy path for an A in standard classes.",
    tip: "What works: Challenging yourself in core STEM classes, even if it means your GPA isn't a perfect 4.0."
  },
  {
    id: 2,
    title: "STEM Profile",
    summary: "Focus on depth, not a laundry list of clubs.",
    details: "Admissions look for a true interest in STEM. You don't need to be president of five different clubs. Spend your time on one or two things you genuinely care about—like building a weather station, coding games, or writing science guides. Show that you do STEM even when you're not forced to in class.",
    tip: "What works: Self-directed projects where you actually built, coded, or researched something on your own initiative."
  },
  {
    id: 3,
    title: "Evaluations",
    summary: "Pick teachers who know how you think.",
    details: "You need evaluation responses from one math teacher and one science teacher. Pick teachers who have seen you struggle and overcome a challenge. They write evaluations that tell the committee how you think. Don't just pick the teacher who gave you the easiest A; pick the one who knows your work ethic.",
    tip: "What works: Providing your teachers with a 'brag sheet' highlighting your classroom projects and STEM highlights."
  },
  {
    id: 4,
    title: "The Essays",
    summary: "This is where you speak directly to the committee.",
    details: "Your GPA tells them you can do the academic work; your essays tell them who you are. Avoid generic essays like 'I want to go to NCSSM because I love science.' Write about a specific time you failed a science lab, a hobby you're obsessed with, or why you want to live in a residential dorm with peers.",
    tip: "What works: Being honest about your failures, what you learned, and how you work in a team."
  },
  {
    id: 5,
    title: "Math Test",
    summary: "Evaluating mathematical reasoning and aptitude.",
    details: "Residential applicants must take the NCSSM Math Assessment. It's a test of math logic and reasoning. Focus on quick calculations, algebra, and word problems. Speed and mental agility are key.",
    tip: "What works: Focus on logic puzzles and practice mental math and problem solving under time limits."
  }
];

const FAQS = [
  {
    question: "Does NCSSM require a perfect 4.0 GPA?",
    answer: "No, a perfect GPA is not required. The admissions committee prioritizes course rigor (taking the most challenging honors/AP classes available at your high school) and grades in core STEM courses. A student with a few B's in highly challenging courses is often preferred over a student with straight A's in standard-level classes."
  },
  {
    question: "How does the congressional district quota work?",
    answer: "NCSSM selects an equal percentage of students from each of North Carolina's congressional districts. This ensures geographical diversity. This means you are only competing against other applicants in your specific district, rather than the entire state."
  },
  {
    question: "What is the difference between Residential and Online programs?",
    answer: "The Residential program involves living on-campus in Durham or Morganton for 11th and 12th grades. The Online program allows you to take rigorous NCSSM courses virtually while remaining enrolled at your local high school. Both programs are tuition-free and carry high prestige."
  },
  {
    question: "When should I start preparing my essays?",
    answer: "We recommend brainstorming essay topics during the summer before 10th grade and starting drafts in October when the CFNC application portal opens. The final deadline is in early January, but good essays require multiple drafts and peer review cycles."
  }
];

export default function NcssmPrep({ setCurrentPage }) {
  const [activeStep, setActiveStep] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [campusSlide, setCampusSlide] = useState(0);
  const [sliding, setSliding] = useState(false);

  const CAMPUS_SLIDES = [
    { src: '/campus/durham.jpg',    label: 'Durham Campus', caption: 'Watts Hall — Main Entrance' },
    { src: '/campus/morganton.png', label: 'Morganton Campus', caption: 'NCSSM West — Mountain Region' }
  ];

  const goToSlide = (dir) => {
    if (sliding) return;
    setSliding(true);
    setCampusSlide((prev) => (prev + dir + CAMPUS_SLIDES.length) % CAMPUS_SLIDES.length);
    setTimeout(() => setSliding(false), 320);
  };

  const handleStepClick = (stepId) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="ncssm-prep-page">
      {/* HERO SECTION */}
      <header className="ncssm-hero">
        <div className="container ncssm-hero-grid">
          <div className="ncssm-hero-content text-left">
            <div className="ncssm-hero-badge">
              <span className="badge-dot"></span> Admissions Support for NC 10th Graders
            </div>
            <h1 className="ncssm-hero-title">
              Get Into NCSSM: <br />
              <span className="gradient-text">Alumni Advice</span>
            </h1>
            <p className="ncssm-hero-desc">
              Applying to the North Carolina School of Science and Mathematics is unlike applying to any other high school. We are a group of NCSSM alumni volunteering our time under NextGen Scholars to help you build your STEM profile, write authentic essays, and navigate district-level admissions.
            </p>
            <div className="ncssm-hero-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const section = document.getElementById('process');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Understand the Process
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentPage('funnel');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Join Free Workshop
              </button>
            </div>
          </div>

          <div className="ncssm-hero-visual">
            <div className="ncssm-visual-card glass-card">
              <div className="campus-slider">
                <img
                  key={campusSlide}
                  src={CAMPUS_SLIDES[campusSlide].src}
                  alt={CAMPUS_SLIDES[campusSlide].label}
                  className="campus-slide-img"
                />
                <button className="slider-arrow left" onClick={() => goToSlide(-1)} aria-label="Previous campus">&#8592;</button>
                <button className="slider-arrow right" onClick={() => goToSlide(1)} aria-label="Next campus">&#8594;</button>
                <div className="campus-label-badge">{CAMPUS_SLIDES[campusSlide].label}</div>
                <div className="slider-dots">
                  {CAMPUS_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      className={`slider-dot${i === campusSlide ? ' active' : ''}`}
                      onClick={() => { if (!sliding) { setSliding(true); setCampusSlide(i); setTimeout(() => setSliding(false), 320); } }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="ncssm-visual-caption">
                <strong>{CAMPUS_SLIDES[campusSlide].caption}</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Admissions Resource</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TIMELINE SECTION */}
      <section id="process" className="section process-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline">01 / The Application Roadmap</span>
            <h2 className="section-title">Step-by-Step Admissions Journey</h2>
            <p className="section-desc">The NCSSM selection committee evaluates applicants holistically. Click on each milestone to discover key strategies for success.</p>
          </div>

          <div className="timeline-wrapper">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div 
                  key={step.id} 
                  className={`timeline-step glass-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="step-badge">{step.id}</div>
                  <h3>{step.title}</h3>
                  <p className="step-summary">{step.summary}</p>
                  <div className="step-details">
                    <p style={{ color: 'var(--text-color)' }}>{step.details}</p>
                    <span className="tip-tag">{step.tip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STRATEGIC PILLARS */}
      <section className="section pillars-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline">02 / Strategic Focus Areas</span>
            <h2 className="section-title">Where Applications Are Won</h2>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card glass-card">
              <div className="pillar-icon">📝</div>
              <h3>Honest Essay Editing</h3>
              <p className="pillar-desc">
                Your essay is the only place on the application where you aren't represented by numbers. We help you cut out AI-generated clichés and find your real voice:
              </p>
              <ul className="pillar-list">
                <li><strong>Write local:</strong> Reflect on your actual life in North Carolina, your family, and your hometown.</li>
                <li><strong>Be room-ready:</strong> Show that you are mature enough to live in a residential dorm with peers.</li>
                <li><strong>Reflect on struggle:</strong> Speak honestly about a class where you struggled or a lab that completely failed.</li>
              </ul>
            </div>

            <div className="pillar-card glass-card">
              <div className="pillar-icon">🧬</div>
              <h3>Independent STEM Projects</h3>
              <p className="pillar-desc">
                Do not join clubs just to list them. The admissions committee sees right through resume-packing. We help you show true initiative and deep focus:
              </p>
              <ul className="pillar-list">
                <li><strong>Do, don't join:</strong> Wrote a small app? Ran a local study? That counts 10x more than sitting in a club meeting.</li>
                <li><strong>Quantifiable impact:</strong> Show how you taught others, managed a local budget, or solved a community problem.</li>
                <li><strong>STEM connection:</strong> Connect your personal hobbies directly with your scientific or mathematical curiosity.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PEER MENTORSHIP WORKSHOPS CALLOUT */}
      <section className="section ncssm-workshops-section">
        <div className="container">
          <div className="ncssm-workshops-box glass-card text-center">
            <span className="section-tagline">03 / Peer Mentorship</span>
            <h2 className="section-title">Interactive Essay &amp; Profile Workshops</h2>
            <p className="section-desc mb-4" style={{ color: 'var(--text-muted)' }}>
              Join our free workshops led by NCSSM alumni. Reserve a seat to get your essay drafted and reviewed by students who successfully navigated the process.
            </p>

            <div className="ncssm-workshop-options">
              <div className="ncssm-opt-card glass-card">
                <span className="opt-tag">Writing</span>
                <h4>Essay Drafting &amp; Cliché-Busting</h4>
                <p>Learn to craft personal narratives and review sample accepted essays.</p>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setCurrentPage('funnel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Book Free Seat
                </button>
              </div>

              <div className="ncssm-opt-card glass-card">
                <span className="opt-tag highlight">Profile</span>
                <h4>STEM Profile Building Strategy</h4>
                <p>How to construct independent science and coding projects from scratch.</p>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setCurrentPage('funnel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Book Free Seat
                </button>
              </div>

              <div className="ncssm-opt-card glass-card">
                <span className="opt-tag test">Assessment</span>
                <h4>Math Aptitude Test Simulation</h4>
                <p>Solve high-frequency logical questions from previous math tests.</p>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setCurrentPage('funnel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Book Free Seat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline">04 / Helpful Information</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, idx) => {
              const isFaqActive = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="faq-item glass-card"
                  onClick={() => handleFaqClick(idx)}
                >
                  <div className="faq-question">
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle-icon">{isFaqActive ? '−' : '+'}</span>
                  </div>
                  {isFaqActive && (
                    <div className="faq-answer">
                      <p style={{ color: 'var(--text-muted)' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .ncssm-hero {
          padding: 8rem 0 4rem 0;
          position: relative;
        }
        
        .ncssm-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          align-items: center;
        }
        
        .ncssm-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--gold-accent);
          box-shadow: 0 0 8px var(--gold-accent);
          animation: pulse 2s infinite;
        }
        
        .ncssm-hero-title {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        
        .ncssm-hero-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
        
        .ncssm-hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .ncssm-hero-visual {
          display: flex;
          justify-content: center;
        }
        
        .ncssm-visual-card {
          width: 100%;
          max-width: 380px;
          padding: 0.75rem;
          border-radius: var(--radius-lg);
          border-top: 4px solid var(--gold-accent);
        }
        
        .ncssm-visual-placeholder {
          height: 220px;
          background-color: rgba(12, 35, 64, 0.2);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border: 1px dashed var(--border-color);
        }
        
        .ncssm-campus-label {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--gold-accent);
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }

        /* CAMPUS SLIDER */
        .campus-slider {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: rgba(12, 35, 64, 0.3);
        }

        .campus-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }

        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(3, 8, 14, 0.65);
          border: 1px solid rgba(212, 175, 55, 0.5);
          color: var(--gold-accent);
          font-size: 1.25rem;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          z-index: 2;
          line-height: 1;
          padding: 0;
        }

        .slider-arrow:hover {
          background: rgba(212, 175, 55, 0.25);
          transform: translateY(-50%) scale(1.1);
        }

        .slider-arrow.left  { left: 8px; }
        .slider-arrow.right { right: 8px; }

        .campus-label-badge {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(3, 8, 14, 0.75);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: var(--gold-accent);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .slider-dots {
          position: absolute;
          top: 8px;
          right: 10px;
          display: flex;
          gap: 5px;
          z-index: 2;
        }

        .slider-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 0;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .slider-dot.active {
          background: var(--gold-accent);
          transform: scale(1.3);
        }

        .ncssm-visual-caption {
          padding: 1rem 0.5rem 0.5rem 0.5rem;
          text-align: left;
        }
        
        .ncssm-visual-caption strong {
          color: var(--text-color);
          font-size: 0.95rem;
        }
        
        /* TIMELINE ACCORDION */
        .timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .timeline-step {
          padding: 1.5rem 2rem;
          cursor: pointer;
          position: relative;
          text-align: left;
        }
        
        .step-badge {
          position: absolute;
          top: 1.5rem;
          left: 2rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-color);
          border: 2px solid var(--gold-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #ffffff;
        }
        
        .timeline-step h3 {
          font-size: 1.4rem;
          margin-left: 54px;
          margin-bottom: 0.25rem;
          color: var(--text-color);
        }
        
        .step-summary {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-left: 54px;
        }
        
        .step-details {
          margin-left: 54px;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height var(--transition-normal) ease-out, 
                      opacity var(--transition-normal) ease-out,
                      margin-top var(--transition-normal) ease-out;
        }
        
        .timeline-step.active {
          border-color: var(--gold-accent);
          background-color: rgba(12, 35, 64, 0.4);
        }
        
        .timeline-step.active .step-details {
          max-height: 250px;
          opacity: 1;
          margin-top: 1rem;
        }
        
        .tip-tag {
          display: inline-block;
          margin-top: 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gold-accent);
          background: rgba(212, 175, 55, 0.05);
          border: 1px dashed var(--gold-accent);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
        }
        
        /* PILLARS */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          text-align: left;
        }
        
        .pillar-card {
          padding: 2.5rem;
        }
        
        .pillar-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        
        .pillar-card h3 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }
        
        .pillar-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        
        .pillar-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0;
        }
        
        .pillar-list li {
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        
        .pillar-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--gold-accent);
          font-weight: 700;
        }
        
        .pillar-list strong {
          color: var(--text-color);
        }
        
        /* WORKSHOPS */
        .ncssm-workshops-box {
          padding: 3rem 2rem;
          border-top: 4px solid var(--gold-accent);
        }
        
        .ncssm-workshop-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
          text-align: left;
        }
        
        .ncssm-opt-card {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: border-color var(--transition-normal);
        }
        
        .ncssm-opt-card:hover {
          border-color: var(--gold-accent);
        }
        
        .opt-tag {
          align-self: flex-start;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--secondary-accent);
          background-color: rgba(0, 180, 216, 0.08);
          border: 1px solid rgba(0, 180, 216, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        
        .opt-tag.highlight {
          color: var(--gold-accent);
          background-color: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .opt-tag.test {
          color: #a78bfa;
          background-color: rgba(167, 139, 250, 0.08);
          border: 1px solid rgba(167, 139, 250, 0.2);
        }
        
        .ncssm-opt-card h4 {
          font-size: 1.15rem;
          color: var(--text-color);
        }
        
        .ncssm-opt-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          flex-grow: 1;
        }
        
        /* FAQS */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
          text-align: left;
        }
        
        .faq-item {
          padding: 1.25rem 1.75rem;
          cursor: pointer;
        }
        
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .faq-question h3 {
          font-size: 1.15rem;
          color: var(--text-color);
          font-family: var(--font-sans);
        }
        
        .faq-toggle-icon {
          font-size: 1.5rem;
          color: var(--gold-accent);
          font-weight: 700;
        }
        
        .faq-answer {
          margin-top: 0.75rem;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          animation: fadeIn 0.3s forwards;
        }
        
        @media (max-width: 900px) {
          .ncssm-hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .ncssm-hero-content {
            text-align: center;
          }
          
          .ncssm-hero-title {
            font-size: 2.5rem;
          }
          
          .ncssm-hero-actions {
            justify-content: center;
          }
          
          .ncssm-hero-visual {
            margin-top: 2rem;
          }
          
          .pillars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
