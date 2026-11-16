// import { useState, useEffect, useRef } from 'react';

// const WHEEL_PRIZES = [
//   { label: '+15 pts',   value: 15,  color: '#f44336', emoji: '🎯' },
//   { label: '+30 pts',   value: 30,  color: '#ff9800', emoji: '⭐' },
//   { label: '+50 pts',   value: 50,  color: '#4caf50', emoji: '💎' },
//   { label: '+5 pts',    value: 5,   color: '#9c27b0', emoji: '🌸' },
//   { label: 'JACKPOT!',  value: 100, color: '#f7c948', emoji: '🏆' },
//   { label: '+20 pts',   value: 20,  color: '#00bcd4', emoji: '🌊' },
//   { label: '+10 pts',   value: 10,  color: '#e91e63', emoji: '🎵' },
//   { label: '+25 pts',   value: 25,  color: '#ff5722', emoji: '🔥' },
// ];

// const TOTAL = WHEEL_PRIZES.length;
// const SLICE  = 360 / TOTAL;

// export default function SpinWheel({ onComplete }) {
//   const [rotation, setRotation]   = useState(0);
//   const [spinning, setSpinning]   = useState(false);
//   const [result, setResult]       = useState(null);
//   const [showResult, setShowResult] = useState(false);
//   const currentRot                = useRef(0);

//   const spin = () => {
//     if (spinning || result) return;
//     setSpinning(true);
//     setShowResult(false);

//     const extraSpins  = 5 + Math.floor(Math.random() * 5); // 5-9 full spins
//     const landAngle   = Math.floor(Math.random() * 360);
//     const total       = extraSpins * 360 + landAngle;
//     const newRot      = currentRot.current + total;
//     currentRot.current = newRot;

//     setRotation(newRot);

//     setTimeout(() => {
//       // Figure out which slice we landed on
//       const normalized = ((newRot % 360) + 360) % 360;
//       const pointerAngle = (360 - normalized + 90) % 360;
//       const index = Math.floor(pointerAngle / SLICE) % TOTAL;
//       const prize = WHEEL_PRIZES[index];
//       setResult(prize);
//       setSpinning(false);
//       setShowResult(true);
//     }, 4200);
//   };

//   const sliceAngle = SLICE * (Math.PI / 180);

//   return (
//     <div style={{
//       position: 'fixed', inset: 0,
//       background: 'rgba(0,0,0,0.88)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       zIndex: 1000, backdropFilter: 'blur(8px)',
//     }}>
//       <style>{`
//         @keyframes popIn     { from{transform:scale(0.4);opacity:0} to{transform:scale(1);opacity:1} }
//         @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
//         @keyframes prizePop  { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
//         @keyframes shimmer   { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
//         @keyframes glow      { 0%,100%{box-shadow:0 0 10px rgba(247,201,72,0.3)} 50%{box-shadow:0 0 40px rgba(247,201,72,0.9)} }
//       `}</style>

//       <div style={{
//         textAlign: 'center', animation: 'popIn 0.4s ease',
//         padding: '20px', maxWidth: '420px', width: '95%',
//       }}>
//         <div style={{ fontSize: '36px', marginBottom: '4px', animation: 'bounce 1.5s ease infinite' }}>🐰</div>
//         <h2 style={{
//           fontSize: '26px', fontWeight: '900', marginBottom: '4px',
//           background: 'linear-gradient(135deg,#ff6b35,#f7c948,#ff6b35)',
//           backgroundSize: '200% auto',
//           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//           animation: 'shimmer 2s linear infinite',
//         }}>
//           Bonus Wheel!
//         </h2>
//         <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '20px' }}>
//           Benny found a magic wheel in the forest! Spin for bonus points!
//         </p>

//         {/* Wheel */}
//         <div style={{ position: 'relative', width: '260px', margin: '0 auto 16px auto' }}>

//           {/* Pointer */}
//           <div style={{
//             position: 'absolute', top: '-14px', left: '50%',
//             transform: 'translateX(-50%)',
//             width: 0, height: 0,
//             borderLeft: '12px solid transparent',
//             borderRight: '12px solid transparent',
//             borderTop: '24px solid #f7c948',
//             zIndex: 10,
//             filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
//           }} />

