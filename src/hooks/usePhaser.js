import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import * as gameScene from '../phaser/gameScene';

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
      debug: true,
      // gravity: { y: 200 }
    }
  },
  // scene: [Game],
};

const usePhaser = (additionalFunctions) => {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState();

  
  useEffect(() => {
    const newGame = new Phaser.Game({
      ...config,
      scene: [
        {
          ...gameScene,
          extend: {
            additionalFunctions,
          },
        },
      ],
    });
    setGame(newGame);
  }, []);

  return { score, game };
};

export default usePhaser;
