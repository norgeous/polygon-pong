import Ball from '../objects/Ball';

function preload () {
  this.load.setBaseURL('https://labs.phaser.io');
  this.load.image('red', 'assets/particles/red.png');
}

function create () {
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

function update () {
  this.ball.update(this);
  this.player1?.update(this);
  this.otherPlayers.forEach(otherPlayer => otherPlayer.update(this));
  this.additionalFunctions.update(this);

  if (this.game.sysInfo.visibilityState === 'hidden') this.matter.pause();
  if (this.game.sysInfo.visibilityState === 'visible') this.matter.resume();
}

export default {
  preload,
  create,
  update,
};
