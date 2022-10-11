import { useEffect } from 'react';
import useStateArray from './useStateArray';

const useNetworkGame = ({
  gameReady,
  scene,
  peerId,
  isHost,
  players,
  broadcast,
  // ballsDb,
  ballsArray,
  // setBallById,
  // deleteBallById,
}) => {

  // if host, and no balls, add a ball
  // useEffect(() => {
  //   if (gameReady && isHost && Object.keys(balls).length === 0) {
  //     setBallById('one', { emoji: 'X' });
  //   }
  // }, [gameReady, isHost, balls]);

  // broadcast physics state
  useEffect(() => {
    if (gameReady && broadcast) {
      // if hosting
      if (isHost) {
        const send = () => {
          // console.log('HOST SENDING BALLS', Object.values(scene.balls).map(ball => ball.getState()));
          broadcast({
            type: 'SETGAMESTATE',
            payload: {
              balls: Object.values(scene.balls).map(ball => ball.getState()), // all balls
              players: [scene.players[peerId]?.getState()], // host player position
            },
          });
        };
        const t = setInterval(send, 50); // broadcast poll rate
        return () => clearInterval(t);
      }

      // if not hosting
      if (!isHost) {
        const send = () => {
          broadcast({
            type: 'SETGAMESTATE',
            payload: {
              players: [scene.players[peerId]?.getState()], // player position
            },
          });
        };
        const t = setInterval(send, 50); // broadcast poll rate
        return () => clearInterval(t);
      }
    }
  }, [gameReady, isHost, broadcast]);

  // if player count changes, adjust the players in the scene
  useEffect(() => {
    if (gameReady && players.length) {
      scene.syncronizePlayers(players);
    }
  }, [gameReady, scene, players]);

  // if ball count changes, adjust the balls in the scene 
  useEffect(() => {
    if (gameReady && ballsArray.length) {
      scene.syncronizeBalls(ballsArray);
    }
  }, [gameReady, scene, ballsArray]);

  // return { balls, flatBalls, setBallById, deleteBallById };
};

export default useNetworkGame;
