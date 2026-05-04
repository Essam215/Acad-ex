import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM } from '../data/curriculum';
import { getIcon } from '../utils/iconRegistry';

function findLesson(curriculum) {
  for (const subject of curriculum?.subjects || []) {
    for (const lesson of subject.lessons) {
      if (lesson) return { subject, lesson };
    }
  }
  return null;
}

function findLessonById(curriculum, id) {
  for (const subject of curriculum?.subjects || []) {
    for (const lesson of subject.lessons) {
      if (lesson.id === id) return { subject, lesson };
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────── SUMMARY TAB
function SummaryTab({ lesson, color }) {
  return (
    <div className="card" style={{ padding: 32, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 3, height: 20, background: `linear-gradient(180deg, ${color}, transparent)`, borderRadius: 2 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: 'var(--text-secondary)' }}>LESSON SUMMARY</h2>
      </div>
      <div style={{
        whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 15,
        color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
      }}>
        {lesson.summary}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── FLASHCARDS TAB
function FlashcardsTab({ lesson, color }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());
  const cards = lesson.flashcards || [];

  const next = () => { setFlipped(false); setTimeout(() => setCurrent(c => Math.min(cards.length - 1, c + 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrent(c => Math.max(0, c - 1)), 150); };
  const mark = (type) => {
    if (type === 'know') setKnown(s => new Set([...s, current]));
    else setUnknown(s => new Set([...s, current]));
    if (current < cards.length - 1) next();
  };
  const reset = () => { setCurrent(0); setFlipped(false); setKnown(new Set()); setUnknown(new Set()); };

  const card = cards[current];
  if (!card) return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No flashcards available.</div>;

  const progress = ((known.size + unknown.size) / cards.length) * 100;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1 }} className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 80 }}>
          {current + 1} / {cards.length}
        </span>
        <span style={{ fontSize: 12, color: '#00ff88' }}>✓ {known.size}</span>
        <span style={{ fontSize: 12, color: '#ff4444' }}>✗ {unknown.size}</span>
      </div>

      {/* Card */}
      <div onClick={() => setFlipped(f => !f)} style={{
        minHeight: 280, borderRadius: 16, border: `1px solid ${color}44`,
        background: flipped ? `${color}0d` : 'var(--bg-card)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 40, cursor: 'pointer', transition: 'all 0.3s ease',
        position: 'relative', marginBottom: 24,
        boxShadow: flipped ? `0 0 30px ${color}22` : 'none',
      }}>
        <div className="corner-tl" style={{ borderColor: color + '66' }} />
        <div className="corner-tr" style={{ borderColor: color + '66' }} />
        <div className="corner-bl" style={{ borderColor: color + '66' }} />
        <div className="corner-br" style={{ borderColor: color + '66' }} />

        <div style={{ fontSize: 11, color: color, letterSpacing: 2, marginBottom: 20, opacity: 0.7 }}>
          {flipped ? 'ANSWER' : 'QUESTION — CLICK TO REVEAL'}
        </div>
        <div style={{
          fontSize: 18, lineHeight: 1.7, textAlign: 'center',
          color: flipped ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: flipped ? 400 : 500,
          transition: 'all 0.2s ease',
        }}>
          {flipped ? card.back : card.front}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={prev} disabled={current === 0} style={{ fontSize: 12, letterSpacing: 1 }}>← PREV</button>
        {flipped && (
          <>
            <button onClick={() => mark('unknown')} style={{
              padding: '10px 24px', borderRadius: 8, border: '1px solid rgba(255,68,68,0.4)',
              background: 'rgba(255,68,68,0.1)', color: '#ff4444', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1,
            }}>✗ STILL LEARNING</button>
            <button onClick={() => mark('know')} style={{
              padding: '10px 24px', borderRadius: 8, border: '1px solid rgba(0,255,136,0.4)',
              background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1,
            }}>✓ GOT IT</button>
          </>
        )}
        <button className="btn btn-ghost" onClick={next} disabled={current === cards.length - 1} style={{ fontSize: 12, letterSpacing: 1 }}>NEXT →</button>
      </div>

      {progress === 100 && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ color: '#00ff88', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🎉 Session complete!</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
            {known.size} known · {unknown.size} to review
          </div>
          <button className="btn btn-outline" onClick={reset} style={{ fontSize: 12, letterSpacing: 1 }}>RESTART</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────── AI QUIZ TAB
function QuizTab({ lesson, color, subject }) {
  const { user, addPoints } = useAuth();
  const [mode, setMode] = useState('menu'); // menu | loading | active | result
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [aiError, setAiError] = useState('');
  const [useStatic, setUseStatic] = useState(false);

  const generateWithAI = useCallback(async () => {
    setMode('loading'); setAiError('');
    try {
      const prompt = `You are a quiz generator. Based on this lesson about "${lesson.title}" from ${subject.name}, generate 5 multiple choice questions.

Lesson content: ${lesson.summary?.substring(0, 1500)}

Return ONLY valid JSON in this exact format, no extra text:
{
  "questions": [
    {
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Brief explanation why this is correct."
    }
  ]
}

Rules: answer is the index (0-3) of the correct option. Make questions educational and varied in difficulty.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data?.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed.questions);
      setAnswers({}); setSubmitted(false);
      setMode('active');
    } catch (err) {
      setAiError('AI generation failed. Using static questions.');
      setQuestions(lesson.quiz || []);
      setAnswers({}); setSubmitted(false);
      setMode('active');
      setUseStatic(true);
    }
  }, [lesson, subject]);

  const useStaticQuiz = () => {
    setQuestions(lesson.quiz || []);
    setAnswers({}); setSubmitted(false);
    setMode('active'); setUseStatic(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / questions.length) * 100);
    const pts = correct * 10;
    addPoints(pts);

    const history = JSON.parse(localStorage.getItem('acadex_quiz_history') || '[]');
    const existing = history.findIndex(h => h.lessonId === lesson.id);
    const entry = { lessonId: lesson.id, lessonTitle: lesson.title, score, correct, total: questions.length, date: new Date().toISOString(), pts };
    if (existing >= 0) { if (score > history[existing].score) history[existing] = entry; }
    else history.push(entry);
    localStorage.setItem('acadex_quiz_history', JSON.stringify(history));
    setMode('result');
  };

  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  if (mode === 'menu') return (
    <div className="card" style={{ padding: 40, textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 2, color: 'var(--text-primary)', marginBottom: 8 }}>KNOWLEDGE QUIZ</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Test your understanding of {lesson.title}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={generateWithAI} style={{ fontSize: 12, letterSpacing: 2 }}>
          GENERATE WITH AI
        </button>
        <button className="btn btn-outline" onClick={useStaticQuiz} style={{ fontSize: 12, letterSpacing: 2 }}>
          USE PRESET QUIZ
        </button>
      </div>
      <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>AI quiz = unique questions every time · Earn 10 XP per correct answer</p>
    </div>
  );

  if (mode === 'loading') return (
    <div className="card" style={{ padding: 60, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: color }}>GENERATING QUIZ...</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>AI is crafting unique questions for you</div>
    </div>
  );

  if (mode === 'result') return (
    <div className="card" style={{ padding: 40, textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
      <div className="corner-tl" style={{ borderColor: color }} />
      <div className="corner-tr" style={{ borderColor: color }} />
      <div style={{
        width: 100, height: 100, borderRadius: '50%', margin: '0 auto 24px',
        background: `${score >= 80 ? '#00ff88' : score >= 60 ? '#ffaa00' : '#ff4444'}15`,
        border: `3px solid ${score >= 80 ? '#00ff88' : score >= 60 ? '#ffaa00' : '#ff4444'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900,
        color: score >= 80 ? '#00ff88' : score >= 60 ? '#ffaa00' : '#ff4444',
      }}>{score}%</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 2, marginBottom: 8, color: 'var(--text-primary)' }}>
        {score >= 80 ? 'EXCELLENT!' : score >= 60 ? 'GOOD JOB!' : 'KEEP STUDYING!'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{correct} / {questions.length} correct answers</p>
      <p style={{ color: '#00ff88', fontSize: 13, fontWeight: 700, marginBottom: 32 }}>+{correct * 10} XP EARNED</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => { setMode('menu'); setUseStatic(false); }} style={{ fontSize: 12, letterSpacing: 1 }}>TRY AGAIN</button>
      </div>
    </div>
  );

  // Active quiz
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {aiError && (
        <div style={{ padding: '10px 16px', background: 'rgba(255,170,0,0.1)', border: '1px solid rgba(255,170,0,0.3)', borderRadius: 8, color: '#ffaa00', fontSize: 12, marginBottom: 20 }}>
          ⚠ {aiError}
        </div>
      )}
      {!useStatic && (
        <div style={{ marginBottom: 16 }}>
          <span className="badge badge-accent" style={{ borderColor: `${color}44`, color, background: `${color}12` }}>
            ⬡ AI GENERATED
          </span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, qi) => (
          <div key={qi} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: `${color}15`, border: `1px solid ${color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontFamily: 'var(--font-display)', color,
              }}>{qi + 1}</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>{q.q}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = oi === q.answer;
                let bg = 'transparent', borderC = 'var(--border)', textC = 'var(--text-secondary)';
                if (submitted) {
                  if (isCorrect) { bg = 'rgba(0,255,136,0.1)'; borderC = 'rgba(0,255,136,0.4)'; textC = '#00ff88'; }
                  else if (isSelected && !isCorrect) { bg = 'rgba(255,68,68,0.1)'; borderC = 'rgba(255,68,68,0.4)'; textC = '#ff4444'; }
                } else if (isSelected) { bg = `${color}15`; borderC = `${color}55`; textC = color; }

                return (
                  <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 8, border: `1px solid ${borderC}`,
                    background: bg, cursor: submitted ? 'default' : 'pointer',
                    textAlign: 'left', transition: 'all 0.15s', color: textC, fontSize: 14,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${borderC}`, background: isSelected && !submitted ? color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: isSelected && !submitted ? '#000' : textC,
                    }}>{isSelected && !submitted ? '●' : ['A','B','C','D'][oi]}</div>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,170,255,0.08)', border: '1px solid rgba(0,170,255,0.2)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#00aaff', fontWeight: 700, letterSpacing: 1 }}>EXPLANATION: </span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.explanation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}
            style={{ fontSize: 12, letterSpacing: 2, opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? 'pointer' : 'not-allowed' }}>
            SUBMIT ANSWERS →
          </button>
          {!allAnswered && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Answer all questions to submit</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────── MAIN LESSON PAGE
export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const curriculum = CURRICULUM[user?.year];
  const found = findLessonById(curriculum, lessonId);
  const [tab, setTab] = useState('summary');

  if (!found) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      Lesson not found. <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
    </div>
  );

  const { subject, lesson } = found;
  const TABS = [
    { id: 'summary', label: 'SUMMARY', icon: 'MdLibraryBooks' },
    { id: 'flashcards', label: 'FLASHCARDS', icon: 'MdViewWeekend' },
    { id: 'quiz', label: 'QUIZ', icon: 'BiLightningCharge' },
  ];
  const IconComponent = getIcon(subject.icon);

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <button className="btn btn-ghost" onClick={() => navigate(`/subject/${subject.id}`)} style={{ marginBottom: 24, fontSize: 12, letterSpacing: 1 }}>
        ← {subject.name.toUpperCase()}
      </button>

      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <IconComponent style={{ fontSize: 20, color: subject.color }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2 }}>{subject.name.toUpperCase()}</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 2, color: subject.color }}>
          {lesson.title.toUpperCase()}
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, padding: 4, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)', animation: 'fadeIn 0.4s ease 0.1s both' }}>
        {TABS.map(t => {
          const TabIcon = getIcon(t.icon);
          return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
            background: tab === t.id ? `${subject.color}15` : 'transparent',
            color: tab === t.id ? subject.color : 'var(--text-muted)',
            borderBottom: tab === t.id ? `2px solid ${subject.color}` : '2px solid transparent',
            fontSize: 12, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.15s',
          }}>
            <TabIcon style={{ fontSize: 14 }} /> {t.label}
          </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {tab === 'summary' && <SummaryTab lesson={lesson} color={subject.color} />}
        {tab === 'flashcards' && <FlashcardsTab lesson={lesson} color={subject.color} />}
        {tab === 'quiz' && <QuizTab lesson={lesson} color={subject.color} subject={subject} />}
      </div>
    </div>
  );
}
