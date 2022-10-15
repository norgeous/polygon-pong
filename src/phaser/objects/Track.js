class Track {
  constructor(scene, line, color = 0x222222) {
    this.scene = scene;
    this.line = line;
    this.color = color;

    // the track for the player
    this.axisGraphics = this.scene.add.graphics(width / 2, height / 2);

    this.redraw();
	}

  redraw () {
    // draw the axis
    this.axisGraphics.clear();
    this.axisGraphics.lineStyle(6, this.color, 1);
    this.axisGraphics.strokeLineShape(this.line);
    this.axisGraphics.setDepth(0);
  }

  destroy () {
    this.axisGraphics.destroy();
  }
}

export default Track;
