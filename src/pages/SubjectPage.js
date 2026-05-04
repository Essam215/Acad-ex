import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM } from '../data/curriculum';
import { getIcon } from '../utils/iconRegistry';

function SubjectIconBox({ subject }) {
  const IconComponent = getIcon(subject.icon);
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 16,
      background: `${subject.color}15`, border: `1px solid ${subject.color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, color: subject.color, flexShrink: 0,
    }}>
      <IconComponent style={{ fontSize: 32 }} />
    </div>
  );
}

export default function SubjectPage() {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const curriculum = CURRICULUM[user?.year];
  const subject = curriculum?.subjects.find(s => s.id === subjectId);

  if (!subject) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      Subject not found. <button className="btn btn-ghost" style={{ marginLeft: 12 }} onClick={() => navigate('/dashboard')}>← Back</button>
    </div>
  );

  const totalQ = subject.lessons.reduce((a, l) => a + (l.quiz?.length || 0), 0);
  const totalF = subject.lessons.reduce((a, l) => a + (l.flashcards?.length || 0), 0);

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Back */}
      <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} style={{ marginBottom: 28, fontSize: 12, letterSpacing: 1 }}>
        ← BACK TO DASHBOARD
      </button>

      {/* Header */}
      <div className="card" style={{ padding: 32, marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <div className="corner-tl" style={{ borderColor: subject.color }} />
        <div className="corner-tr" style={{ borderColor: subject.color }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <SubjectIconBox subject={subject} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 2, color: subject.color, marginBottom: 6 }}>
              {subject.name.toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{subject.description}</p>
          </div>
          <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
            {[
              { v: subject.lessons.length, l: 'Lessons' },
              { v: totalQ, l: 'Questions' },
              { v: totalF, l: 'Flashcards' },
            ].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: subject.color }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 3, height: 20, background: `linear-gradient(180deg, ${subject.color}, transparent)`, borderRadius: 2 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 3, color: 'var(--text-secondary)' }}>LESSONS</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {subject.lessons.map((lesson, i) => (
          <LessonCard key={lesson.id} lesson={lesson} index={i} color={subject.color} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

function LessonCard({ lesson, index, color, navigate }) {
  const quizHistory = JSON.parse(localStorage.getItem('acadex_quiz_history') || '[]');
  const taken = quizHistory.find(h => h.lessonId === lesson.id);

  return (
    <div className="card" onClick={() => navigate(`/lesson/${lesson.id}`)}
      style={{ padding: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, animation: `fadeIn 0.4s ease ${0.08 * index}s both` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.transform = 'translateX(4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      {/* Number */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}12`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{lesson.title}</h3>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{lesson.flashcards?.length || 0} flashcards</span>
          <span>{lesson.quiz?.length || 0} quiz questions</span>
        </div>
      </div>

      {/* Status */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {taken ? (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>BEST SCORE</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
              color: taken.score >= 80 ? '#00ff88' : taken.score >= 60 ? '#ffaa00' : '#ff4444',
            }}>{taken.score}%</div>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>NOT STARTED</span>
        )}
      </div>

      <div style={{ color, fontSize: 18, flexShrink: 0 }}>→</div>
    </div>
  );
}
