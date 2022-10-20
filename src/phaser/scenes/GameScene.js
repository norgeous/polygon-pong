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

    this.worldbounds = {
      width: 4000,
      height: 4000,
    };

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
    // const { width, height } = this.sys.game.canvas;

    this.matter.world.disableGravity();
    // this.matter.world.setBounds(0, 0, this.worldbounds.width, this.worldbounds.height, 1000);

    this.particles = {
      red: this.add.particles('red'),
      fire1: this.add.particles('fire1'),
      cloud: this.add.particles('cloud'),
    };

    // camera
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.centerOn(width/2, height/2);
    // this.cameras.main.setZoom(0.705);
    // this.cameras.main.setZoom(0.8);
    // this.cameras.main.setZoom(0.25);
    
    // this.cameras.main.centerOn(this.worldbounds.width / 2, this.worldbounds.height / 2);
    this.cameras.main.centerOn(0,0);
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
    // this.cameras.main.setRotation(this.cameras.main.rotation+0.001);

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
      trackWallGap: 200,
      wallDepth: 1000,
      playerCount: players.length,
    });

    // add player object for newly connected players
    // this.level.walls.forEach(({ id, controlType }, i) => {
    //   const index = players.length === 2 && i === 1 ? 2 : i;
    //   const trackPoints = this.level.tracks[i];
    //   const goal = this.level.walls[index];

    //   // draw the seat (wall+track+player)
    //   const seatConfig = { index, controlType, trackPoints, goal };
    //   if (!this.seats?.[id]) this.seats[id] = new Seat(this, seatConfig);
    //   else this.seats[id].redraw(seatConfig);
    // });

    // add player object for newly connected players
    // this.level.walls.forEach((wall, i) => {
    //   const trackPoints = this.level.tracks[i];

    //   // skip second seat
    //   if (this.players.length === 2 && i === 1) {
    //     const seatConfig = { controlType: 'empty', trackPoints, goal: wall };
    //     this.seats[id] = new Seat(this, seatConfig);
    //   }

    //   const player = this.players[position]
    //   const { id, controlType } = player;

    //   // draw the seat
    //   const seatConfig = { controlType, trackPoints, goal: wall };
    //   if (!this.seats?.[id]) this.seats[id] = new Seat(this, seatConfig);
    //   else this.seats[id].redraw(seatConfig);
    // });

    // const seatedPlayers = this.players.reduce((acc, player) => {
    //   if (this.players.length === 2) {

    //   }
    // }, []);

    // const seats = Array.from({ length: this.level.walls.length }, (_, i) => {

    //   const controlType = '';

    // });

    // calculate seats
    const seatedPlayers = seatPlayers(players);
    console.log(players, seatedPlayers);
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
      players.forEach(({ id, type, ...state }) => {
        // if (!this.players[id]) this.players[id] = new Player(this, id, type);
        this.players[id]?.setState(state);
      });
    }
  }
}

export default GameScene;
