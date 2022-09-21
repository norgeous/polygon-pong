import React, { createContext, useContext, useEffect } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import usePeer from '../hooks/usePeer';
import usePeerNet from '../hooks/usePeerNet';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState } = sysInfo;

  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { game, gameReady, fps, targetFps } = usePhaser();
  // const { peerIds, peerId, connections, broadcast, peerData } = usePeer(sysInfo, game, visibilityState);
  const { loading, peerId, peerNet, peerData, setPeerDataById, broadcast } = usePeerNet({
    networkName: 'polygon-pong-multiplayer',
    maxPeers: 9,
    active: visibilityState === 'visible'
  });

  // const connections = peerNet?.connections;
  const scene = game?.scene?.scenes?.[0];

  // console.log(peerNet, peerData);

  // once we have both peerNet and sysInfo, change peerNet's onOpen callback
  useEffect(() => {
    if (peerNet && sysInfo) {
      peerNet.onOpen = conn => conn.send({
        action: 'SETDATA',
        payload: sysInfo,
      });
    }
  }, [peerNet, sysInfo]);

  // on mount, add a ball
  useEffect(() => { if (gameReady) scene.addBall(); }, [gameReady]);

  // when connections change, adjust players
  useEffect(() => {
    // console.log('peernet changed!', peerNet);
    if (gameReady && peerNet) {
      scene.localPlayer?.destroy();
      scene.remotePlayers.forEach(p => p.destroy());
      Object.entries(peerNet.connections).forEach(([id, { connectionType, connected }]) => {
        // console.log({ connectionType, connected });
        if (connected) {
          if (connectionType === 'local') scene.addLocalPlayer(id);
          if (connectionType === 'remote') scene.addRemotePlayer(id);
        }
      });
    }
  }, [gameReady, peerNet]);

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
        // peerIds, peerId, connections, broadcast, peerData,
        peerNet, peerData, setPeerDataById, broadcast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
