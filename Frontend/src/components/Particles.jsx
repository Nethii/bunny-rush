import { useEffect, useState } from 'react';

export default function Particles({ trigger, type = 'correct' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const colors = type === 'correct'
      ? ['#f7c948','#ff6b35','#4caf50','#00bcd4','#ff80ab','#fff']
      : ['#f44336','#ff5722','#b71c1c'];

    const newParticles = Array.from({ length: 28 }).map((_, i) => ({
      id: Date.now() + i,
      x: 40 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 320,
      vy: -(Math.random() * 400 + 200),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  }, [trigger]);

  if (!particles.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998, overflow: 'hidden' }}>
      <style>{`
        @keyframes particleFly {
          0%   { transform: translate(0,0) rotate(0deg);   opacity: 1; }
          100% { transform: translate(var(--vx), var(--vy)) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '50%', left: `${p.x}%`,
            width:  p.shape === 'circle' ? `${p.size}px` : `${p.size * 0.7}px`,
            height: p.shape === 'circle' ? `${p.size}px` : `${p.size * 1.4}px`,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            background: p.color,
            '--vx': `${p.vx}px`,
            '--vy': `${p.vy}px`,
            animation: 'particleFly 1.1s cubic-bezier(0.22,1,0.36,1) forwards',
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}