import Ball from '../objects/Ball';
import createOscillator from '../../sound/createOscillator';

import Phaser from 'phaser';

console.log({Phaser});

const oscillator = createOscillator();

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
  // console.log(this.ball);

  const text = this.add.text(width/2, height-50, 'Player 1', { font: '20px Arial', fill: '#00ff00' });
  const player1 = this.matter.add.gameObject(
    text,
    {
      shape: { type: 'rectangle', width: 200, height: 30 },
      isStatic: false,
      chamfer: { radius: 15},
    },
  )
    .setFrictionAir(0.001)
    .setBounce(0.9)
    .setMass(100);
  player1.name = 'player';

  player1.setOnCollide(() => oscillator({
    volume: 0.5,
    frequency: 300,
  }));
}

function update () {
  console.log('UPDATE',this.ball);
  // ball min speed
  const { x, y } = this.ball.ball.body.velocity;
  if(x>0 && x<2) this.ball.ball.setVelocityX(2);
  if(x<0 && x>-2) this.ball.ball.setVelocityX(-2);
  if(y>0 && y<2) this.ball.ball.setVelocityY(2);
  if(y<0 && y>-2) this.ball.ball.setVelocityY(-2);

  this.ball.emitter.on = (x>6 || x<-6 || y>6 || y<-6);

  this.additionalFunctions.update(this);
}

export default {
  preload,
  create,
  update,
};
