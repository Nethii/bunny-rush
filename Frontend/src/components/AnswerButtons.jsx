export default function AnswerButtons({ onAnswer, highlighted }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {[0,1,2,3,4,5,6,7,8,9].map(n => {
          const isHighlighted = highlighted ? highlighted.includes(n) : true;
          const isDimmed = highlighted && !highlighted.includes(n);
          return (
            <button key={n} onClick={() => onAnswer(n)} style={{
              background: isDimmed
                ? 'rgba(100,100,100,0.1)'
                : isHighlighted && highlighted
                ? 'linear-gradient(145deg, #9c27b0, #ce93d8)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(10px)',
              color: isDimmed ? 'rgba(255,255,255,0.2)' : 'white',
              border: highlighted && isHighlighted
                ? '2px solid #ce93d8'
                : '2px solid rgba(255,255,255,0.2)',
              borderRadius: '16px', padding: '16px 8px',
              fontSize: '24px', fontWeight: 'bold',
              cursor: isDimmed ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: highlighted && isHighlighted
                ? '0 4px 20px rgba(156,39,176,0.5)'
                : '0 4px 15px rgba(0,0,0,0.2)',
              transform: highlighted && isHighlighted ? 'scale(1.05)' : 'scale(1)',
            }}
            onMouseEnter={e => {
              if (isDimmed) return;
              e.currentTarget.style.background = 'linear-gradient(145deg, #ff6b35, #f7c948)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,107,53,0.5)';
            }}
            onMouseLeave={e => {
              if (isDimmed) return;
              e.currentTarget.style.background = highlighted && isHighlighted
                ? 'linear-gradient(145deg, #9c27b0, #ce93d8)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))';
              e.currentTarget.style.transform = highlighted && isHighlighted ? 'scale(1.05)' : 'scale(1)';
              e.currentTarget.style.boxShadow = highlighted && isHighlighted
                ? '0 4px 20px rgba(156,39,176,0.5)'
                : '0 4px 15px rgba(0,0,0,0.2)';
            }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}