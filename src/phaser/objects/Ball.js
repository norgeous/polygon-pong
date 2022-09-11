import createOscillator from '../../sound/createOscillator';

class Ball {
  constructor(scene) {
    this.oscillator = createOscillator();

    const { width, height } = scene.sys.game.canvas;

    // speeding emitter
    const particles = scene.add.particles('red');
    this.emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    });
  
    // create ball
    const ball = scene.add.text(
      width/2,
      height/4,
      Math.random()>.5?'🥴':'🤕',
      { font: '50px Arial', align: 'center' },
    ).setOrigin(0.5);
    this.ball = scene.matter.add.gameObject(
      ball,
      { shape: { type: 'circle', radius: 26 }},
    );
    this.ball
      .setFrictionAir(0.0001)
      .setBounce(.5)
      .setMass(50);

    // sound on collision
    this.ball.setOnCollide(data => this.oscillator({
      volume: data.collision.depth,
      frequency: 440,
    }));

    // emitter follow ball
    this.emitter.startFollow(ball);
	}

	update() {
    // ball min speed
    const { x, y } = this.ball.body.velocity;
    if(x>=0 && x<=2) this.ball.setVelocityX(2);
    if(x<=0 && x>=-2) this.ball.setVelocityX(-2);
    if(y>=0 && y<=2) this.ball.setVelocityY(2);
    if(y<=0 && y>=-2) this.ball.setVelocityY(-2);

    // if velocity is fast, emit particle effect
    this.emitter.on = (x>6 || x<-6 || y>6 || y<-6);
	}
}

export default Ball;
