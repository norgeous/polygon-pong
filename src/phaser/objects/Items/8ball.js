export default {
  bodyLabel: 'ball',
  emoji: '🎱',
  fontSize: '50px',
  gameObjectShape: {
    shape: {
      type: 'circle',
      radius: 26
    },
  },
  mass: 10,
  bounce: 0.5,
  frictionAir: 0.001,
  minVelocity: 5,
  emitter: {
    particleKey: 'cloud',
    options: {
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    },
    minVelocity: 6,
  },
  healthEffect: 0,
};
