import Phaser from 'phaser';
import createOscillator from '../../utils/createOscillator';
import Bat from './Bat';

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
  constructor(scene, args) {
    this.scene = scene;
    this.oscillatorImpact = createOscillator();
    this.pointer = {};

    this.redraw(args);
	}

  redraw ({ size, label, trackPoints, controlType }) {
    this.size = size;
    this.label = label;
    this.trackPoints = trackPoints;
    this.controlType = controlType;

    const { x1, y1, x2, y2 } = this.trackPoints;
    this.trackPointsAngle = Phaser.Math.Angle.Between(x1, y1, x2, y2);

    const color = this.controlType === 'local' ? 0x008888 : 0x220022;

    // if local, start listening for mousemove / swipes
    if (this.controlType === 'local') {
      this.scene.input.on('pointermove', (pointer) => { this.pointer = pointer; }, this.scene);
    }

    // update bat
    this.bat?.destroy?.();
    this.bat = new Bat(this.scene, {
      size: 100,
      color,
      label: `${this.controlType} P${this.label}: ${this.trackPointsAngle.toFixed(1)}r`,
    });

    // sound on bat collision
    this.bat.gameObject.setOnCollide(data => {
      this.oscillatorImpact({
        volume: data.collision.depth / 10,
        maxVolume: this.scene.game.maxVolume,
        frequency: 261.63, // C4
        duration: 0.1,
      });
    });
    
    // instantly rotate bat to new angle
    this.bat.gameObject.setRotation(this.trackPointsAngle);
    this.bat.gameObject.setAngularVelocity(0);
    this.bat.gameObject.setBounce(0.9);
  }

	update() {
    // calculate "return to track" velocity
    const nearestPoint = getNearestPointWithinLine(this.trackPoints, this.bat.gameObject);
    const rvx = (this.bat.gameObject.x - nearestPoint.x) * -0.5;
    const rvy = (this.bat.gameObject.y - nearestPoint.y) * -0.5;
    
    // player follow cursor or touch gesture
    let mvx = 0;
    let mvy = 0;
    if (this.controlType === 'local') {
      const mv = new Phaser.Math.Vector2(this.pointer.velocity?.x || 0, this.pointer.velocity?.y || 0);
      mv.rotate(this.trackPointsAngle); // match pointer movement vector to camera rotation
      mvx = mv.x * 0.2;
      mvy = mv.y * 0.2;
    }

    // add pointer and return to track velocity and apply
    const vx = mvx + rvx;
    const vy = mvy + rvy;
    if (vx) this.bat.gameObject.setVelocityX(vx);
    if (vy) this.bat.gameObject.setVelocityY(vy);

    // slowly correct player angle (springy)
    const { angle, angularVelocity } = this.bat.gameObject.body;
    const diff = this.trackPointsAngle - angle;
    const newAv = (angularVelocity + (diff / 100)) * 0.99;
    this.bat.gameObject.setAngularVelocity(newAv);
	}

  getState() {
    const id = this.id;
    const type = this.controlType;
    const { x, y } = this.bat.gameObject;
    const { x: vx, y: vy } = this.bat.gameObject.body.velocity;
    const { angle: a, angularVelocity: va } = this.bat.gameObject.body;
    return { id, type, x, y, a, vx, vy, va };
  }

  setState({ x, y, a, vx, vy, va }) {
    this.bat.gameObject.x = x;
    this.bat.gameObject.y = y;
    this.bat.gameObject.setRotation(a);
    this.bat.gameObject.setVelocity(vx, vy);
    this.bat.gameObject.setAngularVelocity(va);
  }

  destroy() {
    this.bat.gameObject.destroy();
    delete this.bat.gameObject;
  }
}

export default Player;
