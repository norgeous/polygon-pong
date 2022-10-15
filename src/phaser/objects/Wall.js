class Wall {
  constructor(scene, points, color = 0x004444) {
    this.scene = scene;
    this.points = points;

    const midX = points.reduce((acc, { x }) => acc + x, 0) / points.length;
    const midY = points.reduce((acc, { y }) => acc + y, 0) / points.length;

    // https://github.com/photonstorm/phaser/issues/6178#issuecomment-1198086878
    this.body = this.scene.matter.add.fromVertices(scene.worldbounds.width / 2, scene.worldbounds.height / 2, points);
    const bx = this.body.position.x;
    const by = this.body.position.y;
    const cx = this.body.centerOffset.x;
    const cy = this.body.centerOffset.y;

    const polyVerts = this.body.vertices.map(vert => ({ x: vert.x - bx + cx, y: vert.y - by + cy }));
    this.poly = this.scene.add.polygon(bx, by, polyVerts, color);
    this.poly.setDisplayOrigin(cx, cy);
    
    this.gameObject = this.scene.matter.add.gameObject(this.poly, this.body, false);
    this.gameObject.x = midX;
    this.gameObject.y = midY;
    this.gameObject.setStatic(true);
  }

  destroy () {
    this.body.destroy();
    this.poly.destroy();
    this.gameObject.destroy();
  }
}

export default Wall;
