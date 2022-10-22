import Phaser from 'phaser';
import { regularPolygon, pointsToLines, pointsToShapes } from './regularPolygonUtils';

class Level {
  constructor(scene) {
    this.scene = scene;

    this.tracks = [];
    this.walls = [];
    this.graphics = scene.add.graphics(0, 0);
	}

  set({ trackLength, trackWallGap, wallDepth, playerCount }) {
    this.trackLength = trackLength;
    this.trackWallGap = trackWallGap;
    this.wallDepth = wallDepth;
    this.seatCount = playerCount < 3 ? 4 : playerCount;
    this.calculate();
	}

  calculate() {
    const trackShape = regularPolygon({
      sideLength: this.trackLength,
      sideCount: this.seatCount,
    });
    this.trackApothem = trackShape[0].y;
    const wallInnerShape = regularPolygon({
      apothem: this.trackApothem + this.trackWallGap,
      sideCount: this.seatCount,
    });
    const wallOuterShape = regularPolygon({
      apothem: wallInnerShape[0].y + this.wallDepth,
      sideCount: this.seatCount,
    });

    this.tracks = pointsToLines(trackShape).map(line => new Phaser.Geom.Line(...line));
    this.walls = pointsToShapes(wallInnerShape, wallOuterShape);

    this.draw();
	}
  
  draw() {
    // zoom camera
    const { height } = this.scene.scale;
    const maxHeight = (height / 2) - 100;
    if (maxHeight < this.trackApothem) {
      const z = maxHeight / this.trackApothem;
      this.scene.cameras.main.setZoom(z);
    }
    
    // this.scene.cameras.main.setZoom(0.7);
    this.graphics.clear();

    this.graphics.setDepth(1);

    this.graphics.lineStyle(40, 0xFFFF00, .2);
    this.tracks.forEach(track => this.graphics.strokeLineShape(track));
    
    this.graphics.fillStyle(0xFFFF00, .2);
    this.walls.forEach(wall => this.graphics.fillPoints(wall, true));
  }
}

export default Level;
