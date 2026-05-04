import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIcon } from '../utils/iconRegistry';
import { MdLogout, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const NAV = [
  { to: '/dashboard', icon: 'MdGridView', label: 'Dashboard' },
  { to: '/assistant', icon: 'MdAutoAwesome', label: 'AI Study' },
  { to: '/leaderboard', icon: 'MdLeaderboard', label: 'Leaderboard' },
  { to: '/profile', icon: 'MdPerson', label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const yearColors = { Junior: '#00ff88', Wheeler: '#00aaff', Senior: '#ff6600' };
  const yc = yearColors[user?.year] || '#00ff88';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240,
        background: 'linear-gradient(180deg, #0a1410 0%, #080c0a 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: `linear-gradient(135deg, ${yc}, ${yc}88)`,
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#000',
                flexShrink: 0,
              }}>A</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: yc, letterSpacing: 2 }}>ACADEX</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>LEARNING SYSTEM</div>
              </div>
            </div>
          ) : (
            <div style={{
              width: 36, height: 36, background: `linear-gradient(135deg, ${yc}, ${yc}88)`,
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#000',
            }}>A</div>
          )}
        </div>

        {/* User info */}
        {!collapsed && (
          <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${yc}33, ${yc}66)`,
                border: `2px solid ${yc}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: yc,
                overflow: 'hidden'
              }}>
                {user?.avatar?.includes('http') || user?.avatar?.includes('data:image') ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.avatar}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: yc, letterSpacing: 1 }}>{user?.year?.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>XP</div>
              <div style={{ flex: 1 }} className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (user?.points % 500) / 5)}%` }} />
              </div>
              <div style={{ fontSize: 11, color: yc, fontFamily: 'var(--font-mono)', minWidth: 36 }}>{user?.points}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 10px' }}>
          {NAV.map(({ to, icon, label }) => {
            const IconComponent = getIcon(icon);
            return (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '12px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 8, marginBottom: 4,
              color: isActive ? yc : 'var(--text-secondary)',
              background: isActive ? `${yc}12` : 'transparent',
              borderLeft: isActive ? `2px solid ${yc}` : '2px solid transparent',
              fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
              textDecoration: 'none', transition: 'all 0.15s ease',
            })}>
              <IconComponent style={{ fontSize: 18 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '0 10px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button onClick={() => setCollapsed(c => !c)} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, padding: collapsed ? '10px 0' : '10px 14px',
            background: 'transparent', border: 'none',
            color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer',
            borderRadius: 8, transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
            {!collapsed && <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>COLLAPSE</span>}
          </button>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, padding: collapsed ? '10px 0' : '10px 14px',
            background: 'transparent', border: 'none',
            color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer',
            borderRadius: 8, transition: 'all 0.15s', marginTop: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <MdLogout size={18} />
            {!collapsed && <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>LOGOUT</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minHeight: '100vh', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
