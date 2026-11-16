import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../services/api';
import Logo from '../components/Logo';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [rank, setRank]   = useState(null);
  const [myStats, setMyStats] = useState({ highScore: 0, totalGames: 0 });

  useEffect(() => {
  getLeaderboard().then(data => {
    setBoard(data);
    const idx = data.findIndex(p => p.username === user?.username);
    setRank(idx >= 0 ? idx + 1 : null);
    // pull real stats from leaderboard data
    if (idx >= 0) {
      const me = data[idx];
      setMyStats({ highScore: me.highScore, totalGames: me.totalGames });
    }
  });
}, []);

const stats = [
  { label: 'Best Score',   value: myStats.highScore,      emoji: '🏆', color: '#f7c948' },
  { label: 'Games Played', value: myStats.totalGames,     emoji: '🎮', color: '#00bcd4' },
  { label: 'Forest Rank',  value: rank ? `#${rank}` : '—', emoji: '🌲', color: '#4caf50' },
];

  const SCENES_PREVIEW = [
    '🌸','🍄','🌊','🌙','🌿','🌺','🦋','🏔️','🌈','🏡'
  ];

  return (
    <div style={{ minHeight: '90vh', background: 'var(--bg)', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer  { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,0.4)} 70%{box-shadow:0 0 0 10px rgba(255,107,53,0)} }
      `}</style>

      <div style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Hero welcome ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(247,201,72,0.1))',
          border: '1px solid rgba(255,107,53,0.25)',
          borderRadius: '24px', padding: '28px 24px',
          display: 'flex', alignItems: 'center', gap: '20px',
          animation: 'fadeUp 0.4s ease',
        }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
            borderRadius: '20px', fontSize: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
            animation: 'float 3s ease infinite',
            flexShrink: 0,
          }}>🐰</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 4px 0' }}>
              Welcome back, forest guide!
            </p>
            <h1 style={{
              fontSize: '26px', fontWeight: '900', margin: '0 0 4px 0',
              background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2s linear infinite',
            }}>
              {user?.username}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>
              Benny is waiting in the Whispering Woods!
            </p>
          </div>
          <button onClick={() => navigate('/play')} style={{
            background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
            color: 'white', border: 'none', borderRadius: '16px',
            padding: '14px 24px', fontSize: '15px', fontWeight: 'bold',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 4px 20px rgba(255,107,53,0.5)',
            animation: 'pulse 2s ease infinite',
          }}>
            Play Now 🐰
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', animation: 'fadeUp 0.5s ease' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '18px', padding: '18px 12px', textAlign: 'center',
              boxShadow: `0 4px 20px ${s.color}18`,
            }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.emoji}</div>
              <div style={{ color: s.color, fontSize: '24px', fontWeight: '900', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Journey map ── */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '20px',
          animation: 'fadeUp 0.55s ease',
        }}>
          <h3 style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px 0' }}>
            Benny's Journey - 10 Scenes
          </h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SCENES_PREVIEW.map((e, i) => (
              <div key={i} style={{
                width: '52px', height: '52px',
                background: 'linear-gradient(135deg,rgba(255,107,53,0.12),rgba(247,201,72,0.08))',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '1px',
              }}>
                <span style={{ fontSize: '20px' }}>{e}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>S{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to play ── */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '20px',
          animation: 'fadeUp 0.6s ease',
        }}>
          <h3 style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px 0' }}>
            How to Play
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { emoji: '❤️', title: 'Count Hearts',    desc: 'Each puzzle shows hearts — count and select the right number.' },
              { emoji: '🔥', title: 'Build Combos',    desc: 'Get consecutive correct answers for streak bonus points.' },
              { emoji: '🎰', title: 'Bonus Wheel',     desc: 'Spin a prize wheel every 3 scenes for big bonus points!' },
              { emoji: '🌪️', title: 'Chaos Events',   desc: 'Random events blur, flip or shake the image — stay sharp!' },
              { emoji: '❄️', title: 'Freeze Power-up', desc: 'Stop the timer for 5 seconds when you need more time.' },
              { emoji: '⭐', title: 'Reveal Power-up', desc: 'Reveal the correct answer when you are stuck.' },
            ].map((tip, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '12px',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{tip.emoji}</span>
                <div>
                  <p style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px', margin: '0 0 2px 0' }}>{tip.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0, lineHeight: 1.4 }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top 5 leaderboard preview ── */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '20px',
          animation: 'fadeUp 0.65s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
              Top Forest Champions
            </h3>
            <button onClick={() => navigate('/leaderboard')} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', padding: '4px 10px',
              color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer',
            }}>
              See All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {board.slice(0, 5).map((p, i) => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '12px',
                background: p.username === user?.username
                  ? 'linear-gradient(135deg,rgba(255,107,53,0.15),rgba(247,201,72,0.1))'
                  : 'rgba(255,255,255,0.03)',
                border: p.username === user?.username
                  ? '1px solid rgba(255,107,53,0.3)'
                  : '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: i < 3 ? '20px' : '14px', fontWeight: 'bold', minWidth: '28px', textAlign: 'center', color: ['#f7c948','#aaa','#cd7f32'][i] || 'rgba(255,255,255,0.4)' }}>
                  {['🥇','🥈','🥉'][i] || `#${i+1}`}
                </span>
                <span style={{ fontSize: '18px' }}>🐰</span>
                <span style={{ flex: 1, color: 'var(--text)', fontWeight: p.username === user?.username ? 'bold' : 'normal', fontSize: '14px' }}>
                  {p.username}
                  {p.username === user?.username && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#ff6b35', color: 'white', borderRadius: '6px', padding: '1px 6px' }}>YOU</span>}
                </span>
                <span style={{ color: '#f7c948', fontWeight: 'bold', fontSize: '16px' }}>{p.highScore}</span>
              </div>
            ))}
            {board.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontSize: '13px', padding: '16px' }}>
                No champions yet — be the first! 🌱
              </p>
            )}
          </div>
        </div>

        {/* ── Big play button ── */}
        <button onClick={() => navigate('/play')} style={{
          background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
          color: 'white', border: 'none', borderRadius: '20px',
          padding: '20px', fontSize: '20px', fontWeight: '900',
          cursor: 'pointer', width: '100%',
          boxShadow: '0 8px 32px rgba(255,107,53,0.4)',
          animation: 'fadeUp 0.7s ease',
          letterSpacing: '0.5px',
        }}>
          🌲 Start Benny's Journey 🐰
        </button>

      </div>
    </div>
  );
}