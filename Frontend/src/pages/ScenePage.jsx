import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { startGame, fetchPuzzle, submitAnswer, usePowerUp } from '../services/api';
import { playCorrect, playWrong, playPowerUp, playWin } from '../utils/sounds';
import LivesBar from '../components/LivesBar';
import ScoreBoard from '../components/ScoreBoard';

const SCENES = [
  { name: '🌸 Cherry Blossom Path', story: 'Benny woke up here confused. The petals hold clues.',    bg: 'linear-gradient(160deg,#ffb7c5,#fff0f5,#ffd6e0)', ground: '#f8b4c0', trees: ['🌸','🌸','🌸'], extras: ['🦋','🌺'] },
  { name: '🍄 Mushroom Meadow',     story: 'Magic mushrooms glow - they can freeze time itself.',     bg: 'linear-gradient(160deg,#2d5a1b,#4a8c2a,#6ab04c)', ground: '#3d7a25', trees: ['🍄','🍄','🌿'], extras: ['✨','🍄'] },
  { name: '🌊 Lily Pad River',      story: 'Benny must hop across without falling.',                  bg: 'linear-gradient(160deg,#0288d1,#29b6f6,#b3e5fc)', ground: '#0277bd', trees: ['🌿','🌾','🌿'], extras: ['🐸','🪷'] },
  { name: '🌙 Moonlit Cave',        story: 'A wise owl hints at the way if you count right.',         bg: 'linear-gradient(160deg,#0d0d2b,#1a1a4e,#2d2d7a)', ground: '#1a1a3e', trees: ['🌑','⭐','🌙'], extras: ['🦉','💫'] },
  { name: '🌿 Fern Gully',          story: "The ferns whisper secrets. Benny's nose twitches!",      bg: 'linear-gradient(160deg,#1b5e20,#2e7d32,#43a047)', ground: '#2e7d32', trees: ['🌿','🌿','🌿'], extras: ['🥕','🌱'] },
  { name: '🌺 Flower Hill',         story: 'From the top Benny can almost see home.',                 bg: 'linear-gradient(160deg,#880e4f,#c2185b,#f48fb1)', ground: '#ad1457', trees: ['🌺','🌸','🌼'], extras: ['🦋','🌻'] },
  { name: '🦋 Butterfly Glen',      story: 'The golden butterfly that led Benny astray.',             bg: 'linear-gradient(160deg,#4a148c,#7b1fa2,#ce93d8)', ground: '#6a1b9a', trees: ['🌸','🌿','🌸'], extras: ['🦋','🦋'] },
  { name: '🏔️ Crystal Summit',     story: 'The highest point. Home is visible from here!',          bg: 'linear-gradient(160deg,#263238,#455a64,#b0bec5)', ground: '#37474f', trees: ['🏔️','❄️','🏔️'], extras: ['⛄','✨'] },
  { name: '🌈 Rainbow Bridge',      story: 'One last magical crossing. Be honest!',                  bg: 'linear-gradient(160deg,#ff7043,#ffb74d,#fff176,#81c784,#64b5f6)', ground: '#ff8a65', trees: ['🌈','⭐','🌈'], extras: ['✨','🌟'] },
  { name: '🏡 Garden Gate',         story: 'Home! Mama Bunny is waiting with warm carrot stew!',     bg: 'linear-gradient(160deg,#f57f17,#f9a825,#fff176)', ground: '#f9a825', trees: ['🌻','🌳','🌻'], extras: ['🏡','🥕'] },
];

const DIFFICULTY = {
  easy:   { timer: 45, label: '🌸 Easy',   color: '#4caf50' },
  medium: { timer: 30, label: '🌿 Medium', color: '#ff9800' },
  hard:   { timer: 20, label: '🏔️ Hard',  color: '#f44336' },
};

