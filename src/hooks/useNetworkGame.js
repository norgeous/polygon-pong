import { useEffect } from 'react';
import useStateObject from './useStateObject';

const useNetworkGame = ({
  gameReady,
  scene,
  peerId,
  isHost,
  players,
  broadcast,
}) => {
  const [balls, flatBalls, setBallById, deleteBallById] = useStateObject({});

  // if host, and no balls, add a ball
  useEffect(() => {
    if (gameReady && isHost && Object.keys(balls).length === 0) {
      setBallById('one', { emoji: '0' });
    }
  }, [gameReady, isHost, balls]);

  // broadcast physics state
  useEffect(() => {
    if (gameReady && broadcast) {
      // if hosting
      if (isHost) {
        const send = () => {
          broadcast({
            action: 'SETGAMESTATE',
            payload: {
              balls: Object.values(scene.balls).map(ball => ball.getState()), // all balls
              players: [scene.players[peerId].getState()], // host player position
            },
          });
        };
        const t = setInterval(send, 500); // broadcast poll rate
        return () => clearInterval(t);
      }

      // if not hosting
      if (!isHost) {
        const send = () => {
          broadcast({
            action: 'SETGAMESTATE',
            payload: {
              players: [scene.players[peerId].getState()], // player position
            },
          });
        };
        const t = setInterval(send, 500); // broadcast poll rate
        return () => clearInterval(t);
      }
    }
  }, [gameReady, isHost, broadcast]);

  // if player count changes, adjust the players in the scene
  useEffect(() => {
    if (gameReady && players.length) {
      scene.syncronizeConnectionsWithPlayers(players);
    }
  }, [gameReady, scene, players]);

  // if ball count changes, adjust the balls in the scene 
  useEffect(() => {
    if (gameReady && flatBalls.length) {
      scene.syncronizeBalls(flatBalls);
    }
  }, [gameReady, scene, flatBalls]);

  return { balls, flatBalls, setBallById, deleteBallById };
};

export default useNetworkGame;
