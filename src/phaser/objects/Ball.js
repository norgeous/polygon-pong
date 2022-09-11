import createOscillator from '../../sound/createOscillator';

export default class Ball {
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
      .setVelocity(20);

    // sound on collision
    this.ball.setOnCollide(() => this.oscillator({
      volume: 0.5,
      frequency: 440,
    }));

    // emitter follow ball
    this.emitter.startFollow(ball);
  
		// world.scene.add.existing(this);
	}

	update() {
		// const speed = 10
		// if (cursors.left?.isDown)
		// {
		// 	this.x -= speed
			
		// }
		// else if (cursors.right?.isDown)
		// {
		// 	this.x += speed
		// }

		// if (this.ball)
		// [
		// 	this.ball.x = this.x
		// ]
	}
}
