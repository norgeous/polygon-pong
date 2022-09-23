import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

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
  const scene = game?.scene?.scenes?.[0];

  // DI
  const onOpen = useCallback(conn => {
    conn.send({ action: 'SETDATA', payload: { idCard } });
  }, [idCard]);
  
  const onData = useCallback((conn, data) => {
    const { action, payload } = data;
    ({
      // receive game state
      SETGAMESTATE: d => {
        // deserialise game state and set into scene
      },
      SETBALL: d => {
        scene?.balls?.[0].setState?.(d);
      },
    })[action]?.(payload);
  }, []);

  const { peer, connections, broadcast } = usePeerJsMesh({
    networkName: 'polygon-pong-multiplayer',
    maxPeers: 9,
    active: visibilityState === 'visible',
    onOpen,
    onData,
  });

  const improvedConnections = useMemo(() => {
    const newIC = connections.map(c => {
      if (c.connectionType === 'local') {
        return {
          ...c,
          idCard: sysInfo.idCard,
        };
      }
      return c;
    });

    const hostId = newIC
      .filter(({ connection }) => connection?.open)
      .sort((a, b) => a.idCard?.hostFitness - b.idCard?.hostFitness)[0]?.id;

    console.log(hostId)

    return newIC.map(c => ({
      ...c,
      isHost: c.id === hostId,
    }));
  }, [connections, sysInfo]);


  // on mount, add a ball
  useEffect(() => { if (gameReady) scene.addBall(); }, [gameReady]);

  // when connections change, adjust player object count
  useEffect(() => {
    if (gameReady && connections) {
      const players = connections.filter(({ connection }) => connection.open);
      scene.syncronizeConnectionsWithPlayers(players);
    }
  }, [gameReady, connections]);

  // broadcast ball physics state
  // useEffect(() => {
  //   if (gameReady && connections.length) {
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
  //     const t = setInterval(send, 5000); // broadcast poll rate
  //     return () => clearInterval(t);
  //   }
  // }, [gameReady, broadcast]);
  
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
        peer, connections: improvedConnections, broadcast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
