export default {
  bodyLabel: 'food',
  emoji: '🍔',
  fontSize: '50px',
  gameObjectShape: {
    shape: { type: 'rectangle', width: 52, height: 52 }, 
    chamfer: { radius: 15 },
  },
  mass: 10,
  bounce: 0.5,
  frictionAir: 0.001,
  minVelocity: 5,
  emitter: {
    particleKey: 'red',
    options: {
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    },
    minVelocity: 6,
  },
  healthEffect: +1,
};
