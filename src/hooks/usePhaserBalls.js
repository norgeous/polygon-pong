import { useState, useMemo, useEffect } from 'react';

const usePhaserBalls = ({ scene }) => {
  const [_balls, setBalls] = useState({});
  const balls = useMemo(() => Object.values(_balls), [_balls]);
  const setBallById = (id, value) => setBalls(oldsBalls => {
    if (!value) {
      delete oldsBalls[id];
      return { ...oldsBalls };
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

  // console.log({balls})

  return {
    balls,
    setBallById,
    removeBallById,
  };
};

export default usePhaserBalls;
