import Ball from '../objects/Ball';
import Player from '../objects/Player';
import Polygon from '../objects/Polygon';

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.worldbounds = {
      width: 1000,
      height: 1000,
    };

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
    // const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, this.worldbounds.width, this.worldbounds.height, 1000);

    this.particles = {
      red: this.add.particles('red'),
      fire1: this.add.particles('fire1'),
      cloud: this.add.particles('cloud'),
    };

    // camera
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.centerOn(width/2, height/2);
    // this.cameras.main.setZoom(0.705);
    // this.cameras.main.setZoom(0.5);
    
    this.cameras.main.centerOn(this.worldbounds.width / 2, this.worldbounds.height / 2);
    // this.cameras.main.setRotation(-(((2*Math.PI)/3)*1));

    this.poly = new Polygon(this);
    // this.poly2 = new Polygon(this);

    this.game.setGameReady(true); // react state update
  }

  update () {
    // this.cameras.main.setRotation(this.cameras.main.rotation+0.001);

    if (this.game.visibilityState === 'hidden') this.matter.pause();
    if (this.game.visibilityState === 'visible') this.matter.resume();
    this.game.setFps?.(Math.round(this.game.loop.actualFps)); // react state update

    [
      ...Object.values(this.balls),
      ...Object.values(this.players),
    ].forEach(item => item?.update(this));
  }

  syncronizeBalls (balls) {
    // delete balls not in the new state
    const ballIds = balls.map(({ id }) => id);
    const deleteIds = Object.keys(this.balls).filter(id => !ballIds.includes(id));
    deleteIds.forEach(id => {
      this.balls[id].destroy();
      delete this.balls[id];
    });

    // add ball objects
    balls.forEach(({ id, emojiId }) => {
      if (!this.balls[id]) {
        this.balls[id] = new Ball(this, id, emojiId);
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

    // draw play area for this number of players
    this.poly.set(200, 300, 350, connectedIds.length); // set and redraw
    // this.poly2.set(300, adjustedPlayerCount); // set and redraw

    // add player object for newly connected players
    connections.forEach(({ id, type }, i) => {
      if (!this.players[id]) {
        const index = connections.length === 2 && i === 1 ? 2 : i;
        const line = this.poly.lines[index];
        const twoPi = 2 * Math.PI;
        const angle = (twoPi / connectedIds.length) * index;
        this.players[id] = new Player(this, index, type, line, angle);
      }
    });
  }

  setGameState(payload) {
    // deserialise game physics state and set into scene
    const { balls, players } = payload;

    if (balls) {
      balls.forEach(({ id, emojiId, ...state }) => {
        // if (!this.balls[id]) this.balls[id] = new Ball(this, id, emojiId);
        this.balls[id]?.setState(state);
      });
    }
    
    if (players) {
      players.forEach(({ id, type, ...state }) => {
        // if (!this.players[id]) this.players[id] = new Player(this, id, type);
        this.players[id]?.setState(state);
      });
    }
  }
}

export default GameScene;
