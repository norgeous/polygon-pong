const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 20 * 50,
    height: 10 * 50,
  },
  pixelArt: true,
  antialias: false,
  autoRound: true,
  roundPixels: true,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      // gravity: { y: 200 }
    }
  },
  fps: {
    target: 90,
    forceSetTimeOut: true,
  },
};

export default config;
