import Ball from '../objects/Ball';
import Player from '../objects/Player';

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
  // this.player1 = new Player(this);
  this.otherPlayers = [];
}

function update () {
  this.ball?.update(this);
  this.player1?.update(this);
  this.additionalFunctions.update(this);
}

export default {
  preload,
  create,
  update,
};
