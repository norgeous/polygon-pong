import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import config from '../phaser/config';
import GameScene from '../phaser/scenes/GameScene';

const usePhaser = () => {
  const [fps, setFps] = useState(0);
  const [game, setGame] = useState();
  const updateGame = () => setGame(oldGame => ({ ...oldGame }));

  // const updateFps = (scene) => {
  //   setFps(Math.round(scene?.game.loop.actualFps || 0));
  // };

  useEffect(() => {
    const newGame = new Phaser.Game({
      ...config,
      scene: [
        GameScene,
        // {
        //   ...gameScene,
        //   extend: {
        //     additionalFunctions: {
        //       update: scene => {
        //         updateFps(scene);
        //       },
        //     },
        //   },
        // },
      ],
    });
    setGame(newGame);
  }, []);

  return { game, updateGame, fps, targetFps: game?.loop.targetFps || 0 };
};

export default usePhaser;
