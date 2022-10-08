import Phaser from 'phaser';

export const calculatePolygonLines = (scene, apothem = 200, sideCount = 3) => {
  const { width, height } = scene.worldbounds;
  const twoPi = 2 * Math.PI;

  // calculate the length of the polygon side
  const lengthOfSide = 2 * apothem * Math.tan(Math.PI / sideCount);
  const lineCenterX = width / 2;
  const x1 = lineCenterX - (lengthOfSide / 2);
  const x2 = lineCenterX + (lengthOfSide / 2);
  const lineCenterY = height / 2;
  const y1 = lineCenterY + apothem;
  const y2 = lineCenterY + apothem;

  const sides = Array.from({ length: sideCount }, (_, i) => {
    const line = new Phaser.Geom.Line(x1,y1, x2,y2); // line in default "bottom" position
    const angle = (twoPi / sideCount) * i;
    Phaser.Geom.Line.RotateAroundXY(line, width / 2, height / 2, angle);
    return line;
  });

  return sides;
};

class Polygon {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = scene.worldbounds;
    this.lines = [];
    this.lineGraphics = scene.add.graphics(width / 2, height / 2);
	}

  set(apothem, sideCount) {
    this.apothem = apothem;
    this.sideCount = sideCount;
    this.calculate();
	}

  calculate() {
    this.lines = calculatePolygonLines(this.scene, this.apothem, this.sideCount);
    this.draw();
	}
  
  draw() {
    this.lineGraphics.clear();
    this.lines.forEach(line => {
      this.lineGraphics.lineStyle(40, 0x110011, 1);
      this.lineGraphics.strokeLineShape(line);
    });
  }
}

export default Polygon;
