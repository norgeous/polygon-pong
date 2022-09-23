import createOscillator from '../../utils/createOscillator';

class Player {
  constructor(scene, controlType) {
    this.controlType = controlType;
    this.oscillator = createOscillator();
    this.oscillatorImpact = createOscillator();
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = { x:width/2, y:0 };
    
    const color = this.controlType === 'local' ? 0x007777 : 0x770077;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);

    this.player = scene.matter.add.gameObject(
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
    
    this.player.name = 'player';

    // sound on collision
    this.player.setOnCollide(data => {
      this.oscillatorImpact({
        volume: data.collision.depth / 10,
        maxVolume: scene.game.maxVolume,
        frequency: 261.63, // C4
        duration: 0.05,
      });
    });
	}

	update(scene) {
    if (!this.player) return;

    const { height } = scene.sys.game.canvas;

    // player follow cursor or touch gesture
    if (this.controlType === 'local') {
      scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, scene);
      if (this.player.x !== this.pointer.x || this.player.y !== height-40) {
        this.player.setVelocity(
          (this.pointer.x - this.player.x)/10,
          (height-100 - this.player.y)/100
        );
      }
    }

    // glide to position for remote players
    if (this.controlType === 'remote') {
      if (this.player.y !== height-40) {
        this.player.setVelocityY(
          (height-100 - this.player.y)/100
        );
      }
    }

    // slowly correct angle to flat
    const { angle, velocity, angularVelocity } = this.player.body;
    this.player.setAngularVelocity((angularVelocity-(angle/100))*.99);

    // player movement sound
    // const fv = (Math.abs((velocity.x * 100) + (angularVelocity * 500)) / 10);
    // this.oscillator({
    //   type: 'sine',
    //   volume: fv / 500,
    //   maxVolume: scene.game.maxVolume,
    //   frequency: 100 + fv,
    // });
	}

  destroy() {
    // console.log('class destroy', this.player);
    this.player?.destroy?.();
    delete this.player;
  }
}

export default Player;
