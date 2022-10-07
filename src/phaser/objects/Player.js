import Phaser from 'phaser';
import createOscillator from '../../utils/createOscillator';

class Player {
  constructor(scene, id, controlType) {
    this.id = id;
    this.controlType = controlType;
    this.oscillator = createOscillator();
    this.oscillatorImpact = createOscillator();
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = { x:width/2, y:0 };


    const graphics3 = scene.add.graphics(250, 250);
    graphics3.lineStyle(2, 0xffff00, 1);
    this.line = new Phaser.Geom.Line(100,450, 400,450);
    const rads = Phaser.Math.DegToRad(45);
    Phaser.Geom.Line.RotateAroundXY(this.line, 250, 250, rads);
    graphics3.strokeLineShape(this.line);
    
        
    const container = scene.add.container(0, 0);
    const color = this.controlType === 'local' ? 0x008888 : 0x220022;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);
    const text = scene.add.text(0, 0, 'P1', {
      font: '30px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    container.add([graphics, text]);


    this.gameObject = scene.matter.add.gameObject(
      container,
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


    const playerCount = 3;
    for (let i=0; i<playerCount; i++) {
      const graphics2 = scene.add.graphics(250, 250);
      graphics2.lineStyle(2, i?0x00ffff:0x00ff00, 1);
      const line2 = new Phaser.Geom.Line(100,450, 400,450);
      const rads2 = Phaser.Math.DegToRad((360/playerCount)*i);
      Phaser.Geom.Line.RotateAroundXY(line2, 250, 250, rads2);
      graphics2.strokeLineShape(line2);
    }



    // if local, start listening for mousemove / swipes
    if (this.controlType === 'local') {
      scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, scene);
    }
	}

	update(scene) {
    if (!this.gameObject) return;

    const { height } = scene.sys.game.canvas;

    // player follow cursor or touch gesture
    if (this.controlType === 'local') {

      if (this.gameObject.x !== this.pointer.x || this.gameObject.y !== height-40) {
        const nearestPoint = Phaser.Geom.Line.GetNearestPoint(this.line, {x:this.gameObject.x,y:this.gameObject.y});
        const distance = Phaser.Math.Distance.BetweenPoints(this.gameObject, nearestPoint);
        const direction = Math.atan((nearestPoint.x - this.gameObject.x) / (nearestPoint.y - this.gameObject.y));
        const speed = nearestPoint.y >= this.gameObject.y ? 1 : -1;
        const speed2 = speed * (distance/2||0);
        const vx = (speed2 * Math.sin(direction)) + (this.pointer.velocity?.x/5||0);
        const vy = (speed2 * Math.cos(direction)) + (this.pointer.velocity?.y/5||0);
        if (vx && vy) this.gameObject.setVelocity(vx, vy);
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
    this.gameObject.setAngularVelocity(((angularVelocity-(angle/100))*.99));
	}


  getState() {
    const id = this.id;
    const type = this.controlType;
    const { x, y } = this.gameObject;
    const { x: vx, y: vy } = this.gameObject.body.velocity;
    const { angle: a, angularVelocity: va } = this.gameObject.body;
    return { id, type, x, y, a, vx, vy, va };
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
