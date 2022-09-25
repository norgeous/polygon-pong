import createOscillator from '../../utils/createOscillator';

class Player {
  constructor(scene, id, controlType) {
    this.id = id;
    this.controlType = controlType;
    this.oscillator = createOscillator();
    this.oscillatorImpact = createOscillator();
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = { x:width/2, y:0 };
    
    const color = this.controlType === 'local' ? 0x007777 : 0x770077;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);

    this.gameObject = scene.matter.add.gameObject(
      graphics,
      {
        shape: { type: 'rectangle', width: 200, height: 30 },
        isStatic: false,
        chamfer: { radius: 15 },
      },
    )
      .setPosition(width/2, height-100)
      .setFrictionAir(0.001)
      .setBounce(0.9)
      .setMass(100);
    
    this.gameObject.name = 'player';

    // sound on collision
    this.gameObject.setOnCollide(data => {
      this.oscillatorImpact({
        volume: data.collision.depth / 10,
        maxVolume: scene.game.maxVolume,
        frequency: 261.63, // C4
        duration: 0.05,
      });
    });
	}

	update(scene) {
    if (!this.gameObject) return;

    const { height } = scene.sys.game.canvas;

    // player follow cursor or touch gesture
    if (this.controlType === 'local') {
      scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, scene);
      if (this.gameObject.x !== this.pointer.x || this.gameObject.y !== height-40) {
        this.gameObject.setVelocity(
          (this.pointer.x - this.gameObject.x)/10,
          (height-100 - this.gameObject.y)/100
        );
      }
    }

    // glide to position for remote players
    if (this.controlType === 'remote') {
      if (this.gameObject.y !== height-40) {
        this.gameObject.setVelocityY(
          (height-100 - this.gameObject.y)/100
        );
      }
    }

    // slowly correct angle to flat
    const { angle, angularVelocity } = this.gameObject.body;
    this.gameObject.setAngularVelocity((angularVelocity-(angle/100))*.99);
	}


  getState() {
    const id = this.id;
    const { x, y } = this.gameObject;
    const { x: vx, y: vy } = this.gameObject.body.velocity;
    const { angle: a, angularVelocity: va } = this.gameObject.body;
    return { id, x, y, a, vx, vy, va };
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

export default Player;
