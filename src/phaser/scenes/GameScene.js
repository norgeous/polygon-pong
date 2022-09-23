import Ball from '../objects/Ball';
import Player from '../objects/Player';

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.localPlayer = undefined;
    this.remotePlayers = [];
    this.balls = [];
    this.players = {};

    // this.reactUpdate = () => {};
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
  }

  create () {
    const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, 150);

    this.particles = this.add.particles('red');

    // camera
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.setZoom(0.5);
    // this.cameras.main.centerOn(width/2, height/2);

    this.game.setGameReady(true); // react state update
  }

  update () {
    if (this.game.visibilityState === 'hidden') this.matter.pause();
    if (this.game.visibilityState === 'visible') this.matter.resume();

    [
      this.localPlayer,
      ...this.remotePlayers,
      ...this.balls,
    ].forEach(gObj => gObj?.update(this));

    this.game.setFps(Math.round(this.game.loop.actualFps)); // react state update
  }

  addBall () {
    this.balls.push(new Ball(this));
  }
  removeBall () {
    const ball = this.balls.pop();
    ball.destroy();
  }



  
  addLocalPlayer () {
    this.localPlayer = new Player(this, 'local');
  }
  removeLocalPlayer () {
    if (this.localPlayer) this.localPlayer.destroy();
  }

  addRemotePlayer () {
    this.remotePlayers.push(new Player(this, 'remote'));
  }
  removeRemotePlayer () {
    const remotePlayer = this.remotePlayers.pop();
    remotePlayer.destroy();
  }


  syncronizeConnectionsWithPlayers (connections) {
    // delete exisiting players not in new connections (they logged off)
    const connectedIds = connections.map(({ id }) => id);
    const deleteIds = Object.keys(this.players).filter(id => !connectedIds.includes(id))
    deleteIds.forEach(id => {
      this.players[id].destroy();
      delete this.players[id];
    });

    // add player object for newly connected players
    connections.forEach(({id, connectionType}) => {
      // console.log('game got', id, connectionType);
      if (!this.players?.[id]) {
        this.players[id] = new Player(this, connectionType);
      }
    });
  }
}

export default GameScene;
