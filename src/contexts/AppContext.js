import React, { createContext, useContext, useEffect, useCallback } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import usePeerJsMesh from '../hooks/usePeerJsMesh';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState, idCard } = sysInfo;

  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { gameReady, game, fps, targetFps } = usePhaser();

  // DI
  const onOpen = useCallback(conn => {
    conn.send({ action: 'SETDATA', payload: { idCard } });
  }, [idCard]);
  
  // const onData = useCallback((conn, data) => {
  //   const { action, payload } = data;
  //   ({
  //     // receive game state
  //     SETGAMESTATE: (d) => {
  //       // deserialise game state and set into scene
  //     },
  //   })[action]?.(payload);
  // }, []);

  const { peer, connections } = usePeerJsMesh({
    networkName: 'polygon-pong-multiplayer',
    maxPeers: 9,
    active: visibilityState === 'visible',
    onOpen,
    // onData,
  });

  const scene = game?.scene?.scenes?.[0];

  // on mount, add a ball
  useEffect(() => { if (gameReady) scene.addBall(); }, [gameReady]);

  // when connections change, adjust player object count
  useEffect(() => {
    if (gameReady && connections) scene.syncronizeConnectionsWithPlayers(connections);
  }, [gameReady, connections]);

  // broadcast ball physics state
  // useEffect(() => {
  //   if (gameReady && peerId && peerId === peerIds[0] && broadcast) {
  //     const send = () => {
  //       const ball = scene.balls[0];
  //       const { x, y } = ball.ball;
  //       const { x: vx, y: vy } = ball.ball.body.velocity;
  //       const { angle: a, angularVelocity: va } = ball.ball.body;
  //       broadcast({
  //         action: 'SETBALL',
  //         payload: { x, y, a, vx, vy, va },
  //       });
  //     };
  //     const t = setInterval(send, 50); // broadcast poll rate
  //     return () => clearInterval(t);
  //   }
  // }, [gameReady, peerId, peerIds, broadcast]);
  
  // set react data into game
  useEffect(() => { if (game && game.maxVolume !== volume) { game.maxVolume = volume; }}, [game, volume]);
  useEffect(() => { if (game && game.visibilityState !== visibilityState) { game.visibilityState = visibilityState; }}, [game, visibilityState]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        volume, setVolume,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        sysInfo,
        peer, connections,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
