import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIcon } from '../utils/iconRegistry';

const YEAR_COLORS = { Junior: '#00ff88', Wheeler: '#00aaff', Senior: '#ff6600' };

export default function Profile() {
  const { user, updateUser } = useAuth();
  const yc = YEAR_COLORS[user?.year] || '#00ff88';

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    username: user?.username || '', 
    year: user?.year || 'Junior', 
    avatar: user?.avatar || '', 
    bio: user?.bio || '' 
  });
  const [saved, setSaved] = useState(false);

  const quizHistory = JSON.parse(localStorage.getItem('acadex_quiz_history') || '[]');
  const quizzesTaken = quizHistory.length;
  const avgScore = quizzesTaken > 0 ? Math.round(quizHistory.reduce((a, b) => a + b.score, 0) / quizzesTaken) : 0;
  const bestScore = quizzesTaken > 0 ? Math.max(...quizHistory.map(h => h.score)) : 0;
  const totalXPFromQuiz = quizHistory.reduce((a, b) => a + (b.pts || 0), 0);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // compress to tiny base64 string
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setForm(f => ({ ...f, avatar: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser({ 
      name: form.name, 
      username: form.username, 
      avatar: form.avatar, 
      bio: form.bio 
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const BADGE_ICONS = { 'First Quiz': 'BsLightning', 'Streak 7': 'MdFireplace', 'Perfectionist': 'MdDiamond', 'Legend': 'MdCrown', 'Top Scorer': 'MdEmojiEvents' };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: `linear-gradient(180deg, ${yc}, transparent)`, borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 4, color: 'var(--text-primary)' }}>
            MY PROFILE
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, alignItems: 'start' }}>
        {/* Left: Avatar + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar card */}
          <div className="card" style={{ padding: 28, textAlign: 'center', animation: 'fadeIn 0.4s ease 0.1s both' }}>
            <div className="corner-tl" style={{ borderColor: yc }} />
            <div className="corner-tr" style={{ borderColor: yc }} />
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(135deg, ${yc}33, ${yc}15)`,
              border: `3px solid ${yc}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: yc,
              boxShadow: `0 0 30px ${yc}22`,
              animation: 'float 3s ease-in-out infinite',
              overflow: 'hidden'
            }}>
              {user?.avatar?.includes('http') || user?.avatar?.includes('data:image') ? (
                 <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                 user?.avatar
              )}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {user?.name}
            </h2>
            <div style={{ fontSize: 11, color: yc, letterSpacing: 2, marginBottom: 8 }}>{user?.year?.toUpperCase()} STUDENT</div>
            {user?.bio && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 8 }}>{user.bio}</p>
            )}
            <div className="divider" />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>TOTAL XP</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: yc }}>
              {user?.points?.toLocaleString()}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>LEVEL PROGRESS</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (user?.points % 500) / 5)}%`, background: `linear-gradient(90deg, ${yc}88, ${yc})` }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                {user?.points % 500} / 500 XP to next level
              </div>
            </div>
          </div>

          {/* Stats mini */}
          <div className="card" style={{ padding: 20, animation: 'fadeIn 0.4s ease 0.2s both' }}>
            {[
              { l: 'QUIZZES TAKEN', v: quizzesTaken, c: '#00aaff' },
              { l: 'AVG SCORE', v: quizzesTaken > 0 ? `${avgScore}%` : '—', c: '#ffaa00' },
              { l: 'BEST SCORE', v: quizzesTaken > 0 ? `${bestScore}%` : '—', c: '#00ff88' },
              { l: 'XP FROM QUIZZES', v: totalXPFromQuiz.toLocaleString(), c: yc },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>{l}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>JOINED</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user?.joinDate || 'Sept 2024'}</span>
            </div>
          </div>
        </div>

        {/* Right: Edit form + badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Edit profile */}
          <div className="card" style={{ padding: 28, animation: 'fadeIn 0.4s ease 0.15s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 18, background: `linear-gradient(180deg, ${yc}, transparent)`, borderRadius: 2 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 3, color: 'var(--text-secondary)' }}>ACCOUNT INFO</h3>
              </div>
              {!editing ? (
                <button className="btn btn-outline" onClick={() => { 
                  setEditing(true); 
                  setForm({ 
                    name: user?.name || '', 
                    username: user?.username || '', 
                    year: user?.year || 'Junior', 
                    avatar: user?.avatar || '', 
                    bio: user?.bio || '' 
                  }); 
                }}
                  style={{ fontSize: 11, letterSpacing: 1, padding: '6px 14px' }}>EDIT</button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setEditing(false)} style={{ fontSize: 11, letterSpacing: 1, padding: '6px 14px' }}>CANCEL</button>
                  <button className="btn btn-primary" onClick={handleSave} style={{ fontSize: 11, letterSpacing: 1, padding: '6px 14px' }}>SAVE</button>
                </div>
              )}
            </div>

            {saved && (
              <div style={{ padding: '10px 14px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 8, color: '#00ff88', fontSize: 13, marginBottom: 20 }}>
                ✓ Profile updated successfully!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>USERNAME</label>
                {editing ? (
                  <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                ) : (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-primary)' }}>{user?.username || '—'}</div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>SCHOOL YEAR</label>
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 14, color: yc }}>{user?.year?.toUpperCase() || '—'}</div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>PROFILE PICTURE</label>
                {editing ? (
                  <div>
                    <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <label htmlFor="avatar-upload" className="btn btn-outline" style={{ display: 'inline-block', padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>
                      Choose Image...
                    </label>
                    {form.avatar && form.avatar !== user?.avatar && <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--gold)' }}>✓ Image ready</span>}
                  </div>
                ) : (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
                    Click EDIT to change your photo
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>DISPLAY NAME</label>
                {editing ? (
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                ) : (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-primary)' }}>{user?.name || '—'}</div>
                )}
              </div>

              {/* Email is read-only because it manages authentication */}
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>EMAIL</label>
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-muted)' }}>{user?.email || '—'}</div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>BIO</label>
                {editing ? (
                  <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={form.bio}
                    placeholder="Tell us about yourself..."
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                ) : (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 14, color: user?.bio ? 'var(--text-primary)' : 'var(--text-muted)', minHeight: 60 }}>
                    {user?.bio || 'No bio set.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="card" style={{ padding: 28, animation: 'fadeIn 0.4s ease 0.25s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, var(--gold), transparent)', borderRadius: 2 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 3, color: 'var(--text-secondary)' }}>ACHIEVEMENTS</h3>
            </div>
            {user?.badges?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {user.badges.map(b => {
                  const BadgeIcon = getIcon(BADGE_ICONS[b]);
                  return (
                  <div key={b} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                    borderRadius: 8, background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
                  }}>
                    <BadgeIcon style={{ fontSize: 18, color: 'var(--gold)' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: 0.5 }}>{b}</div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                No achievements yet. Take quizzes to earn badges!
              </div>
            )}
          </div>

          {/* Recent quiz history */}
          {quizHistory.length > 0 && (
            <div className="card" style={{ padding: 28, animation: 'fadeIn 0.4s ease 0.3s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 3, height: 18, background: `linear-gradient(180deg, #00aaff, transparent)`, borderRadius: 2 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 3, color: 'var(--text-secondary)' }}>RECENT QUIZZES</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...quizHistory].reverse().slice(0, 5).map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{h.lessonTitle}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.correct}/{h.total} correct · +{h.pts} XP</div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
                      color: h.score >= 80 ? '#00ff88' : h.score >= 60 ? '#ffaa00' : '#ff4444',
                    }}>{h.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
