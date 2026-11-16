export default function LivesBar({ lives }) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginRight: '4px' }}>Lives:</span>
      {[...Array(3)].map((_, i) => (
        <span key={i} style={{
          fontSize: '24px',
          filter: i < lives ? 'none' : 'grayscale(1) opacity(0.3)',
          transition: 'all 0.3s',
          animation: i < lives ? 'pulse 2s ease infinite' : 'none',
        }}>
          {i < lives ? '🐰' : '💀'}
        </span>
      ))}
    </div>
  );
}