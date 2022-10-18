import Phaser from 'phaser';

export const calculatePolygonLines = (cx,cy, apothem = 200, sideCount = 3) => {
  const twoPi = 2 * Math.PI;

  // calculate the length of the polygon side
  const lengthOfSide = 2 * apothem * Math.tan(Math.PI / sideCount);
  const x1 = cx - (lengthOfSide / 2);
  const x2 = cx + (lengthOfSide / 2);
  const y1 = cy + apothem;
  const y2 = cy + apothem;

  const sides = Array.from({ length: sideCount }, (_, i) => {
    const line = new Phaser.Geom.Line(x1,y1, x2,y2); // line in default "bottom" position
    const angle = (twoPi / sideCount) * i;
    Phaser.Geom.Line.RotateAroundXY(line, cx, cy, angle);
    return line;
  });

  return sides;
};

const calculatePolygonLines2 = (cx,cy, sideLength, sideCount) => {
  const radius = sideLength / (2 * Math.sin(Math.PI / sideCount));
  const sides = Array.from({ length: sideCount }, (_, i) => ({
    x: Math.round(cx + radius * Math.sin(Math.PI / sideCount * (1+2 * i))),
    y: Math.round(cy + radius * Math.cos(Math.PI / sideCount * (1+2 * i))),
  }));
  console.log({sideCount,radius,sides, apothem: sides[0].y});
  return sides;
};

class Polygon {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = scene.worldbounds;

    this.cx = width / 2;
    this.cy = height / 2;
    this.lines = [];
    this.walls = [];
    this.lineGraphics = scene.add.graphics(width / 2, height / 2);
	}

  set(trackApothem, wallsApothem, wallsOuterApothem, playerCount) {
    this.trackApothem = trackApothem;
    this.wallsApothem = wallsApothem;
    this.wallsOuterApothem = wallsOuterApothem;
    this.playerCount = playerCount;
    this.calculate();
	}

  calculate() {
    const adjustedPlayerCount = ({ 1: 4, 2: 4 })[this.playerCount] || this.playerCount;
    const polygonLines = calculatePolygonLines(this.cx,this.cy, this.trackApothem, adjustedPlayerCount);
    
    const overrides = {
      1: () => [polygonLines[0]], // discard 1,2,3
      2: () => [polygonLines[0], polygonLines[2]], // discard 1,3
    };
    if (Object.keys(overrides).includes(this.playerCount.toString())) this.lines = overrides[this.playerCount]();
    else this.lines = polygonLines;

    // this.newPoly = calculatePolygonLines2(this.cx,this.cy, 100, 4); // NEW!!
    this.wallInnerLines = calculatePolygonLines(this.cx,this.cy, this.wallsApothem, adjustedPlayerCount);
    this.wallOuterLines = calculatePolygonLines(this.cx,this.cy, this.wallsOuterApothem, adjustedPlayerCount);

    this.goals = this.wallInnerLines.map((inner, i) => {
      const outer = this.wallOuterLines[i];
      return [
        { x: Math.round(inner.x1), y: Math.round(inner.y1) },
        { x: Math.round(inner.x2), y: Math.round(inner.y2) },
        { x: Math.round(outer.x2), y: Math.round(outer.y2) },
        { x: Math.round(outer.x1), y: Math.round(outer.y1) },
      ];
    });

    this.draw();
	}
  
  draw() {
    this.lineGraphics.clear();

    this.lineGraphics.lineStyle(40, 0x110011, 1);
    this.lines.forEach(line => this.lineGraphics.strokeLineShape(line));
    
    this.lineGraphics.fillStyle(0x001111, 1);
    this.goals.forEach(goal => this.lineGraphics.fillPoints(goal, true));
    
    this.lineGraphics.fillStyle(0xFF0000, 1);
    this.lineGraphics.fillPoints(calculatePolygonLines2(0,0, 1, 40), true);
    
    this.lineGraphics.fillStyle(0xFFFF00, .1);
    const shape = calculatePolygonLines2(0,0, 600, this.playerCount);
    const apothem = shape[0].y;
    this.lineGraphics.fillPoints(shape, true);

    const { height } = this.scene.scale;
    const maxHeight = (height / 2) - 100;
    // if (maxHeight < apothem) {
      const z = maxHeight / apothem;
      this.scene.cameras.main.setZoom(z);
    // }
  }
}

export default Polygon;
