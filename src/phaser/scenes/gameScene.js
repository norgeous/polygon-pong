import Ball from '../objects/Ball';
import Player from '../objects/Player';

function preload () {
  this.load.setBaseURL('https://labs.phaser.io');
  this.load.image('red', 'assets/particles/red.png');
}

function create () {
  const { width, height } = this.sys.game.canvas;

  this.matter.world.disableGravity();
  this.matter.world.setBounds(0, 0, width, height, 15);

  this.cameras.main.setBounds(0, 0, width, height);
  // this.cameras.main.setZoom(1.1);
  this.cameras.main.centerOn(width/2, height);

  this.ball = new Ball(this);
  this.player1 = new Player(this);
}

function update () {
  this.ball.update();
  this.player1.update();
  this.additionalFunctions.update(this);
}

export default {
  preload,
  create,
  update,
};
