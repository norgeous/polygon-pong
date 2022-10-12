class Wall {
  constructor(scene, points) {
    this.scene = scene;
    this.points = points;

    // https://github.com/photonstorm/phaser/issues/6178#issuecomment-1198086878
    this.body = this.scene.matter.add.fromVertices(500, 500, points);
    const bx = this.body.position.x;
    const by = this.body.position.y;
    const cx = this.body.centerOffset.x;
    const cy = this.body.centerOffset.y;

    const polyVerts = this.body.vertices.map(vert => ({ x: vert.x - bx + cx, y: vert.y - by + cy }));
    this.poly = this.scene.add.polygon(bx, by, polyVerts, 0x8d8d8d);
    this.poly.setDisplayOrigin(cx, cy);
    
    this.gameObject = this.scene.matter.add.gameObject(this.poly, this.body, false);
  }

  destroy() {
    this.body.destroy();
    this.poly.destroy();
    this.gameObject.destroy();
    // console.log('destroy called', this.gameObject);
  }
}

export default Wall;
