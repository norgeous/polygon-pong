import { useEffect } from 'react';
// import useStateArray from './useStateArray';

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
  // broadcast physics state
  useEffect(() => {
    if (gameReady && broadcast) {
      // if hosting
      if (isHost) {
        const send = () => {
          console.log('host sending', scene.seats);
          const populatedSeats = Object.values(scene.seats).filter(({ controlType }) => controlType !== 'empty');
          console.log('host sending', scene.seats, {players});
          const playerStates = populatedSeats.map(seat => seat.player.getState());
          broadcast({
            type: 'SETGAMESTATE',
            payload: {
              balls: Object.values(scene.balls).map(ball => ball.getState()), // all balls
              players: [scene.seats[peerId]?.getState?.()], // host player position
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
              players: [scene.seats[peerId]?.getState?.()], // player position
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
