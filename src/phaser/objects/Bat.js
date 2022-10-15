class Bat {
  constructor(scene, {size, color, label}) {
    this.scene = scene;
    this.size = size;
    this.color = color;
    this.label = label;
    
    const { width, height } = scene.sys.game.canvas;
    this.pointer = {};

    // the bat graphics
    const container = scene.add.container(0, 0);
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);

    // text on bat
    this.text = scene.add.text(0, 0, this.label, {
      font: '30px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);

    // combine rounded rect and text into container
    container.add([graphics, this.text]);

    // physics object for bat
    this.gameObject = scene.matter.add.gameObject(
      container,
      {
        shape: { type: 'rectangle', width: 200, height: 30 },
        isStatic: false,
        chamfer: { radius: 15 },
      },
    )
      .setPosition(width/2, height/2)
      .setFrictionAir(0.001)
      .setBounce(0.9)
      .setMass(100);
	}

  destroy() {
    this.gameObject.destroy();
  }
}

export default Bat;
