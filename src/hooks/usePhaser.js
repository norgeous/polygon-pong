import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import config from '../phaser/config';
import GameScene from '../phaser/scenes/GameScene';

const usePhaser = () => {
  const [game, setGame] = useState();
  const [gameReady, setGameReady] = useState(false);

  const [fps, setFps] = useState(0);

  useEffect(() => {
    const newGame = new Phaser.Game({
      ...config,
      scene: [GameScene],
    });
    newGame.setGameReady = setGameReady;
    newGame.setFps = setFps;
    setGame(newGame);
  }, []);

  return {
    game, gameReady,
    fps, targetFps: game?.loop.targetFps || 0,
  };
};

export default usePhaser;
