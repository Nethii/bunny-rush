export default function ScoreBoard({ score, combo, timer, frozen }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{
        background: 'rgba(255,200,0,0.2)', borderRadius: '12px',
        padding: '6px 12px', border: '1px solid rgba(255,200,0,0.4)',
      }}>
        <span style={{ color: '#f7c948', fontWeight: 'bold', fontSize: '15px' }}>
          🏆 {score}
        </span>
      </div>
      {combo >= 2 && (
        <div style={{
          background: 'rgba(255,107,53,0.2)', borderRadius: '12px',
          padding: '6px 12px', border: '1px solid rgba(255,107,53,0.4)',
          animation: 'shine 1s ease infinite alternate',
        }}>
          <span style={{ color: '#ff6b35', fontWeight: 'bold', fontSize: '14px' }}>
            🔥 x{combo}
          </span>
        </div>
      )}
      <div style={{
        background: frozen ? 'rgba(0,188,212,0.2)' : timer <= 5 ? 'rgba(244,67,54,0.2)' : 'rgba(255,255,255,0.1)',
        borderRadius: '12px', padding: '6px 12px',
        border: `1px solid ${frozen ? '#00bcd4' : timer <= 5 ? '#f44336' : 'rgba(255,255,255,0.2)'}`,
      }}>
        <span style={{
          color: frozen ? '#00bcd4' : timer <= 5 ? '#f44336' : 'white',
          fontWeight: 'bold', fontSize: '14px',
        }}>
          {frozen ? '❄️ FROZEN' : `⏱️ ${timer}s`}
        </span>
      </div>
    </div>
  );
}
