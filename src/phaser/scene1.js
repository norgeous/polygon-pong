function preload () {
  this.load.setBaseURL('https://labs.phaser.io');
  this.load.image('sky', 'assets/skies/space3.png');
  // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/fire1.png');
}

const getConfig = ({ setScore }) => {
  const width = window.innerWidth * window.devicePixelRatio;
  const height = window.innerHeight * window.devicePixelRatio;

  function create () {
    this.add.image(width/2, height/2, 'sky');
    const particles = this.add.particles('red');
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    });

    const logo = this.add.text(width/2, height/4, '🥴', { font: '50px Arial', align: 'center' }).setOrigin(0.5);
    this.physics.world.enable(logo);
    logo.body.setCircle(26, 5);
    logo.body.setBounce(1, 1);
    logo.body.setVelocity(0, -200);
    logo.body.setMaxVelocity(500);
    logo.body.collideWorldBounds = true;
    logo.body.onWorldBounds = true;
    emitter.startFollow(logo);

    const player = this.add.rectangle(
      this.physics.world.bounds.width/2,
      this.physics.world.bounds.height - 200,
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

    this.physics.world.on('worldbounds', thing => {
      // console.log(thing);
      setScore(s => s + 1);
    });
  }

  // function update () {
  //   game.physics.arcade.collide(frog, layer, function(f, t) {
  //     // -------------------------------------------
  //     // don't do this!
  //     // the sound plays almost all the time!
  //     // -------------------------------------------
  //     // thudSound.play();
  //   });
  // }

  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'phaser',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width,
      height,
    },
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        gravity: { y: 200 }
      }
    },
    scene: {
      preload,
      create,
      // update,
    }
  };

  return config;
};

export default getConfig;
