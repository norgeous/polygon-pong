import Ball from '../objects/Ball';
import Player from '../objects/Player';

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.balls = {};
    this.players = {};
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('fire1', 'assets/particles/fire1.png');
    this.load.image('cloud', 'assets/particles/cloud.png');
  }

  create () {
    const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, 150);

    this.particles = {
      red: this.add.particles('red'),
      fire1: this.add.particles('fire1'),
      cloud: this.add.particles('cloud'),
    };

    // camera
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.setZoom(0.5);
    // this.cameras.main.centerOn(width/2, height/2);
    // this.cameras.main.setAngle(90);

    this.game.setGameReady(true); // react state update
  }

  update () {
    if (this.game.visibilityState === 'hidden') this.matter.pause();
    if (this.game.visibilityState === 'visible') this.matter.resume();

    [
      ...Object.values(this.balls),
      ...Object.values(this.players),
    ].forEach(item => item?.update(this));

    this.game.setFps(Math.round(this.game.loop.actualFps)); // react state update
  }

  syncronizeBalls (balls) {
    // delete balls not in the new state
    const ballIds = balls.map(({ id }) => id);
    const deleteIds = Object.keys(this.balls).filter(id => !ballIds.includes(id));
    deleteIds.forEach(id => {
      this.balls[id].destroy();
      delete this.balls[id];
    });

    // add ball object for newly connected players
    balls.forEach(({ id, value }) => {
      if (!this.balls[id]) {
        this.balls[id] = new Ball(this, id, value.emoji);
      }
    });
  }

  syncronizeConnectionsWithPlayers (connections) {
    // delete exisiting players not in new connections (they logged off)
    const connectedIds = connections.map(({ id }) => id);
    const deleteIds = Object.keys(this.players).filter(id => !connectedIds.includes(id));
    deleteIds.forEach(id => {
      this.players[id].destroy();
      delete this.players[id];
    });

    // add player object for newly connected players
    connections.forEach(({ id, connectionType }) => {
      if (!this.players[id]) {
        this.players[id] = new Player(this, id, connectionType);
      }
    });
  }
}

export default GameScene;