const CHAOS_EVENTS = [
  { name: '🌫️ Foggy Forest!',  desc: 'Mist rolled in — image is blurry!',       style: { filter: 'blur(5px)' },             color: '#607d8b' },
  { name: '🙃 Upside Down!',   desc: 'Benny tumbled — image is flipped!',        style: { transform: 'scaleY(-1)' },         color: '#9c27b0' },
  { name: '🪞 Mirror World!',  desc: 'Magic mirror — image is mirrored!',        style: { transform: 'scaleX(-1)' },         color: '#00bcd4' },
  { name: '🔬 Shrink Ray!',    desc: 'A wizard shrunk the image!',               style: { transform: 'scale(0.5)' },         color: '#4caf50' },
  { name: '🌑 Eclipse!',       desc: 'The moon covered the sun — all grey!',     style: { filter: 'grayscale(100%)' },       color: '#455a64' },
  { name: '🌪️ Earthquake!',   desc: 'The ground shakes under Benny\'s paws!',   style: { animation: 'chaosShake 0.15s ease infinite' }, color: '#ff5722' },
];

// ── Particles ──
function Particles({ trigger, type }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!trigger) return;
    const colors = type === 'correct'
      ? ['#f7c948','#ff6b35','#4caf50','#00bcd4','#ff80ab','#fff']
      : ['#f44336','#ff5722','#b71c1c'];
    const list = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 280,
      vy: -(Math.random() * 360 + 160),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 9 + 5,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
    setParticles(list);
    setTimeout(() => setParticles([]), 1100);
  }, [trigger]);
  if (!particles.length) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998, overflow: 'hidden' }}>
      <style>{`@keyframes pFly{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(var(--vx),var(--vy)) rotate(720deg);opacity:0}}`}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: '50%', left: `${p.x}%`,
          width: p.shape === 'circle' ? `${p.size}px` : `${p.size * 0.6}px`,
          height: p.shape === 'circle' ? `${p.size}px` : `${p.size * 1.3}px`,
          borderRadius: p.shape === 'circle' ? '50%' : '2px',
          background: p.color, '--vx': `${p.vx}px`, '--vy': `${p.vy}px`,
          animation: 'pFly 1s cubic-bezier(0.22,1,0.36,1) forwards',
          boxShadow: `0 0 4px ${p.color}`,
        }} />
      ))}
    </div>
  );
}

// ── Screen flash ──
function ScreenFlash({ flash }) {
  if (!flash) return null;
  const bg = flash === 'correct' ? 'rgba(76,175,80,0.22)' : flash === 'wrong' ? 'rgba(244,67,54,0.28)' : 'rgba(247,201,72,0.22)';
  return <div style={{ position: 'fixed', inset: 0, background: bg, pointerEvents: 'none', zIndex: 997, animation: 'flashFade 0.5s ease forwards' }} />;
}

// ── Combo fire ──
function ComboFire({ combo }) {
  if (combo < 2) return null;
  const flames = combo >= 8 ? '🔥🔥🔥🔥' : combo >= 5 ? '🔥🔥🔥' : combo >= 3 ? '🔥🔥' : '🔥';
  const color  = combo >= 8 ? '#ff1744' : combo >= 5 ? '#ff6d00' : combo >= 3 ? '#ff9800' : '#ffb300';
  return (
    <div style={{
      position: 'fixed', top: '70px', right: '12px',
      background: `${color}22`, border: `2px solid ${color}`,
      borderRadius: '14px', padding: '8px 12px', textAlign: 'center',
      zIndex: 100, boxShadow: `0 0 16px ${color}55`,
      animation: 'comboPulse 0.6s ease infinite alternate',
    }}>
      <div style={{ fontSize: '18px', lineHeight: 1 }}>{flames}</div>
      <div style={{ color, fontWeight: '900', fontSize: '12px', marginTop: '2px' }}>x{combo} COMBO</div>
    </div>
  );
}

