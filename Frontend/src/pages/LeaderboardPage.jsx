import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function LeaderboardPage() {
  const [board, setBoard]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();
  const { user }              = useAuth();

  useEffect(() => {
    getLeaderboard().then(data => {
      setBoard(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{
      minHeight: '90vh',
      background: 'var(--bg)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeUp 0.5s ease' }}>
          <div style={{ fontSize: '56px', animation: 'float 3s ease infinite' }}>🏆</div>
          <h1 style={{
            fontSize: '36px', fontWeight: '900',
            background: 'linear-gradient(135deg, #FFD700, #ff6b35, #FFD700)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 2s linear infinite',
            margin: '8px 0 4px 0',
          }}>
            Forest Champions
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
            The greatest guides who helped Benny find his way home 
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(user ? '/play' : '/')}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← Back to {user ? 'Game Lobby' : 'Home'}
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '48px' }}>
            Loading champions... 🌲
          </div>
        ) : board.length === 0 ? (
          <div style={{
            textAlign: 'center', color: 'var(--text2)',
            background: 'var(--card)', borderRadius: '20px',
            padding: '48px', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No champions yet!</p>
            <p>Be the first to guide Benny home.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Top 3 podium */}
            {board.length >= 3 && (
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                gap: '12px', marginBottom: '24px',
                animation: 'fadeUp 0.6s ease',
              }}>
                {/* 2nd place */}
                <div style={{
                  background: 'linear-gradient(160deg, #2a2a3e, #3a3a5e)',
                  border: '2px solid #C0C0C0',
                  borderRadius: '20px 20px 0 0',
                  padding: '20px 16px',
                  textAlign: 'center',
                  width: '150px',
                  height: '160px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  boxShadow: '0 4px 20px rgba(192,192,192,0.2)',
                }}>
                  <div style={{ fontSize: '28px' }}>🥈</div>
                  <div style={{ color: '#C0C0C0', fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }}>
                    🐰 {board[1]?.username}
                  </div>
                  <div style={{ color: 'white', fontSize: '20px', fontWeight: '900' }}>
                    {board[1]?.highScore}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>pts</div>
                </div>

                {/* 1st place */}
                <div style={{
                  background: 'linear-gradient(160deg, #3a2a1a, #5a3a0a)',
                  border: '2px solid #FFD700',
                  borderRadius: '20px 20px 0 0',
                  padding: '24px 16px',
                  textAlign: 'center',
                  width: '170px',
                  height: '200px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  boxShadow: '0 8px 30px rgba(255,215,0,0.3)',
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px' }}>
                    👑
                  </div>
                  <div style={{ fontSize: '36px' }}>🥇</div>
                  <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '15px', marginTop: '6px' }}>
                    🐰 {board[0]?.username}
                  </div>
                  <div style={{ color: 'white', fontSize: '26px', fontWeight: '900' }}>
                    {board[0]?.highScore}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>pts</div>
                </div>

                {/* 3rd place */}
                <div style={{
                  background: 'linear-gradient(160deg, #2a1a0a, #4a2a0a)',
                  border: '2px solid #CD7F32',
                  borderRadius: '20px 20px 0 0',
                  padding: '20px 16px',
                  textAlign: 'center',
                  width: '150px',
                  height: '130px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  boxShadow: '0 4px 20px rgba(205,127,50,0.2)',
                }}>
                  <div style={{ fontSize: '28px' }}>🥉</div>
                  <div style={{ color: '#CD7F32', fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }}>
                    🐰 {board[2]?.username}
                  </div>
                  <div style={{ color: 'white', fontSize: '20px', fontWeight: '900' }}>
                    {board[2]?.highScore}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>pts</div>
                </div>
              </div>
            )}

            {/* Rest of leaderboard */}
            {board.map((player, i) => (
              <div
                key={player._id}
                style={{
                  background: player.username === user?.username
                    ? 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(247,201,72,0.2))'
                    : 'var(--card)',
                  border: player.username === user?.username
                    ? '2px solid #ff6b35'
                    : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  animation: `fadeUp ${0.1 * i + 0.3}s ease`,
                  boxShadow: i < 3 ? `0 4px 16px ${RANK_COLORS[i]}30` : 'none',
                }}
              >
                {/* Rank */}
                <div style={{
                  fontSize: i < 3 ? '28px' : '18px',
                  fontWeight: 'bold',
                  color: i < 3 ? RANK_COLORS[i] : 'var(--text2)',
                  minWidth: '36px',
                  textAlign: 'center',
                }}>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </div>

                {/* Avatar + name */}
                <div style={{
                  width: '42px', height: '42px',
                  background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  🐰
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: 'var(--text)',
                    fontSize: '16px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    {player.username}
                    {player.username === user?.username && (
                      <span style={{
                        background: '#ff6b35', color: 'white',
                        borderRadius: '8px', padding: '2px 8px', fontSize: '11px',
                      }}>YOU</span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '2px' }}>
                    {player.totalGames} games played
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: i < 3 ? RANK_COLORS[i] : 'var(--text)',
                    fontWeight: '900',
                    fontSize: '22px',
                  }}>
                    {player.highScore}
                  </div>
                  <div style={{ color: 'var(--text2)', fontSize: '11px' }}>best score</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom back button */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(user ? '/play' : '/')}
            style={{
              background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
              color: 'white', border: 'none', borderRadius: '16px',
              padding: '14px 40px', fontSize: '16px', fontWeight: 'bold',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
            }}
          >
            {user ? '🎮 Back to Game Lobby' : '🏠 Back to Home'}
          </button>
        </div>

      </div>
    </div>
  );
}