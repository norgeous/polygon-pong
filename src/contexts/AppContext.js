import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import usePeerJsMesh from '../hooks/usePeerJsMesh';
import usePeerJsMesh2 from '../peerJsMesh/usePeerJsMesh';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';
import usePhaserBalls from '../hooks/usePhaserBalls';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState, idCard } = sysInfo;
  
  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [showFps, setShowFps] = useLocalStorage('showfps', false);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { gameReady, game, scene, fps, targetFps } = usePhaser();
  const { balls, setBallById, removeBallById } = usePhaserBalls({ scene });

  // DI
  // const onOpen = useCallback(conn => {
  //   console.log('a connection opened, sending idCard', conn.peer, idCard);
  //   conn.send({ action: 'SETDATA', payload: { idCard } });
  // }, [idCard]);
  
  // const onData = useCallback((conn, data) => {
  //   const { action, payload } = data;
  //   ({
  //     // receive game state
  //     SETGAMESTATE: gamePhysicsState => {
  //       // deserialise game state and set into scene
  //       const { balls, players } = gamePhysicsState;
  //       if (balls) balls.forEach(({ id, ...state }) => scene?.balls?.[id].setState?.(state));
  //       if (players) players.forEach(({ id, ...state }) => scene?.players?.[id].setState?.(state));
  //     },
  //   })[action]?.(payload);
  // }, [scene]);

  // const { peer, connections, broadcast } = usePeerJsMesh({
  //   networkName: 'polygon-pong-multiplayer',
  //   maxPeers: 9,
  //   active: visibilityState === 'visible',
  //   onOpen,
  //   onData,
  // });


  
  const {
    peer,
    open,
    peerConnections,
    peerData,
  } = usePeerJsMesh2({
    //   networkName: 'polygon-pong-multiplayer',
    //   maxPeers: 9,
    active: visibilityState === 'visible',
    idCard,
  });

  // const improvedConnections = useMemo(() => {
  //   const newIC = connections.map(c => {
  //     if (c.connectionType === 'local') {
  //       return {
  //         ...c,
  //         idCard: sysInfo.idCard,
  //       };
  //     }
  //     return c;
  //   });

  //   const hostId = newIC
  //     .filter(({ connection }) => connection?.open)
  //     .sort((a, b) => a.idCard?.hostFitness - b.idCard?.hostFitness)[0]?.id;

  //   return newIC.map(c => ({
  //     ...c,
  //     isHost: c.id === hostId,
  //   }));
  // }, [connections, sysInfo]);

  // when connections change, adjust player object count
  // useEffect(() => {
  //   if (gameReady && connections) {
  //     const players = connections.filter(({ connection }) => connection.open);
  //     scene.syncronizeConnectionsWithPlayers(players);
  //   }
  // }, [gameReady, connections]);

  // set react data into game
  useEffect(() => { if (game && game.maxVolume !== volume) { game.maxVolume = volume; }}, [game, volume]);
  useEffect(() => { if (game && game.visibilityState !== visibilityState) { game.visibilityState = visibilityState; }}, [game, visibilityState]);

  // on mount, add balls
  // useEffect(() => { if (gameReady) scene.syncronizeBalls([{id:1},{id:2}]); }, [gameReady]);

  // broadcast physics state
  // useEffect(() => {
  //   if (gameReady && improvedConnections.length) {
  //     const host = improvedConnections.find(({ isHost }) => isHost);
  //     if (host.connectionType === 'local') {
  //       // if hosting
  //       const send = () => {
  //         broadcast({
  //           action: 'SETGAMESTATE',
  //           payload: {
  //             balls: Object.values(scene.balls).map(ball => ball.getState()), // all balls
  //             players: [scene.players[peer.id].getState()], // host player position
  //           },
  //         });
  //       };
  //       const t = setInterval(send, 50); // broadcast poll rate
  //       return () => clearInterval(t);
  //     }
  //     if (host.connectionType === 'remote') {
  //       // if not hosting
  //       const send = () => {
  //         broadcast({
  //           action: 'SETGAMESTATE',
  //           payload: {
  //             players: [scene.players[peer.id].getState()], // player position
  //           },
  //         });
  //       };
  //       const t = setInterval(send, 50); // broadcast poll rate
  //       return () => clearInterval(t);
  //     }
  //   }
  // }, [gameReady, improvedConnections, broadcast]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        volume, setVolume,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, scene,
        showFps, setShowFps, fps, targetFps,
        balls, setBallById, removeBallById,
        sysInfo,
        // peer, connections: improvedConnections, broadcast,
        connections: [],
        peer, open, peerConnections, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
