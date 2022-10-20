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
    
    this.graphics.clear();

    // this.lineGraphics.lineStyle(40, 0x110011, 1);
    // this.lines.forEach(line => this.lineGraphics.strokeLineShape(line));
    
    // this.lineGraphics.fillStyle(0x001111, 1);
    // this.goals.forEach(goal => this.lineGraphics.fillPoints(goal, true));
    
    // this.lineGraphics.fillStyle(0xFF0000, 1);
    // this.lineGraphics.fillPoints(calculatePolygonLines2(0,0, 1, 40), true);
    
    // this.lineGraphics.fillStyle(0xFFFF00, .1);
    // const shape = regularPolygon({
    //   sideLength: 600,
    //   sideCount: this.seatCount,
    // });
    // this.lineGraphics.fillPoints(shape, true);
    
    // this.graphics.fillStyle(0xFF00FF, .1);
    // const shape2 = regularPolygon({
    //   apothem: apothem,// + 100,
    //   sideCount: this.seatCount,
    // });
    // this.graphics.fillPoints(shape2, true);

    // const lines = pointsToLines(shape2);
    // lines
    //   .map(line => new Phaser.Geom.Line(...line))
    //   .forEach((line, i) => {
    //     this.graphics.lineStyle(i*10, 0xFFFF00, (i*.1)+.1);
    //     this.graphics.strokeLineShape(line);
    //   });
  }
}

export default Level;
