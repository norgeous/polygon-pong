import { useState, useEffect } from 'react';
import Phaser from 'phaser';
import getConfig from '../phaser/scene1';

const usePhaser = () => {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState();

  useEffect(() => {
    const config = getConfig({ setScore });
    setGame(new Phaser.Game(config));
  }, []);

  return { score, game };
};

export default usePhaser;
