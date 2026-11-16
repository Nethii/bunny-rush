export default function Logo({ size = 'md' }) {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.4 : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * scale}px` }}>
      <div style={{
        width: `${40 * scale}px`, height: `${40 * scale}px`,
        background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
        borderRadius: `${12 * scale}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: `${22 * scale}px`,
        boxShadow: `0 4px ${12 * scale}px rgba(255,107,53,0.5)`,
        flexShrink: 0,
      }}>🐰</div>
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontWeight: '900',
          fontSize: `${20 * scale}px`,
          background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        }}>BUNNY</div>
        <div style={{
          fontWeight: '900',
          fontSize: `${13 * scale}px`,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '3px',
          marginTop: '-2px',
        }}>RUSH</div>
      </div>
    </div>
  );
}