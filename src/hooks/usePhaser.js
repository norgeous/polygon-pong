import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import gameScene from '../phaser/scenes/gameScene';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 20 * 50,
    height: 10 * 50,
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
  fps: {
    target: 90,
    forceSetTimeOut: true,
  },
};

const usePhaser = (additionalFunctions) => {
  const [fps, setFps] = useState(0);
  const [game, setGame] = useState();

  const updateFps = (scene) => {
    setFps(Math.round(scene?.game.loop.actualFps || 0));
  };
  
  useEffect(() => {
    const newGame = new Phaser.Game({
      ...config,
      scene: [
        {
          ...gameScene,
          extend: {
            additionalFunctions: {
              ...additionalFunctions,
              update: scene => {
                updateFps(scene);
                additionalFunctions.update?.(scene);
              },
            },
          },
        },
      ],
    });
    setGame(newGame);
  }, []);

  return { game, fps, targetFps: game?.loop.targetFps || 0 };
};

export default usePhaser;
