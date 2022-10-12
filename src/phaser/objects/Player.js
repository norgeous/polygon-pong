import Phaser from 'phaser';
import createOscillator from '../../utils/createOscillator';
import Wall from './Wall';

const limit = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const getNearestPointWithinLine = (line, point) => {
  const nearestPointAlongAxis = Phaser.Geom.Line.GetNearestPoint(line, point); // can be outside of line end
  const nearestX = limit(nearestPointAlongAxis.x, line.left, line.right);
  const nearestY = limit(nearestPointAlongAxis.y, line.top, line.bottom);
  return {
    x: nearestX,
    y: nearestY,
  };
};

class Player {
  constructor(scene, index, controlType, line, angle, goal) {
    this.scene = scene;
    this.index = index;
    this.controlType = controlType;
    this.axis = line;
    this.goal = goal;
    this.axisAngle = angle;

    this.oscillatorImpact = createOscillator();
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = {};

    // the track for the player
    this.axisGraphics = scene.add.graphics(width / 2, height / 2);

    // the player graphics
    const container = scene.add.container(0, 0);
    const color = this.controlType === 'local' ? 0x008888 : 0x220022;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);
    this.text = scene.add.text(0, 0, `P${this.index}: ${this.axisAngle.toFixed(2)}r`, {
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
      .setPosition(width/2, height/2)
      .setFrictionAir(0.001)
      .setBounce(0.9)
      .setMass(100);

    // goal
    this.goalGraphics = scene.add.graphics();

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
    // if (this.controlType === 'local') {
      scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, scene);
    // }

    this.redraw();
	}

  redraw () {
    this.text.setText(`P${this.index}: ${this.axisAngle.toFixed(2)}r`);

    // draw the axis
    this.axisGraphics.clear();
    this.axisGraphics.lineStyle(6, 0x002222, 1);
    this.axisGraphics.strokeLineShape(this.axis);
    
    // instantly rotate player to new angle
    this.gameObject.setRotation(this.axisAngle);
    this.gameObject.setAngularVelocity(0);

    // draw the player's goal
    // this.goalGraphics.clear();
    // this.goalGraphics.fillStyle(0x001111, 1);
    // this.goalGraphics.fillPoints(this.goal, true);

    // physics object for the player's goal
    // const g = this.scene.matter.add.gameObject(
    //   this.goalGraphics,
    //   {
    //     shape: { type: 'fromVerts', verts: this.goal },
    //     isStatic: false,
    //   },
    // )
    //   .setFrictionAir(0.001)
    //   .setBounce(0.9)
    //   .setMass(100);

    this.goalObject?.destroy?.();
    this.goalObject = new Wall(this.scene, this.goal);
  }

	update(scene) {
    // calculate "return to track" velocity
    const nearestPoint = getNearestPointWithinLine(this.axis, this.gameObject);
    const rvx = (this.gameObject.x - nearestPoint.x) * -0.5;
    const rvy = (this.gameObject.y - nearestPoint.y) * -0.5;
    
    // player follow cursor or touch gesture
    let mvx = 0;
    let mvy = 0;
    // if (this.controlType === 'local') {
      const mv = new Phaser.Math.Vector2(this.pointer.velocity?.x || 0, this.pointer.velocity?.y || 0);
      mv.rotate(this.axisAngle); // match pointer movement vector to camera rotation
      mvx = mv.x * 0.2;
      mvy = mv.y * 0.2;
    // }

    // add pointer and return to track velocity and apply
    const vx = mvx + rvx;
    const vy = mvy + rvy;
    if (vx) this.gameObject.setVelocityX(vx);
    if (vy) this.gameObject.setVelocityY(vy);

    // slowly correct player angle (springy)
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
    // this.axisGraphics.clear();
    this.axisGraphics.destroy();
    this.gameObject.destroy();
    delete this.gameObject;

    this.goalObject?.destroy?.();
  }
}

export default Player;
