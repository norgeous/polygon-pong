import createOscillator from '../../sound/createOscillator';

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

  const particles = this.add.particles('red');
  this.emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 0.25, end: 0 },
    blendMode: 'ADD'
  });







  const ball = this.add.text(width/2, height/4, Math.random()>.5?'🥴':'🤕', { font: '50px Arial', align: 'center' }).setOrigin(0.5);
  this.emitter.startFollow(ball);

  this.ball = this.matter.add.gameObject(ball, { shape: { type: 'circle', radius: 26 }});
  this.ball
    .setFrictionAir(0.0001)
    .setBounce(.5)
    .setVelocity(20);
  this.ball.setOnCollide(() => oscillator({
    volume: 0.5,
    frequency: 440,
  }));


  const text = this.add.text(width/2, height-50, 'P1', { font: '20px Arial', fill: '#00ff00' });
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
  // ball min speed
  const { x, y } = this.ball.body.velocity;
  if(x>0 && x<2) this.ball.setVelocityX(2);
  if(x<0 && x>-2) this.ball.setVelocityX(-2);
  if(y>0 && y<2) this.ball.setVelocityY(2);
  if(y<0 && y>-2) this.ball.setVelocityY(-2);

  console.log(this.emitter);
  if (x>4 || x<-4 || y>4 || y<-4) this.emitter.on = true;
  else this.emitter.on = false;


  this.additionalFunctions.update(this);
}

export default {
  preload,
  create,
  update,
};
