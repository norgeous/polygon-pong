import createOscillator from '../../utils/createOscillator';
import { ballEmojis } from '../../utils/emoji';

class Ball {
  constructor(scene, id, emojiId) {
    this.id = id;
    this.emojiId = emojiId;
    this.oscillator = createOscillator();
  
    // create ball
    this.text = scene.add.text(
      0,
      0,
      ballEmojis[this.emojiId],
      { font: '50px Arial', align: 'center' },
    ).setOrigin(0.5);

    this.gameObject = scene.matter.add.gameObject(
      this.text,
      { shape: { type: 'circle', radius: 26 }},
      // {
      //   shape: { type: 'rectangle', width: 52, height: 52 }, 
      //   chamfer: { radius: 15 },
      // },
    );
    this.gameObject
      .setVelocity(0, -4)
      .setFrictionAir(0.001)
      .setBounce(0.5)
      .setMass(10);
    this.gameObject.body.label = 'ball';

    // sound on collision
    this.gameObject.setOnCollide(data => this.oscillator({
      volume: data.collision.depth / 10,
      maxVolume: scene.game.maxVolume,
      frequency: 440, // A4
      duration: 0.05,
    }));

    // speeding emitter
    this.emitter = scene.particles.red.createEmitter({
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    });

    // emitter follow ball
    this.emitter.startFollow(this.text);
	}

	update() {
    // ball min speed
    const minVelocity = 5;
    const { x: vx, y: vy } = this.gameObject.body.velocity;

    const speed = Math.hypot(vx, vy);

    if (speed < minVelocity) {
      const angle = Math.atan2(vy, vx);
      const newVx = Math.cos(angle) * minVelocity;
      const newVy = Math.sin(angle) * minVelocity;
      this.gameObject.setVelocity(newVx,newVy);
    }

    // if velocity is fast, emit particle effect
    this.emitter.on = speed > 6;

    // this.text.setText(Math.round(speed));
	}

  getState() {
    const id = this.id;
    const emojiId = this.emojiId;
    const { x, y } = this.gameObject;
    const { x: vx, y: vy } = this.gameObject.body.velocity;
    const { angle: a, angularVelocity: va } = this.gameObject.body;
    return { id, emojiId, x, y, a, vx, vy, va };
  }

  setState({ x, y, a, vx, vy, va }) {
    this.gameObject.x = x;
    this.gameObject.y = y;
    this.gameObject.setRotation(a);
    this.gameObject.setVelocity(vx, vy);
    this.gameObject.setAngularVelocity(va);
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default Ball;
