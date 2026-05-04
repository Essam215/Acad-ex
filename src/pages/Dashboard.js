import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM, LEADERBOARD_SEED } from '../data/curriculum';
import { getIcon } from '../utils/iconRegistry';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: color || 'var(--accent)', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const curriculum = CURRICULUM[user?.year];
  const yearColors = { Junior: '#00ff88', Wheeler: '#00aaff', Senior: '#ff6600' };
  const yc = yearColors[user?.year] || '#00ff88';

  const quizHistory = JSON.parse(localStorage.getItem('acadex_quiz_history') || '[]');
  const quizzesTaken = quizHistory.length;
  const avgScore = quizzesTaken > 0
    ? Math.round(quizHistory.reduce((a, b) => a + b.score, 0) / quizzesTaken)
    : 0;

  const rank = [...LEADERBOARD_SEED].sort((a, b) => b.points - a.points)
    .findIndex(u => u.id === user?.id) + 1;

  const totalLessons = curriculum?.subjects.reduce((a, s) => a + s.lessons.length, 0) || 0;
  const totalFlashcards = curriculum?.subjects.reduce((a, s) =>
    a + s.lessons.reduce((b, l) => b + (l.flashcards?.length || 0), 0), 0) || 0;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36, animation: 'fadeIn 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="badge badge-accent" style={{ borderColor: `${yc}55`, color: yc, background: `${yc}12` }}>
                {user?.year?.toUpperCase()} YEAR
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
                {curriculum?.tagline}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: 2, color: 'var(--text-primary)' }}>
              WELCOME BACK, <span style={{ color: yc }}>{user?.name?.split(' ')[0].toUpperCase()}</span>
            </h1>
          </div>
          <div style={{
            padding: '12px 20px', borderRadius: 10,
            background: `${yc}0d`, border: `1px solid ${yc}33`,
            textAlign: 'right',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>TOTAL XP</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: yc, fontWeight: 700 }}>
              {user?.points?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16, marginBottom: 36, animation: 'fadeIn 0.5s ease 0.1s both',
      }}>
        <StatCard label="RANK" value={rank > 0 ? `#${rank}` : '—'} sub="Global leaderboard" color={yc} />
        <StatCard label="QUIZZES TAKEN" value={quizzesTaken} sub="Keep going!" color="#00aaff" />
        <StatCard label="AVG SCORE" value={quizzesTaken > 0 ? `${avgScore}%` : '—'} sub="Quiz accuracy" color="#ffaa00" />
        <StatCard label="LESSONS" value={totalLessons} sub="Available to study" color="#aa00ff" />
        <StatCard label="FLASHCARDS" value={totalFlashcards} sub="Ready to review" color="#ff6600" />
      </div>

      {/* Subjects */}
      <div style={{ animation: 'fadeIn 0.5s ease 0.2s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 3, height: 20, background: `linear-gradient(180deg, ${yc}, transparent)`, borderRadius: 2 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: 'var(--text-secondary)' }}>
            YOUR SUBJECTS
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {curriculum?.subjects.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} yc={yc} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* Badges */}
      {user?.badges?.length > 0 && (
        <div style={{ marginTop: 36, animation: 'fadeIn 0.5s ease 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 3, height: 20, background: 'linear-gradient(180deg, var(--gold), transparent)', borderRadius: 2 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: 'var(--text-secondary)' }}>
              ACHIEVEMENTS
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {user.badges.map(b => (
              <div key={b} style={{
                padding: '8px 16px', borderRadius: 6,
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                color: 'var(--gold)', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              }}>★ {b.toUpperCase()}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectCard({ subject, index, yc, navigate }) {
  const totalQ = subject.lessons.reduce((a, l) => a + (l.quiz?.length || 0), 0);
  const totalF = subject.lessons.reduce((a, l) => a + (l.flashcards?.length || 0), 0);
  const IconComponent = getIcon(subject.icon);

  return (
    <div className="card" onClick={() => navigate(`/subject/${subject.id}`)}
      style={{ padding: 24, cursor: 'pointer', animation: `fadeIn 0.5s ease ${0.1 * index}s both` }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = subject.color + '55'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: `${subject.color}15`, border: `1px solid ${subject.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: subject.color,
        }}><IconComponent style={{ fontSize: 22 }} /></div>
        <span style={{
          fontSize: 10, color: subject.color, letterSpacing: 1,
          background: `${subject.color}12`, border: `1px solid ${subject.color}33`,
          padding: '4px 10px', borderRadius: 100, fontWeight: 700,
        }}>{subject.lessons.length} LESSONS</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: 1, color: 'var(--text-primary)', marginBottom: 6 }}>
        {subject.name}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{subject.description}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ color: subject.color, fontWeight: 700 }}>{totalQ}</span> questions
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ color: subject.color, fontWeight: 700 }}>{totalF}</span> flashcards
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: subject.color, fontSize: 12, fontWeight: 700 }}>
        EXPLORE →
      </div>
    </div>
  );
}
