import { useState, useEffect } from 'react';
import Phaser from 'phaser';
// import getConfig from '../phaser/scene1';
import Game from '../phaser/Game';

const usePhaser = () => {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState();

  useEffect(() => {
    // const config = getConfig({ setScore });
    // setGame(new Phaser.Game(config));
    setGame(new Phaser.Game({
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
        default: 'arcade',
        arcade: {
          // debug: true,
          // gravity: { y: 200 }
        }
      },
      scene: [Game],
    }));
  }, []);

  return { score, game };
};

export default usePhaser;
