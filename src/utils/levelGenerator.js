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
    this.playerCount = playerCount < 3 ? 3 : playerCount;
    this.calculate();
	}

  calculate() {
    // const adjustedPlayerCount = ({ 1: 4, 2: 4 })[this.playerCount] || this.playerCount;
    // const polygonLines = calculatePolygonLines(this.cx,this.cy, this.trackApothem, adjustedPlayerCount);
    
    // const overrides = {
    //   1: () => [polygonLines[0]], // discard 1,2,3
    //   2: () => [polygonLines[0], polygonLines[2]], // discard 1,3
    // };
    // if (Object.keys(overrides).includes(this.playerCount.toString())) this.lines = overrides[this.playerCount]();
    // else this.lines = polygonLines;

    // this.wallInnerLines = calculatePolygonLines(this.cx,this.cy, this.wallsApothem, adjustedPlayerCount);
    // this.wallOuterLines = calculatePolygonLines(this.cx,this.cy, this.wallsOuterApothem, adjustedPlayerCount);

    // this.goals = this.wallInnerLines.map((inner, i) => {
    //   const outer = this.wallOuterLines[i];
    //   return [
    //     { x: Math.round(inner.x1), y: Math.round(inner.y1) },
    //     { x: Math.round(inner.x2), y: Math.round(inner.y2) },
    //     { x: Math.round(outer.x2), y: Math.round(outer.y2) },
    //     { x: Math.round(outer.x1), y: Math.round(outer.y1) },
    //   ];
    // });
    const trackShape = regularPolygon({
      sideLength: this.trackLength,
      sideCount: this.playerCount,
    });
    this.trackApothem = trackShape[0].y;
    const wallInnerShape = regularPolygon({
      apothem: this.trackApothem + this.trackWallGap,
      sideCount: this.playerCount,
    });
    const wallOuterShape = regularPolygon({
      apothem: wallInnerShape[0].y + this.wallDepth,
      sideCount: this.playerCount,
    });

    this.tracks = pointsToLines(trackShape).map(line => new Phaser.Geom.Line(...line));

    this.walls = pointsToShapes(wallInnerShape, wallOuterShape);
    

    this.draw();
	}
  
  draw() {
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
    //   sideCount: this.playerCount,
    // });
    // this.lineGraphics.fillPoints(shape, true);
    
    // const apothem = shape[0].y;
    // // if (maxHeight < apothem) {
      // // }
    const { height } = this.scene.scale;
    const maxHeight = (height / 2) - 100;
    const z = maxHeight / this.trackApothem;
    this.scene.cameras.main.setZoom(z);




    
    // this.graphics.fillStyle(0xFF00FF, .1);
    // const shape2 = regularPolygon({
    //   apothem: apothem,// + 100,
    //   sideCount: this.playerCount,
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
