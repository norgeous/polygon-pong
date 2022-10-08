import { calculatePolygonLines } from '../utils';

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
      this.lineGraphics.lineStyle(40, 0xff00ff, .1);
      this.lineGraphics.strokeLineShape(line);
    });
  }
}

export default Polygon;
