import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { MdFireplace } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';

const YEAR_COLORS = { Junior: '#00ff88', Wheeler: '#00aaff', Senior: '#ff6600' };
const RANK_COLORS = { 1: 'var(--gold)', 2: 'var(--silver)', 3: 'var(--bronze)' };

export default function Leaderboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [user]); // Re-fetch occasionally

  // Merge current user's live points
  const combined = users.map(u =>
    u.id === user?.id ? { ...u, points: user.points, streak: user.streak || 0 } : u
  );
  if (!combined.find(u => u.id === user?.id) && user) {
    combined.push({ id: user.id, name: user.name, year: user.year, avatar: user.avatar, points: user.points, streak: user.streak || 0 });
  }

  const sorted = [...combined].sort((a, b) => b.points - a.points);
  const filtered = filter === 'All' ? sorted : sorted.filter(u => u.year === filter);
  const FILTERS = ['All', 'Junior', 'Wheeler', 'Senior'];
  const myRank = sorted.findIndex(u => u.id === user?.id) + 1;
  const top = sorted[0];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>LOADING LEADERBOARD...</div>;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'linear-gradient(180deg, var(--gold), transparent)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 4, color: 'var(--text-primary)' }}>
            LEADERBOARD
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 15 }}>
          Compete, earn XP, and rise through the ranks.
        </p>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32, animation: 'fadeIn 0.4s ease 0.1s both' }}>
        {sorted.slice(0, 3).map((u, i) => {
          const rank = i + 1;
          const rc = RANK_COLORS[rank];
          const yc = YEAR_COLORS[u.year] || '#888';
          const heights = [120, 90, 70];
          return (
            <div key={u.id} className="card" style={{
              padding: 20, textAlign: 'center',
              borderColor: rank === 1 ? 'rgba(255,215,0,0.3)' : 'var(--border)',
              background: rank === 1 ? 'rgba(255,215,0,0.04)' : 'var(--bg-card)',
              marginTop: heights[i], transition: 'none',
              position: 'relative',
            }}>
              {rank === 1 && (
                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 28 }}>
                  <FaCrown />
                </div>
              )}
              <div style={{
                width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
                background: `${rc}20`, border: `2px solid ${rc}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: rc,
                overflow: 'hidden'
              }}>
                {u?.avatar?.includes('http') || u?.avatar?.includes('data:image') ? <img src={u.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u?.avatar}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: rc, fontWeight: 900 }}>
                #{rank}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{u.name || 'Anonymous'}</div>
              <div style={{ fontSize: 10, color: yc, letterSpacing: 1, marginBottom: 8 }}>{(u.year || 'Unknown').toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: rc, fontWeight: 700 }}>
                {(u.points || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>XP</div>
            </div>
          );
        })}
      </div>

      {/* Your rank callout */}
      <div style={{
        padding: '14px 20px', borderRadius: 10, marginBottom: 24,
        background: `${YEAR_COLORS[user?.year]}0d`, border: `1px solid ${YEAR_COLORS[user?.year]}33`,
        display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeIn 0.4s ease 0.2s both',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>YOUR POSITION</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Rank <span style={{ color: YEAR_COLORS[user?.year], fontFamily: 'var(--font-display)', fontSize: 20 }}>#{myRank}</span>
            {' '}of {sorted.length} students
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>GAP TO TOP</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: YEAR_COLORS[user?.year] }}>
            {top && top.id !== user?.id ? `+${((top.points || 0) - (user?.points || 0)).toLocaleString()} XP` : '👑 YOU\'RE #1!'}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, animation: 'fadeIn 0.4s ease 0.25s both' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 6, border: `1px solid ${filter === f ? YEAR_COLORS[f] || 'var(--accent)' : 'var(--border)'}`,
            background: filter === f ? `${YEAR_COLORS[f] || 'var(--accent)'}15` : 'transparent',
            color: filter === f ? (YEAR_COLORS[f] || 'var(--accent)') : 'var(--text-muted)',
            fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: 'pointer',
          }}>{f.toUpperCase()}</button>
        ))}
      </div>

      {/* Full list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'fadeIn 0.4s ease 0.3s both' }}>
        {filtered.map((u, i) => {
          const globalRank = sorted.findIndex(s => s.id === u.id) + 1;
          const isMe = u.id === user?.id;
          const yc = YEAR_COLORS[u.year] || '#888';
          const rc = RANK_COLORS[globalRank];

          return (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
              borderRadius: 10, border: `1px solid ${isMe ? yc + '55' : 'var(--border)'}`,
              background: isMe ? `${yc}08` : 'var(--bg-card)',
              animation: `fadeIn 0.4s ease ${0.05 * i}s both`,
              transition: 'border-color 0.2s',
            }}>
              {/* Rank */}
              <div style={{
                width: 36, textAlign: 'center', fontFamily: 'var(--font-display)',
                fontSize: globalRank <= 3 ? 18 : 14, fontWeight: 700,
                color: rc || 'var(--text-muted)',
              }}>
                #{globalRank}
              </div>

              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${yc}20`, border: `2px solid ${yc}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: yc,
                overflow: 'hidden'
              }}>
                {u?.avatar?.includes('http') || u?.avatar?.includes('data:image') ? <img src={u.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u?.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isMe ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {u.name || 'Anonymous'}
                  {isMe && <span style={{ fontSize: 10, color: yc, background: `${yc}15`, border: `1px solid ${yc}33`, padding: '2px 8px', borderRadius: 100, letterSpacing: 1 }}>YOU</span>}
                </div>
                <div style={{ fontSize: 11, color: yc, letterSpacing: 1, opacity: 0.8 }}>{(u.year || 'Unknown').toUpperCase()}</div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right', display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', display: u.streak ? 'block' : 'none' }}>
                  <div style={{ fontSize: 14, color: '#ffaa00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <MdFireplace /> {u.streak}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>STREAK</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: rc || yc }}>{(u.points || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>XP</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
