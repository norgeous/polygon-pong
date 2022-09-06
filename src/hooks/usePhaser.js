import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import Game from '../phaser/Game';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 16 * 50,
    height: 9 * 50,
  },
  pixelArt: true,
  antialias: false,
  autoRound: true,
  roundPixels: true,
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      // gravity: { y: 200 }
    }
  },
  scene: [Game],
};

const usePhaser = () => {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState();

  useEffect(() => {
    const newGame = new Phaser.Game(config);
    setGame(newGame);
  }, []);

  return { score, game };
};

export default usePhaser;
