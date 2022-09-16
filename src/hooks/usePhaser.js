import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import gameScene from '../phaser/scenes/gameScene';
import config from '../phaser/config';

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
