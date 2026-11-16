import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '../components/Logo';

export default function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 40%, #2d1b4e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'none',
    }}>
      <style>{`
        @keyframes float    { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
        @keyframes twinkle  { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{transform:scale(1);box-shadow:0 0 20px rgba(255,107,53,0.4)} 50%{transform:scale(1.05);box-shadow:0 0 40px rgba(255,107,53,0.8)} }
        @keyframes shimmer  { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes orbit    { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        @keyframes heartbeat{ 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.3)} 70%{transform:scale(1)} }
      `}</style>

      {/* Stars background */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 1}px`,
          height: `${Math.random() * 4 + 1}px`,
          borderRadius: '50%',
          background: 'white',
          animation: `twinkle ${Math.random() * 3 + 1}s ease infinite`,
          animationDelay: `${Math.random() * 3}s`,
        }} />
      ))}

      {/* Floating emojis */}
      {['🌸','🍄','🌊','🌙','🌿','🌺','🦋','🏔️','🌈','🏡','🥕','⭐'].map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${10 + Math.random() * 80}%`,
          left: `${5 + Math.random() * 90}%`,
          fontSize: `${Math.random() * 20 + 14}px`,
          animation: `float ${Math.random() * 4 + 3}s ease infinite`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: 0.35,
          pointerEvents: 'none',
        }}>
          {e}
        </div>
      ))}

 

      {/* Main content */}
      <div style={{
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1s ease',
        zIndex: 10,
        padding: '20px',
      }}>
        {/* Big bunny */}
        <div style={{
          fontSize: '100px',
          animation: 'float 3s ease infinite',
          marginBottom: '8px',
          filter: 'drop-shadow(0 0 30px rgba(255,200,100,0.5))',
        }}>
          🐰
        </div>

        {/* Title */}
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
        <Logo size='lg' />
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '18px',
          marginBottom: '4px',
          fontStyle: 'italic',
        }}>
          The Story of Benny
        </p>

        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '14px',
          marginBottom: '48px',
          maxWidth: '320px',
          margin: '0 auto 48px auto',
          lineHeight: 1.6,
        }}>
          Guide Benny through 10 magical forest scenes.<br />
          Count hearts to find the path home!
        </p>

        {/* Click to start button */}
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '20px 56px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            animation: 'pulse 2s ease infinite',
            letterSpacing: '1px',
          }}
        >
          ✨ Click to Start ✨
        </button>

        {/* Subtitle below button */}
        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          marginTop: '20px',
        }}>
           Deep in the Whispering Woods, Benny needs your help...
        </p>
      </div>
    </div>
  );
}