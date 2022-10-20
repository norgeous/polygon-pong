import Track from './Track';
import Wall from './Wall';
import Player from './Player';

class Seat {
  constructor (scene, args) {
    this.scene = scene;
    console.log('new seat', args)
    this.redraw(args);
	}

  redraw ({ controlType, trackPoints, goal }) {
    this.controlType = controlType;
    this.trackPoints = trackPoints;
    this.goal = goal;

    const color = {
      empty: 0x111111,
      local: 0x004444,
      remote: 0x440044,
      cpu: 0x222244,
    }[this.controlType];


    // draw the wall
    this.wall?.destroy?.();
    this.wall = new Wall(this.scene, this.goal, color);

    if (this.controlType !== 'empty') {
      // draw the track
      this.track?.destroy?.();
      this.track = new Track(this.scene, this.trackPoints, color);

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
  }

	update () {
    this.player?.update();
	}

  destroy() {
    this.wall.destroy();
    this.track?.destroy?.();
    this.player?.destroy?.();
  }
}

export default Seat;
