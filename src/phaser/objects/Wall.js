class Wall {
  constructor(scene, points, color = 0x004444) {
    this.scene = scene;
    this.points = points;

    const smallestX = points.reduce((acc, { x }) => x < acc ? x : acc, Infinity);
    const smallestY = points.reduce((acc, { y }) => y < acc ? y : acc, Infinity);

    // https://github.com/photonstorm/phaser/issues/6178#issuecomment-1198086878
    this.body = this.scene.matter.add.fromVertices(0, 0, points);
    const comx = this.body.centerOffset.x;
    const comy = this.body.centerOffset.y;

    const polyVerts = this.body.vertices.map(vert => ({
      x: vert.x + comx,
      y: vert.y + comy,
    }));
    this.poly = this.scene.add.polygon(0, 0, polyVerts, color);
    
    this.gameObject = this.scene.matter.add.gameObject(this.poly, this.body, false);
    this.gameObject.x = smallestX + comx;
    this.gameObject.y = smallestY + comy;
    this.gameObject.setStatic(true);
    this.gameObject.body.label = 'wall';
  }

  destroy () {
    this.body.destroy();
    this.poly.destroy();
    this.gameObject.destroy();
  }
}

export default Wall;
