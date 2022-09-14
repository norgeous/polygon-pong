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
      .setVelocity(0, -4)
      .setFrictionAir(0.001)
      .setBounce(0.5)
      .setMass(10);

    // sound on collision
    this.ball.setOnCollide(data => this.oscillator({
      volume: data.collision.depth / 10,
      maxVolume: scene.game.maxVolume,
      frequency: 440, // A4
      duration: 0.05,
    }));

    // emitter follow ball
    this.emitter.startFollow(ball);
	}

	update() {
    // ball min speed
    const minVelocity = 5;
    const { x: vx, y: vy } = this.ball.body.velocity;
    const speed = Math.hypot(vx, vy);
    if (speed < minVelocity-0.01) {
      const angle = Math.atan2(vy, vx);
      const newVx = Math.cos(angle) * minVelocity;
      const newVy = Math.sin(angle) * minVelocity;
      this.ball.setVelocity(newVx,newVy);
    }


    // if velocity is fast, emit particle effect
    this.emitter.on = (vx>6 || vx<-6 || vy>6 || vy<-6);
	}
}

export default Ball;
