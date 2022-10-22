class Bat {
  constructor(scene, { size, color, label }) {
    this.scene = scene;

    this.size = size;
    this.color = color;
    this.label = label;
    
    // the bat graphics
    const container = this.scene.add.container(0, 0);
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-100, -15, 200, 30, 15);

    // text on bat
    this.text = this.scene.add.text(0, 0, this.label, {
      font: '26px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);

    // combine graphics and text into container
    container.add([graphics, this.text]);

    // physics object for bat
    this.gameObject = this.scene.matter.add.gameObject(
      container,
      {
        shape: { type: 'rectangle', width: 200, height: 30 },
        isStatic: false,
        chamfer: { radius: 15 },
      },
    )
      .setFrictionAir(0.001)
      .setBounce(0.9)
      .setMass(100);
    this.gameObject.body.label = 'bat';
	}

  setText(newText) {
    this.text.setText(newText);
  }

  destroy() {
    this.gameObject.destroy();
  }
}

export default Bat;
