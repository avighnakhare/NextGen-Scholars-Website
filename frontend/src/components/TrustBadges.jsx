import React from 'react';

export default function TrustBadges() {
  const badges = [
    { title: '501(c)(3) Organization', desc: 'Registered educational nonprofit, dedicated to student empowerment.', icon: '🎓' },
    { title: 'COPPA Compliant', desc: 'Strict safety controls and privacy standards for student protection.', icon: '🛡️' },
    { title: 'WCAG Accessible', desc: 'Designed to be fully inclusive for learners of all abilities.', icon: '♿' },
    { title: 'SSL Encrypted Data', desc: 'Highest standard of security and data privacy safeguards.', icon: '🔒' }
  ];

  return (
    <section className="badges-section">
      <div className="container grid-4">
        {badges.map((b, idx) => (
          <div key={idx} className="badge-item">
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-text">
              <h4 className="badge-item-title">{b.title}</h4>
              <p className="badge-item-desc">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .badges-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--bg-tertiary);
          border-bottom: 1px solid var(--bg-tertiary);
          padding: 2.5rem 0;
        }
        
        .badge-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .badge-icon {
          font-size: 2rem;
          padding: 0.5rem;
          background-color: #ffffff;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          line-height: 1;
        }
        
        .badge-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .badge-item-title {
          font-size: 1rem;
          color: var(--color-primary);
          font-weight: 700;
        }
        
        .badge-item-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