// ── Chaos banner 
function ChaosBanner({ event, onDismiss }) {
  useEffect(() => {
    if (!event) return;
    const t = setTimeout(onDismiss, 2800);
    return () => clearTimeout(t);
  }, [event]);
  if (!event) return null;
  return (
    <div style={{
      position: 'fixed', top: '62px', left: '50%',
      transform: 'translateX(-50%)',
      background: `${event.color}ee`, borderRadius: '16px',
      padding: '12px 22px', zIndex: 500, textAlign: 'center',
      animation: 'slideDown 0.35s ease',
      boxShadow: `0 6px 24px ${event.color}55`, minWidth: '260px',
    }}>
      <p style={{ color: 'white', fontWeight: '900', fontSize: '15px', margin: '0 0 2px 0' }}>{event.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12px', margin: 0 }}>{event.desc}</p>
    </div>
  );
}

// ══════
export default function ScenePage() {
  const { user } = useAuth();

  const [gameState, setGameState]           = useState(null);
  const [imageUrl, setImageUrl]             = useState(null);
  const [imageStyle, setImageStyle]         = useState({});
  const [feedback, setFeedback]             = useState('');
  const [timer, setTimer]                   = useState(30);
  const [frozen, setFrozen]                 = useState(false);
  const [powerUps, setPowerUps]             = useState({ mushroom: 1, star: 1, portal: 1 });
  const [difficulty, setDifficulty]         = useState('medium');
  const [started, setStarted]               = useState(false);
  const [hopping, setHopping]               = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(null);
  const [hints, setHints]                   = useState(3);
  const [hintChoices, setHintChoices]       = useState(null);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType]     = useState('correct');
  const [screenFlash, setScreenFlash]       = useState(null);
  const [chaosEvent, setChaosEvent]         = useState(null);

  const flash = (type) => {
    setScreenFlash(type);
    setTimeout(() => setScreenFlash(null), 500);
  };

  const boom = (type) => {
    setParticleType(type);
    setParticleTrigger(t => t + 1);
  };

  const startNewGame = async (diff) => {
    try {
      const session = await startGame(user.token);
      setGameState(session);
      setDifficulty(diff);
      setStarted(true);
      setHints(3);
      setPowerUps({ mushroom: 1, star: 1, portal: 1 });
      await loadPuzzle(session, diff);
    } catch (e) { console.error('startNewGame error:', e); }
  };

  const loadPuzzle = async (state, diff) => {
    try {
      const data = await fetchPuzzle(user.token);
      setImageUrl(data.imageUrl);
      setImageStyle({});
      setSelectedAnswer(null);
      setHintChoices(null);
      setRevealedAnswer(null);
      setFeedback('');
      const scene = state?.scene ?? gameState?.scene ?? 1;
      const base  = DIFFICULTY[diff ?? difficulty]?.timer ?? 30;
      setTimer(Math.max(10, base - (scene - 1) * 2));

      // 30% chance chaos event after 2s
      if (Math.random() < 0.3) {
        const ev = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
        setTimeout(() => {
          setChaosEvent(ev);
          setImageStyle({ ...ev.style, transition: 'all 0.4s' });
          setTimeout(() => setImageStyle({}), 4500);
        }, 2000);
      }
    } catch (e) { console.error('loadPuzzle error:', e); }
  };

  useEffect(() => {
    if (!gameState || frozen || !started) return;
    if (timer <= 0) { handleSubmit(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, frozen, gameState, started]);

  const handleSubmit = async (timeOut = false) => {
    const ans = timeOut ? -1 : selectedAnswer;
    if (!timeOut && ans === null) { setFeedback('⚠️ Select a number first!'); return; }
    try {
      const result = await submitAnswer(user.token, { answer: ans, scene: gameState.scene });
      setGameState(prev => ({ ...prev, ...result }));
      setSelectedAnswer(null);
      setHintChoices(null);
      setRevealedAnswer(null);
      setImageStyle({});
      setChaosEvent(null);

      if (result.correct) {
        playCorrect(); flash('correct'); boom('correct');
        setHopping(true);
        setTimeout(() => setHopping(false), 800);
        if (result.won) { playWin(); }
        else { setTimeout(() => loadPuzzle(result, difficulty), 1000); }
      } else {
        playWrong(); flash('wrong'); boom('wrong');
        setFeedback(timeOut ? '⏱️ Time ran out!' : '❌ Wrong count! Try again...');
      }
    } catch (e) { console.error('handleSubmit error:', e); }
  };

  const handlePowerUp = async (type) => {
    if (powerUps[type] <= 0) return;
    try {
      playPowerUp();
      const result = await usePowerUp(user.token, type);
      setPowerUps(prev => ({ ...prev, [type]: result.remaining }));
      flash('bonus');
      if (type === 'mushroom') {
        setFrozen(true);
        setTimeout(() => setFrozen(false), 5000);
        setFeedback('❄️ Frozen for 5 seconds!');
      }
      if (type === 'star') {
        setRevealedAnswer(result.solution);
        setFeedback(`⭐ Answer is ${result.solution}!`);
      }
      if (type === 'portal') {
        setHopping(true); boom('correct');
        setTimeout(() => setHopping(false), 800);
        setFeedback('🌀 Teleporting forward!');
        setTimeout(() => loadPuzzle(null, difficulty), 1200);
      }
    } catch (e) { console.error('powerup error:', e); }
  };

  const handleHint = () => {
    if (hints <= 0) return;
    const three = [0,1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5).slice(0, 3);
    setHintChoices(three);
    setHints(h => h - 1);
    setFeedback(`💡 Answer is one of: ${three.sort((a,b)=>a-b).join(', ')}`);
  };

  const resetGame = () => {
    setStarted(false); setGameState(null); setImageUrl(null);
    setHints(3); setSelectedAnswer(null); setFeedback('');
    setRevealedAnswer(null); setChaosEvent(null); setImageStyle({});
  };

  // ── DIFFICULTY SCREEN ──
  if (!started) return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow)', animation: 'fadeUp 0.4s ease' }}>
        <div style={{ fontSize: '64px', animation: 'bounce 1.5s ease infinite', marginBottom: '12px' }}>🐰</div>
        <h2 style={{ color: 'var(--primary)', fontSize: '26px', marginBottom: '6px', fontWeight: '900' }}>Ready to Guide Benny?</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px', fontSize: '13px', lineHeight: 1.6 }}>
          Count hearts in each image!<br/>
          Watch for chaos events · Build combos · Use power-ups
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {Object.entries(DIFFICULTY).map(([key, val]) => (
            <button key={key} onClick={() => setDifficulty(key)} style={{
              background: difficulty === key ? val.color : 'var(--card2)',
              color: difficulty === key ? 'white' : 'var(--text)',
              border: `2px solid ${difficulty === key ? val.color : 'var(--border)'}`,
              borderRadius: '14px', padding: '14px 20px',
              fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: difficulty === key ? `0 4px 14px ${val.color}55` : 'none',
              transition: 'all 0.18s',
            }}>
              {val.label}
              <span style={{ fontSize: '11px', display: 'block', opacity: 0.8, marginTop: '2px' }}>
                {key === 'easy' ? '45s per puzzle' : key === 'medium' ? '30s per puzzle' : '20s per puzzle'}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => startNewGame(difficulty)} style={{
          background: 'linear-gradient(135deg,#ff6b35,#f7c948)', color: 'white',
          borderRadius: '14px', padding: '15px', fontSize: '17px', fontWeight: 'bold',
          width: '100%', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(255,107,53,0.45)',
        }}>
          Start Benny's Journey 🌲
        </button>
      </div>
    </div>
  );

  // ── LOADING ──
  if (!gameState || !imageUrl) return (
    <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: '14px' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      <div style={{ fontSize: '52px', animation: 'bounce 1s ease infinite' }}>🐰</div>
      <p style={{ color: 'var(--text)', fontSize: '18px' }}>Loading Whispering Woods... 🌲</p>
    </div>
  );

  // ── GAME OVER ──
  if (gameState.gameOver) return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '44px', textAlign: 'center', maxWidth: '380px', width: '100%', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '60px', marginBottom: '14px' }}>😢</div>
        <h2 style={{ color: '#f44336', fontSize: '26px', marginBottom: '6px' }}>Benny is lost...</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '6px' }}>He curled up under a leaf, waiting for morning.</p>
        <p style={{ color: '#f7c848a2', fontSize: '26px', fontWeight: 'bold', marginBottom: '4px' }}>Score: {gameState.score}</p>
        <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '26px' }}>Reached scene {gameState.scene} of 10</p>
        <button onClick={resetGame} style={{ background: 'linear-gradient(135deg,#ff6b35,#f7c948)', color: 'white', borderRadius: '14px', padding: '13px 30px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Try Again 🐰
        </button>
      </div>
    </div>
  );

  // ── WIN ──
  if (gameState.won) return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FFF176,#F9A825)' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      <Particles trigger={particleTrigger} type='correct' />
      <div style={{ background: 'white', borderRadius: '24px', padding: '44px', textAlign: 'center', maxWidth: '380px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ fontSize: '60px', marginBottom: '8px', animation: 'bounce 1s ease infinite' }}>🏡</div>
        <h2 style={{ color: '#ff6b35', fontSize: '26px', marginBottom: '6px' }}>Benny made it home!</h2>
        <p style={{ color: '#666', marginBottom: '6px' }}>Mama Bunny is waiting with warm carrot stew! 🥕</p>
        <p style={{ color: '#ff6b35', fontSize: '30px', fontWeight: 'bold', marginBottom: '6px' }}>🏆 {gameState.score} pts</p>
        <p style={{ color: '#888', fontSize: '12px', marginBottom: '26px' }}>All 10 scenes completed!</p>
        <button onClick={resetGame} style={{ background: 'linear-gradient(135deg,#ff6b35,#f7c948)', color: 'white', borderRadius: '14px', padding: '13px 30px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Play Again 🌟
        </button>
      </div>
    </div>
  );

  // ── MAIN GAME ──
  const sc = SCENES[gameState.scene - 1];

  return (
    <div style={{ height: 'calc(100vh - 52px)', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '8px 12px', gap: '6px' }}>
      <style>{`
        @keyframes hop        { 0%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-18px) rotate(12deg)} 100%{transform:translateY(0)} }
        @keyframes idleBounce { 0%{transform:translateY(0)} 100%{transform:translateY(-5px)} }
        @keyframes float0     { 0%{transform:translateY(0)} 100%{transform:translateY(-7px)} }
        @keyframes float1     { 0%{transform:translateY(0)} 100%{transform:translateY(-11px)} }
        @keyframes flashFade  { 0%{opacity:1} 100%{opacity:0} }
        @keyframes comboPulse { 0%{transform:scale(1)} 100%{transform:scale(1.1)} }
        @keyframes chaosShake { 0%{transform:translate(0,0)} 25%{transform:translate(-4px,2px)} 50%{transform:translate(4px,-2px)} 75%{transform:translate(-2px,4px)} 100%{transform:translate(0,0)} }
        @keyframes slideIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown  { from{transform:translateX(-50%) translateY(-20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
        @keyframes bounce     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
      `}</style>

      <ScreenFlash flash={screenFlash} />
      <Particles trigger={particleTrigger} type={particleType} />
      <ComboFire combo={gameState.combo} />
      <ChaosBanner event={chaosEvent} onDismiss={() => setChaosEvent(null)} />

      {/* ROW 1 — Header */}
      <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '7px 12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Scene {gameState.scene} of 10</div>
          <div style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{sc.name}</div>
        </div>
        <span style={{ background: DIFFICULTY[difficulty].color, borderRadius: '10px', padding: '3px 8px', fontSize: '11px', fontWeight: 'bold', color: 'white' }}>
          {DIFFICULTY[difficulty].label}
        </span>
      </div>

      {/* ROW 2 — Scene illustration */}
      <div style={{ flexShrink: 0, height: '90px', borderRadius: '12px', background: sc.bg, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ position: 'absolute', top: '4px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          {sc.trees.map((t, i) => <span key={i} style={{ fontSize: '18px' }}>{t}</span>)}
        </div>
        <div style={{ position: 'absolute', top: '5px', right: '10px', display: 'flex', gap: '3px' }}>
          {sc.extras.map((t, i) => <span key={i} style={{ fontSize: '13px', animation: `float${i} 3s ease infinite alternate` }}>{t}</span>)}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30px', background: sc.ground, borderRadius: '0 0 11px 11px' }} />
        <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-around', padding: '0 18px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === gameState.scene ? '10px' : '5px',
              height: i + 1 === gameState.scene ? '10px' : '5px',
              borderRadius: '50%',
              background: i + 1 < gameState.scene ? '#4caf50' : i + 1 === gameState.scene ? '#fff' : 'rgba(255,255,255,0.22)',
              border: i + 1 === gameState.scene ? '2px solid #ff6b35' : 'none',
              transition: 'all 0.5s',
            }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: '24px',
          left: `${((gameState.scene - 1) / 9) * 82 + 4}%`,
          transition: 'left 1.2s cubic-bezier(0.68,-0.55,0.265,1.55)',
          fontSize: '26px',
          animation: hopping ? 'hop 0.4s ease infinite' : 'idleBounce 2s ease infinite alternate',
          filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))',
        }}>🐰</div>
      </div>

      {/* ROW 3 — Lives + Score */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', borderRadius: '10px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <LivesBar lives={gameState.lives} />
        <ScoreBoard score={gameState.score} combo={gameState.combo} timer={timer} frozen={frozen} />
      </div>

      {/* ROW 4 — Puzzle image */}
      <div style={{ flex: 1, minHeight: 0, background: 'rgba(255,255,255,0.97)', borderRadius: '14px', padding: '8px', textAlign: 'center', border: '2px solid rgba(255,107,53,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <p style={{ color: '#444', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>
          ❤️ How many <strong style={{ color: '#f44336' }}>hearts</strong>?
        </p>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={imageUrl} alt='Count hearts' style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', ...imageStyle }} />
        </div>
        {revealedAnswer !== null && (
          <div style={{ marginTop: '4px', background: '#fff3e0', borderRadius: '7px', padding: '4px 8px', border: '1px solid #ff9800' }}>
            <span style={{ color: '#e65100', fontWeight: 'bold', fontSize: '12px' }}>⭐ Answer: {revealedAnswer}</span>
          </div>
        )}
        {feedback && (
          <div style={{
            marginTop: '4px',
            background: feedback.includes('❌') || feedback.includes('⏱️') ? 'rgba(244,67,54,0.12)' : feedback.includes('⚠️') ? 'rgba(255,152,0,0.12)' : 'rgba(76,175,80,0.12)',
            border: `1px solid ${feedback.includes('❌') || feedback.includes('⏱️') ? '#f44336' : feedback.includes('⚠️') ? '#ff9800' : '#4caf50'}`,
            borderRadius: '7px', padding: '4px 8px',
            color: feedback.includes('❌') || feedback.includes('⏱️') ? '#f44336' : feedback.includes('⚠️') ? '#ff9800' : '#4caf50',
            fontWeight: 'bold', fontSize: '11px', animation: 'slideIn 0.25s ease',
          }}>
            {feedback}
          </div>
        )}
      </div>

      {/* ROW 5 — Answer buttons */}
      <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '5px', marginBottom: '7px' }}>
          {[0,1,2,3,4,5,6,7,8,9].map(n => {
            const sel  = selectedAnswer === n;
            const hint = hintChoices && hintChoices.includes(n);
            const dim  = hintChoices && !hintChoices.includes(n);
            const rev  = revealedAnswer === n;
            return (
              <button key={n} onClick={() => !dim && setSelectedAnswer(n)} style={{
                background: rev ? 'linear-gradient(135deg,#ff9800,#ffb74d)' : sel ? 'linear-gradient(135deg,#f44336,#ff6b6b)' : hint ? 'rgba(156,39,176,0.4)' : dim ? 'rgba(50,50,50,0.15)' : 'rgba(255,255,255,0.08)',
                color: dim ? 'rgba(255,255,255,0.12)' : 'white',
                border: `1px solid ${rev ? '#ff9800' : sel ? '#f44336' : hint ? '#9c27b0' : 'rgba(255,255,255,0.09)'}`,
                borderRadius: '10px', padding: '9px 4px', fontSize: '17px', fontWeight: 'bold',
                cursor: dim ? 'not-allowed' : 'pointer', transition: 'all 0.12s',
                transform: sel || rev ? 'scale(1.07)' : 'scale(1)',
                boxShadow: sel ? '0 3px 10px rgba(244,67,54,0.4)' : rev ? '0 3px 10px rgba(255,152,0,0.4)' : 'none',
              }}>{n}</button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '7px' }}>
          <button onClick={handleHint} disabled={hints === 0} style={{
            background: hints > 0 ? 'rgba(156,39,176,0.22)' : 'rgba(50,50,50,0.18)',
            border: `1px solid ${hints > 0 ? '#9c27b0' : '#3a3a3a'}`,
            borderRadius: '9px', padding: '8px 11px',
            color: hints > 0 ? '#ce93d8' : '#555', fontSize: '12px', fontWeight: 'bold',
            cursor: hints > 0 ? 'pointer' : 'not-allowed', flexShrink: 0,
          }}>💡 {hints}</button>
          <button onClick={() => handleSubmit(false)} disabled={selectedAnswer === null} style={{
            flex: 1, background: selectedAnswer !== null ? 'linear-gradient(135deg,#ff6b35,#f7c948)' : 'rgba(50,50,50,0.28)',
            color: 'white', border: 'none', borderRadius: '9px', padding: '8px',
            fontSize: '13px', fontWeight: 'bold',
            cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
            boxShadow: selectedAnswer !== null ? '0 3px 12px rgba(255,107,53,0.38)' : 'none', transition: 'all 0.14s',
          }}>
            {selectedAnswer !== null ? `Submit ${selectedAnswer} ❤️ →` : 'Select a number'}
          </button>
        </div>
      </div>

      {/* ROW 6 — Power-ups */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '7px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '7px 8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { type: 'mushroom', emoji: '❄️', label: 'Freeze', color: '#00bcd4' },
          { type: 'star',     emoji: '⭐', label: 'Reveal', color: '#ff9800' },
          { type: 'portal',   emoji: '🌀', label: 'Skip',   color: '#9c27b0' },
        ].map(item => {
          const n = powerUps[item.type]; const ok = n > 0;
          return (
            <button key={item.type} onClick={() => handlePowerUp(item.type)} disabled={!ok} style={{
              flex: 1, background: ok ? `linear-gradient(135deg,${item.color}33,${item.color}16)` : 'rgba(50,50,50,0.14)',
              border: `1px solid ${ok ? item.color : 'rgba(70,70,70,0.3)'}`,
              borderRadius: '10px', padding: '6px 4px', cursor: ok ? 'pointer' : 'not-allowed',
              textAlign: 'center', boxShadow: ok ? `0 2px 8px ${item.color}22` : 'none', transition: 'all 0.14s',
            }}>
              <div style={{ fontSize: '17px', lineHeight: 1 }}>{item.emoji}</div>
              <div style={{ color: ok ? item.color : '#3a3a3a', fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>{item.label}</div>
              <div style={{ background: ok ? item.color : '#2a2a2a', color: 'white', borderRadius: '8px', padding: '0px 5px', fontSize: '10px', display: 'inline-block', marginTop: '2px' }}>{n}x</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 Main Game Page
 Written by: Nethmi Bandusena
 useEffect and useState patterns referenced from:
 https://react.dev/reference/react
 AI assistance: Claude used for some features
 */