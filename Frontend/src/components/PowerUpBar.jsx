export default function PowerUpBar({ powerUps, onUse }) {
  return (
    <div className='powerups'>
      <button onClick={() => onUse('mushroom')} disabled={powerUps.mushroom === 0}>
        ❄️ Freeze ({powerUps.mushroom})
      </button>
      <button onClick={() => onUse('star')} disabled={powerUps.star === 0}>
        💡 Star ({powerUps.star})
      </button>
      <button onClick={() => onUse('portal')} disabled={powerUps.portal === 0}>
        🌀 Portal ({powerUps.portal})
      </button>
    </div>
  );
}