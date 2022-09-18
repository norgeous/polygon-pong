import Ball from '../objects/Ball';

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.sysInfo = {};
    this.player1 = undefined;
    this.otherPlayers = [];
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
  }

  create () {
    const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, 150);

    // camera
    this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.setZoom(0.5);
    // this.cameras.main.centerOn(width/2, height/2);

    this.ball = new Ball(this);
    this.otherPlayers = [];
  }

  update () {
    this.ball.update(this);
    this.player1?.update?.(this);
    this.otherPlayers.forEach(otherPlayer => otherPlayer.update(this));
    // this.additionalFunctions.update(this);

    if (this.sysInfo.visibilityState === 'hidden') this.matter.pause();
    if (this.sysInfo.visibilityState === 'visible') this.matter.resume();
  }
}

export default GameScene;