//           {/* SVG wheel */}
//           <svg
//             width='260' height='260'
//             viewBox='0 0 260 260'
//             style={{
//               transform: `rotate(${rotation}deg)`,
//               transition: spinning ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
//               filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
//             }}
//           >
//             {WHEEL_PRIZES.map((prize, i) => {
//               const startAngle = i * sliceAngle - Math.PI / 2;
//               const endAngle   = startAngle + sliceAngle;
//               const cx = 130, cy = 130, r = 120;
//               const x1 = cx + r * Math.cos(startAngle);
//               const y1 = cy + r * Math.sin(startAngle);
//               const x2 = cx + r * Math.cos(endAngle);
//               const y2 = cy + r * Math.sin(endAngle);
//               const midAngle = startAngle + sliceAngle / 2;
//               const tx = cx + (r * 0.65) * Math.cos(midAngle);
//               const ty = cy + (r * 0.65) * Math.sin(midAngle);
//               const emojiX = cx + (r * 0.38) * Math.cos(midAngle);
//               const emojiY = cy + (r * 0.38) * Math.sin(midAngle);

//               return (
//                 <g key={i}>
//                   <path
//                     d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
//                     fill={prize.color}
//                     stroke='rgba(0,0,0,0.3)'
//                     strokeWidth='2'
//                   />
//                   <text
//                     x={tx} y={ty}
//                     textAnchor='middle' dominantBaseline='middle'
//                     fill='white' fontSize='11' fontWeight='bold'
//                     transform={`rotate(${i * SLICE + SLICE / 2}, ${tx}, ${ty})`}
//                     style={{ pointerEvents: 'none' }}
//                   >
//                     {prize.label}
//                   </text>
//                   <text
//                     x={emojiX} y={emojiY}
//                     textAnchor='middle' dominantBaseline='middle'
//                     fontSize='16'
//                     transform={`rotate(${i * SLICE + SLICE / 2}, ${emojiX}, ${emojiY})`}
//                     style={{ pointerEvents: 'none' }}
//                   >
//                     {prize.emoji}
//                   </text>
//                 </g>
//               );
//             })}
//             {/* Center hub */}
//             <circle cx='130' cy='130' r='22' fill='#1a1a2e' stroke='rgba(255,255,255,0.3)' strokeWidth='3' />
//             <text x='130' y='130' textAnchor='middle' dominantBaseline='middle' fontSize='20'>🐰</text>
//           </svg>
//         </div>

//         {/* Spin button or result */}
//         {!showResult ? (
//           <button
//             onClick={spin}
//             disabled={spinning}
//             style={{
//               background: spinning
//                 ? 'rgba(100,100,100,0.4)'
//                 : 'linear-gradient(135deg,#ff6b35,#f7c948)',
//               color: 'white', border: 'none', borderRadius: '50px',
//               padding: '16px 48px', fontSize: '18px', fontWeight: 'bold',
//               cursor: spinning ? 'not-allowed' : 'pointer',
//               boxShadow: spinning ? 'none' : '0 4px 24px rgba(255,107,53,0.5)',
//               transition: 'all 0.2s',
//               animation: !spinning ? 'glow 2s ease infinite' : 'none',
//             }}
//           >
//             {spinning ? '🌀 Spinning...' : '🎰 SPIN!'}
//           </button>
//         ) : (
//           <div style={{ animation: 'prizePop 0.5s ease' }}>
//             <div style={{
//               background: `${result.color}25`,
//               border: `2px solid ${result.color}`,
//               borderRadius: '20px', padding: '20px', marginBottom: '16px',
//             }}>
//               <div style={{ fontSize: '40px', marginBottom: '8px' }}>{result.emoji}</div>
//               <p style={{ color: result.color, fontSize: '22px', fontWeight: '900', margin: '0 0 4px 0' }}>
//                 {result.label}
//               </p>
//               <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
//                 {result.value >= 100 ? '🎉 JACKPOT! You hit the grand prize!' :
//                  result.value >= 50  ? '💎 Amazing spin! Benny is dancing!' :
//                  result.value >= 25  ? '⭐ Great spin! The forest cheers!' :
//                                        '🌸 Nice spin! Keep going!'}
//               </p>
//             </div>
//             <button
//               onClick={() => onComplete(result.value)}
//               style={{
//                 background: 'linear-gradient(135deg,#ff6b35,#f7c948)',
//                 color: 'white', border: 'none', borderRadius: '16px',
//                 padding: '14px 40px', fontSize: '16px', fontWeight: 'bold',
//                 cursor: 'pointer', width: '100%',
//                 boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
//               }}
//             >
//               Continue Journey →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }