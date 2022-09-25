import { useState, useEffect } from 'react';

const usePhaserBalls = ({ scene }) => {
  const [_balls, setBalls] = useState({});
  const balls = Object.values(_balls);
  const setBallById = (id, value) => setBalls(oldsBalls => {
    if (!value) {
      delete oldsBalls[id];
      return oldsBalls;
    }
    
    return {
      ...oldsBalls,
      [id]: {
        id,
        value,
      },
    };
  });
  const removeBallById = (id) => setBallById(id, undefined);

  // when balls change, adjust balls in scene
  useEffect(() => {
    if (scene) scene.syncronizeBalls(balls);
  }, [scene, balls]);

  return {
    balls,
    setBallById,
    removeBallById,
  };
};

export default usePhaserBalls;
