import Phaser from 'phaser';
import createOscillator from '../../utils/createOscillator';

const limit = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const getNearestPointWithinLine = (line, point) => {
  const nearestPointAlongAxis = Phaser.Geom.Line.GetNearestPoint(line, point);
  const nearestX = limit(nearestPointAlongAxis.x, line.left, line.right);
  const nearestY = limit(nearestPointAlongAxis.y, line.top, line.bottom);
  return {
    x: nearestX,
    y: nearestY,
  };
};

class Player {
  constructor(scene, id, controlType) {
    this.id = id;
    this.index = 0;
    this.controlType = controlType;
    this.oscillator = createOscillator();
    this.oscillatorImpact = createOscillator();
    this.axisAngle = 0;
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = { x:width/2, y:0 };

    // the track for the player
    this.axisGraphics = scene.add.graphics(250, 250);
    this.axis = new Phaser.Geom.Line(100,400, 400,400);

    // the player
    const container = scene.add.container(0, 0);
    const color = this.controlType === 'local' ? 0x008888 : 0x220022;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);
    this.text = scene.add.text(0, 0, 'P1', {
      font: '30px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    container.add([graphics, this.text]);


    // physics object for player
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
        duration: 0.1,
      });
    });

    // if local, start listening for mousemove / swipes
    if (this.controlType === 'local') {
      scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, scene);
    }

    this.index = 0;
    this.updateAxisAngle(scene, 1);
	}

  updateAxisAngle(scene, playerCount) {
    const { width, height } = scene.sys.game.canvas;
    const twoPi = 2 * Math.PI;
    this.axisAngle = (twoPi / playerCount) * this.index;
    Phaser.Geom.Line.RotateAroundXY(this.axis, width/2, height/2, this.axisAngle);
    this.axisGraphics.clear();
    this.axisGraphics.lineStyle(6, 0x222200, 1);
    this.axisGraphics.strokeLineShape(this.axis);

    this.gameObject.setRotation(this.axisAngle);
    this.gameObject.setAngularVelocity(0);
    this.text.setText(`P${this.index}: ${this.axisAngle.toFixed(2)}r`);
  }

	update(scene) {
    if (!this.gameObject) return;

    // player follow cursor or touch gesture
    if (this.controlType === 'local') {
      const nearestPoint = getNearestPointWithinLine(this.axis, this.gameObject);

      const mv = new Phaser.Math.Vector2(this.pointer.velocity?.x || 0, this.pointer.velocity?.y || 0);
      mv.rotate(this.axisAngle); // match pointer movement vector to camera rotation

      const mvx = mv.x * 0.2;
      const mvy = mv.y * 0.2;
      const rvx = (this.gameObject.x - nearestPoint.x) * -0.5;
      const rvy = (this.gameObject.y - nearestPoint.y) * -0.5;
      const vx = mvx + rvx;
      const vy = mvy + rvy;
      if (vx) this.gameObject.setVelocityX(vx);
      if (vy) this.gameObject.setVelocityY(vy);
    }

    // glide to position for remote players
    // if (this.controlType === 'remote') {
    //   if (this.gameObject.y !== height-40) {
    //     this.gameObject.setVelocityY(
    //       (height-100 - this.gameObject.y)/100
    //     );
    //   }
    // }

    // slowly correct angle
    const { angle, angularVelocity } = this.gameObject.body;
    const diff = this.axisAngle - angle;
    const newAv = (angularVelocity + (diff / 100)) * 0.99;
    this.gameObject.setAngularVelocity(newAv);
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
