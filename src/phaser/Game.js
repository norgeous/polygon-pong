import Phaser from 'phaser';

class Game extends Phaser.Scene {

  constructor (handle) {
    super(handle);
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/fire1.png');
    // this.load.image('sky', 'assets/skies/space3.png');
    // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  }

  create () {
    const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, 15);
    this.cameras.main.setBounds(0, 0, width, height);


    // this.cameras.main.setZoom(1.1);
    this.cameras.main.centerOn(width/2, height);

    // this.add.image(width/2, height/2, 'sky');
    const particles = this.add.particles('red');
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.25, end: 0 },
      blendMode: 'ADD'
    });





    const ball = this.add.text(width/2, height/4, '🥴', { font: '50px Arial', align: 'center' }).setOrigin(0.5);
    emitter.startFollow(ball);
    // this.physics.world.enable(ball);
    // ball.body.setCircle(26, 5);
    // ball.body.setBounce(1, 1);
    // ball.body.setVelocity(100, -200);
    // ball.body.setMaxVelocity(500);
    // ball.body.collideWorldBounds = true;
    // ball.body.onWorldBounds = true;

    this.ball = this.matter.add.gameObject(ball, { shape: { type: 'circle', radius: 26 }});
    this.ball
      .setFrictionAir(0.0001)
      .setBounce(.5)
      .setVelocity(20);


    // const matterText = this.matter.add.gameObject(ball, { shape: { type: 'circle', radius: 64 } })
    //   .setFrictionAir(0.001)
    //   .setBounce(0.9)
    //   .setCollideWorldBounds(true);
    // var matterText2 = this.matter.add.gameObject(text2).setFrictionAir(0.001).setBounce(0.9);



    // const player = this.add.rectangle(
    //   this.physics.world.bounds.width/2,
    //   this.physics.world.bounds.height - 25,
    //   150, 20,
    //   0x6666ff,
    // );    
    // this.physics.add.existing(player);
    // player.name = 'player';
    // // player.body.setBounce(1, 1);
    // player.body.setImmovable();
    // player.body.setAllowGravity(false);
    // // player.body.setGravity(false);
    // player.body.collideWorldBounds = true;





    // this.physics.add.collider(player, ball);
    // this.cameras.main.startFollow(player, false, 0.2, 0.2);

    // this.physics.world.on('worldbounds', thing => {
    //   // console.log(thing);
    //   setScore(s => s + 1);
    // });
    var text = this.add.text(100, 0, 'Phaser 3', { font: '32px Arial', fill: '#00ff00' });
    var matterText = this.matter.add.gameObject(text, { shape: { type: 'polygon', sides: 8, radius: 64 } })
      .setFrictionAir(0.001)
      .setBounce(0.9);
  }

  update () {
    // console.log(this.ball.body.velocity)

    // ball min speed
    const { x, y } = this.ball.body.velocity;
    if(x>0 && x<5) this.ball.setVelocityX(2);
    if(x<0 && x>-5) this.ball.setVelocityX(-2);
    if(y>0 && y<5) this.ball.setVelocityY(2);
    if(y<0 && y>-5) this.ball.setVelocityY(-2);

  }
}

export default Game;
