import React, { createContext, useContext, useEffect } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import usePeer from '../hooks/usePeer';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';
import Player from '../phaser/objects/Player';
// import Ball from '../phaser/objects/Ball';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState } = sysInfo;

  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { game, gameReady, fps, targetFps } = usePhaser();
  const { peerIds, peerId, connections, broadcast, peerData } = usePeer(sysInfo, game, visibilityState);

  const scene = game?.scene?.scenes?.[0];

  // on mount, add a ball
  useEffect(() => { if (gameReady) scene.addBall(); }, [gameReady]);

  // on local player join / leave peerNet, add / remove the player to scene
  useEffect(() => {
    if (gameReady) {
      if (peerId) scene.addLocalPlayer();
      else scene.removeLocalPlayer();
    }
  }, [gameReady, peerId]);

  // when connections change, adjust remote players
  useEffect(() => {
    if (gameReady) {
      scene.remotePlayers.forEach(p => p.destroy());
      connections.forEach(() => scene.addRemotePlayer());
    }
  }, [gameReady, connections]);

  // broadcast ball physics state
  useEffect(() => {
    if (gameReady && peerId && peerId === peerIds[0] && broadcast) {
      const send = () => {
        const ball = scene.balls[0];
        const { x, y } = ball.ball;
        const { x: vx, y: vy } = ball.ball.body.velocity;
        const { angle: a, angularVelocity: va } = ball.ball.body;
        broadcast({
          action: 'SETBALL',
          payload: { x, y, a, vx, vy, va },
        });
      };
      const t = setInterval(send, 50); // broadcast poll rate
      return () => clearInterval(t);
    }
  }, [gameReady, peerId, peerIds, broadcast]);
  
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
        peerIds, peerId, connections, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
