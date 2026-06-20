import React, { useState } from 'react';

const QUIZ_QUESTIONS = [
  {
    question: "What is your current unweighted GPA?",
    options: [
      { text: "3.9 - 4.0", score: 4 },
      { text: "3.7 - 3.8", score: 3 },
      { text: "3.5 - 3.6", score: 2 },
      { text: "Below 3.5", score: 1 }
    ]
  },
  {
    question: "What is your level of course rigor (AP, IB, Honors, Dual Enrollment)?",
    options: [
      { text: "Extremely Rigorous (Taking maximum advanced classes available)", score: 4 },
      { text: "Very Rigorous (Taking 3+ advanced classes)", score: 3 },
      { text: "Moderately Rigorous (Taking 1-2 advanced classes)", score: 2 },
      { text: "Standard Curriculum", score: 1 }
    ]
  },
  {
    question: "How would you describe your extracurricular participation?",
    options: [
      { text: "Leadership (Founded clubs, holds executive roles, major impacts)", score: 4 },
      { text: "Active Member (Consistent participation, minor leadership roles)", score: 3 },
      { text: "Exploratory (Occasional participation in various clubs)", score: 2 },
      { text: "Minimal involvement outside schoolwork", score: 1 }
    ]
  },
  {
    question: "Do you have any experience in scientific research, internships, or advanced STEM projects?",
    options: [
      { text: "Yes (Independent research paper, university lab, or tech prototype)", score: 4 },
      { text: "Underway (Planning research or enrolled in a summer camp)", score: 3 },
      { text: "Interests (Interested but haven't found opportunities yet)", score: 2 },
      { text: "None/Not interested", score: 1 }
    ]
  },
  {
    question: "Have you started preparing for target high schools/colleges or standardized tests?",
    options: [
      { text: "Fully Prepared (Took mock tests, drafting admissions essays)", score: 4 },
      { text: "Started (Reviewing test guides, identifying target programs)", score: 3 },
      { text: "Interested but haven't started prepping", score: 2 },
      { text: "Not yet focused on this", score: 1 }
    ]
  }
];

export default function SuccessQuiz({ setCurrentPage }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (idx) => {
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;
    const points = QUIZ_QUESTIONS[currentIdx].options[selectedOpt].score;
    const updatedAnswers = [...answers, points];
    setAnswers(updatedAnswers);

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      // Finished
      setQuizFinished(true);
      trackQuizCompletion();
    }
  };

  const trackQuizCompletion = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'quiz_complete', url: '/quiz' })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswers([]);
    setQuizFinished(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxPossibleScore = QUIZ_QUESTIONS.length * 4;
  
  let resultLevel = 'Developing';
  let resultColor = 'var(--color-danger)';
  let advice = '';

  if (totalScore >= 16) {
    resultLevel = 'Highly Competitive';
    resultColor = 'var(--color-success)';
    advice = 'Outstanding application profile! You are in an excellent position for selective academic programs, NCSSM, and top universities. To stand out further, focus on finalizing unique independent research, securing standout mentor letters, and crafting elite personal statements. Register for our upcoming webinar for a customized application audit!';
  } else if (totalScore >= 11) {
    resultLevel = 'Competitive';
    resultColor = 'var(--color-warning)';
    advice = 'Solid progress! You have a competitive baseline but there are strategic gaps in your profile—particularly in leadership roles, STEM projects, or advanced writing. By targeting high-impact extracurricular opportunities and leveling up course rigor, you can substantially improve your chances. Join our free webinar to map out your application strategy!';
  } else {
    resultLevel = 'Developing';
    resultColor = 'var(--color-danger)';
    advice = 'Good start, but your application requires systematic development to compete for highly selective admissions. You need to quickly identify advanced STEM classes, seek out service leadership roles, and build a cohesive extracurricular narrative. Don’t panic—attend our free admissions assessment webinar to learn step-by-step how to construct a standout portfolio!';
  }

  return (
    <div className="quiz-card card text-center">
      {!quizFinished ? (
        <div>
          <div className="quiz-header">
            <span className="badge badge-navy">Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="quiz-question mb-4">{QUIZ_QUESTIONS[currentIdx].question}</h3>

          <div className="options-grid">
            {QUIZ_QUESTIONS[currentIdx].options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedOpt === idx ? 'selected' : ''}`}
                onClick={() => handleOptionClick(idx)}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <div className="quiz-footer mt-4">
            <button
              className="btn btn-primary next-btn"
              onClick={handleNext}
              disabled={selectedOpt === null}
            >
              {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question &rarr;'}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <div className="result-icon-wrapper">🚀</div>
          <h3 className="mb-2">Your Admissions Readiness Score</h3>
          <div className="score-display" style={{ color: resultColor }}>
            <span className="score-num">{totalScore}</span> / {maxPossibleScore}
          </div>
          <div className="result-badge mb-3" style={{ backgroundColor: `${resultColor}15`, color: resultColor }}>
            {resultLevel} Profile
          </div>
          
          <p className="result-advice mb-4">{advice}</p>

          <div className="btn-group">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setCurrentPage('funnel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Register for Free Webinar &amp; Audit
            </button>
            <button 
              className="btn btn-outline"
              onClick={resetQuiz}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}

      <style>{`
        .quiz-card {
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
          padding: 2.5rem;
        }
        
        .quiz-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background-color: var(--color-secondary);
          transition: width var(--transition-normal);
        }
        
        .quiz-question {
          font-size: 1.35rem;
          color: var(--color-primary);
          line-height: 1.4;
        }
        
        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        
        .option-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .option-btn:hover {
          background-color: var(--bg-secondary);
          border-color: var(--color-primary);
        }
        
        .option-btn.selected {
          background-color: rgba(30, 58, 138, 0.05);
          border-color: var(--color-primary);
          color: var(--color-primary);
          font-weight: 600;
          box-shadow: 0 0 0 1px var(--color-primary);
        }
        
        .next-btn {
          width: 100%;
        }
        
        .quiz-results {
          text-align: center;
        }
        
        .result-icon-wrapper {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .score-display {
          font-size: 2.5rem;
          font-family: var(--font-serif);
          font-weight: 800;
          margin: 0.5rem 0;
        }
        
        .score-num {
          font-size: 3.5rem;
        }
        
        .result-badge {
          display: inline-block;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1rem;
        }
        
        .result-advice {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto 1.5rem auto;
        }
        
        .btn-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .mt-4 {
          margin-top: 1.5rem;
        }
        
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        
        .mb-3 {
          margin-bottom: 0.75rem;
        }
        
        .mb-4 {
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
