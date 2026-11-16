import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      background: 'rgba(10,10,20,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '10px 20px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div onClick={() => navigate(user ? '/dashboard' : '/')} style={{ cursor: 'pointer' }}>
        <Logo size='sm' />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggleTheme} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px', padding: '6px 12px', color: 'var(--text)',
          fontSize: '13px', cursor: 'pointer',
        }}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {user && <>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '6px 12px', color: 'var(--text)',
            fontSize: '13px', cursor: 'pointer',
          }}>
            🐰 {user.username}'s dashboard
          </button>
          <button onClick={() => navigate('/leaderboard')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px', padding: '6px 12px', color: 'var(--text)',
            fontSize: '13px', cursor: 'pointer',
          }}>
            🏆 Leader board
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} style={{
            background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
            border: 'none', borderRadius: '20px', padding: '6px 14px',
            color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
          }}>
            Logout
          </button>
        </>}
      </div>
    </nav>
  );
}