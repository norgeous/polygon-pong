import Phaser from 'phaser';

class Game extends Phaser.Scene {

  constructor (handle) {
    super(handle);
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    // this.load.image('sky', 'assets/skies/space3.png');
    // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/fire1.png');
  }

  create () {
    // this.add.image(width/2, height/2, 'sky');
    const particles = this.add.particles('red');
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    });

    const { width, height } = this.sys.game.canvas;

    const logo = this.add.text(width/2, height/4, '🥴', { font: '50px Arial', align: 'center' }).setOrigin(0.5);
    this.physics.world.enable(logo);
    logo.body.setCircle(26, 5);
    logo.body.setBounce(1, 1);
    logo.body.setVelocity(100, -200);
    logo.body.setMaxVelocity(500);
    logo.body.collideWorldBounds = true;
    logo.body.onWorldBounds = true;
    emitter.startFollow(logo);

    const player = this.add.rectangle(
      this.physics.world.bounds.width/2,
      this.physics.world.bounds.height - 25,
      150, 20,
      0x6666ff,
    );    
    this.physics.add.existing(player);
    player.name = 'player';
    player.body.setBounce(1, 1);
    player.body.setImmovable();
    player.body.setAllowGravity(false);
    // player.body.setGravity(false);
    player.body.collideWorldBounds = true;

    this.physics.add.collider(player, logo);

    // this.physics.world.on('worldbounds', thing => {
    //   // console.log(thing);
    //   setScore(s => s + 1);
    // });
  }
}

export default Game;
