import Ball from '../objects/Ball';

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.maxVolume = 0;
    this.visibilityState = 'visible';

    this.localPlayer = undefined;
    this.remotePlayers = [];
    this.balls = [];

    this.reactUpdate = () => {};
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
  }

  create () {
    const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, 150);

    this.particles = this.add.particles('red');

    // camera
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.setZoom(0.5);
    // this.cameras.main.centerOn(width/2, height/2);
  }

  update () {
    if (this.visibilityState === 'hidden') this.matter.pause();
    if (this.visibilityState === 'visible') this.matter.resume();

    [
      this.localPlayer,
      ...this.remotePlayers,
      ...this.balls,
    ].forEach(gObj => gObj?.update(this));

    this.reactUpdate(this);
  }

  addBall () {
    this.balls.push(new Ball(this));
  }

  removeBall () {
    const ball = this.balls.pop();
    ball.destroy();
  }

  addPlayer () {}
  removePlayer () {}
}

export default GameScene;
