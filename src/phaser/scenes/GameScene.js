import Ball from '../objects/Ball';
import Level from '../../utils/levelGenerator';
import Seat from '../objects/Seat';

const seatPlayers = (players) => {
  const empty = { controlType: 'empty' };
  if (players.length === 0) {
    return [empty, empty, empty, empty];
  }
  if (players.length === 1) {
    return [players[0], empty, empty, empty];
  }
  if (players.length === 2) {
    return [players[0], empty, players[1], empty];
  }
  return players;
};

class GameScene extends Phaser.Scene {
  constructor() {
    super();

    this.balls = {};
    this.players = {};
    this.seats = {};
  }

  preload () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('fire1', 'assets/particles/fire1.png');
    this.load.image('cloud', 'assets/particles/cloud.png');
  }

  create () {
    this.matter.world.disableGravity();

    this.particles = {
      red: this.add.particles('red'),
      fire1: this.add.particles('fire1'),
      cloud: this.add.particles('cloud'),
    };

    // camera
    this.cameras.main.centerOn(0,0);
    // this.cameras.main.setZoom(0.25);    
    // this.cameras.main.setRotation(-(((2*Math.PI)/3)*1));

    this.level = new Level(this);

    // resize game on window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.cameras.main.centerOn(0,0);
      },100);
    });

    this.game.setGameReady(true); // react state update
  }

  update () {
    if (this.game.visibilityState === 'hidden') this.matter.pause();
    if (this.game.visibilityState === 'visible') this.matter.resume();
    this.game.setFps?.(Math.round(this.game.loop.actualFps)); // react state update

    [
      ...Object.values(this.balls),
      ...Object.values(this.seats),
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

  syncronizePlayers (players) {
    // delete exisiting players not in new players (they logged off)
    const connectedIds = players.map(({ id }) => id);
    const deleteIds = Object.keys(this.seats).filter(id => !connectedIds.includes(id));
    deleteIds.forEach(id => {
      this.seats[id].destroy();
      delete this.seats[id];
    });

    // draw play area for this number of players
    this.level.set({
      trackLength: 600,
      trackWallGap: 100,
      wallDepth: 1000,
      playerCount: players.length,
    });

    // calculate seats
    const seatedPlayers = seatPlayers(players);
    const seatConfigs = this.level.walls.map((wall, i) => ({
      ...seatedPlayers[i],
      trackPoints: this.level.tracks[i],
      goal: wall,
    }));

    // draw the seats
    seatConfigs.forEach((seatConfig, i) => {
      if (!this.seats?.[i]) this.seats[i] = new Seat(this, seatConfig);
      else this.seats[i].redraw(seatConfig);
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
      console.log({ players });
      players.forEach(({ id, type, ...state }) => {
        // if (!this.players[id]) this.players[id] = new Player(this, id, type);
        this.players[id]?.setState(state);
      });
    }
  }
}

export default GameScene;
