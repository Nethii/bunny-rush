export const CHAOS_EVENTS = [
  {
    id: 'blur',
    name: '🌫️ Foggy Forest!',
    description: 'The mist rolled in — image is blurry for 4 seconds!',
    color: '#607d8b',
    apply: (setImageStyle) => {
      setImageStyle({ filter: 'blur(4px)', transition: 'filter 0.5s' });
      setTimeout(() => setImageStyle({}), 4000);
    },
  },
  {
    id: 'flip',
    name: '🙃 Upside Down!',
    description: 'Benny tumbled! The image is flipped for 5 seconds!',
    color: '#9c27b0',
    apply: (setImageStyle) => {
      setImageStyle({ transform: 'scaleY(-1)', transition: 'transform 0.4s' });
      setTimeout(() => setImageStyle({}), 5000);
    },
  },
  {
    id: 'mirror',
    name: '🪞 Mirror World!',
    description: 'A magic mirror appeared — the image is mirrored!',
    color: '#00bcd4',
    apply: (setImageStyle) => {
      setImageStyle({ transform: 'scaleX(-1)', transition: 'transform 0.4s' });
      setTimeout(() => setImageStyle({}), 5000);
    },
  },
  {
    id: 'shake',
    name: '🌪️ Earthquake!',
    description: 'The ground is shaking under Benny\'s paws!',
    color: '#ff5722',
    apply: (setImageStyle) => {
      setImageStyle({ animation: 'chaosShake 0.15s ease infinite' });
      setTimeout(() => setImageStyle({}), 3000);
    },
  },
  {
    id: 'tiny',
    name: '🔬 Shrink Ray!',
    description: 'A wizard shrunk the image! Look carefully...',
    color: '#4caf50',
    apply: (setImageStyle) => {
      setImageStyle({ transform: 'scale(0.45)', transition: 'transform 0.5s' });
      setTimeout(() => setImageStyle({ transform: 'scale(1)', transition: 'transform 0.5s' }), 5000);
    },
  },
  {
    id: 'grayscale',
    name: '🌑 Eclipse!',
    description: 'The moon covered the sun — everything is grey!',
    color: '#455a64',
    apply: (setImageStyle) => {
      setImageStyle({ filter: 'grayscale(100%)', transition: 'filter 0.5s' });
      setTimeout(() => setImageStyle({}), 5000);
    },
  },
];

export function getRandomChaosEvent() {
  return CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
}