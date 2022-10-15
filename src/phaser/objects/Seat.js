import Track from './Track';
import Wall from './Wall';
import Player from './Player';

class Seat {
  constructor (scene, args) {
    this.scene = scene;
    this.redraw(args);
	}

  redraw ({ index, controlType, trackPoints, angle, goal }) {
    this.index = index;
    this.controlType = controlType;
    this.trackPoints = trackPoints;
    this.goal = goal;
    this.axisAngle = angle;

    const color = {
      local: 0x004444,
      remote: 0x440044,
      cpu: 0x222222,
    }[this.controlType];

    // draw the track
    this.track?.destroy?.();
    this.track = new Track(this.scene, this.trackPoints, color);

    // draw the wall
    this.wall?.destroy?.();
    this.wall = new Wall(this.scene, this.goal, color);

    // draw the player
    const playerConfig = {
      size: 100,
      trackPoints,
      controlType,
      color,
    };
    if (!this.player) this.player = new Player(this.scene, playerConfig);
    else this.player.redraw(playerConfig);
  }

	update () {
    this.player?.update();
	}

  destroy() {
    this.track.destroy();
    this.wall.destroy();
    this.player.destroy();
  }
}

export default Seat;
