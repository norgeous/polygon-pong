import createOscillator from '../../sound/createOscillator';

class Player {
  constructor(scene) {
    this.oscillator = createOscillator();

    const { width, height } = scene.sys.game.canvas;

    const text = scene.add.text(width/2, height-50, 'Player 1', { font: '20px Arial', fill: '#00ff00' });
    this.player = scene.matter.add.gameObject(
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
    
    this.player.name = 'player';

    // sound on collision
    this.player.setOnCollide(data => {
      this.oscillator({
        volume: data.collision.depth,
        frequency: 261.6,
      });
    });
	}

	update() {
	}
}

export default Player;
