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
  const { game, updateGame, fps, targetFps } = usePhaser();
  const { peerIds, peerId, connections, broadcast, peerData } = usePeer(sysInfo, game, visibilityState);


  const scene = game?.scene?.scenes?.[0];

  // on mount add a ball
  useEffect(() => {
    if (scene && peerId) {
      // console.log(Object.entries(scene))
      // scene.balls.push(new Ball(scene));
      // scene.create();
      setTimeout(() => scene.addBall(), 10000);
      setTimeout(() => scene.addBall(), 20000);
      setTimeout(() => scene.addBall(), 30000);
    }
  }, [scene, peerId]);

  // on join / leave peerNet, add / remove the player to scene
  useEffect(() => {
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {
        console.log(scene, peerId);
        if (peerId) {
          if (!scene.localPlayer) scene.localPlayer = new Player(scene, 'Player 1', 'local');
        } else {
          scene.player1?.destroy?.();
        }
      }
    }
  }, [game, peerId]);

  // when connections change, add / remove other players to scene
  useEffect(() => {
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {
        scene.remotePlayers.forEach(p => p.destroy());
        scene.remotePlayers = connections.map(c => new Player(scene, 'Other Player', 'remote'));
      }
    }
  }, [game, connections]);

  // broadcast ball physics state
  useEffect(() => {
    if (game && peerId && peerId === peerIds[0] && broadcast) {
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
    };
  }, [game, peerId, peerIds, broadcast]);
  
  // set react data into game
  useEffect(() => { if (game && game.maxVolume !== volume) { game.maxVolume = volume; updateGame(); }}, [game, volume]);
  useEffect(() => { if (game && game.visibilityState !== visibilityState) { game.visibilityState = visibilityState; updateGame(); }}, [game, visibilityState]);
  // useEffect(() => { if (game && game.sysInfo !== sysInfo) { game.sysInfo = sysInfo; updateGame(); }}, [game, sysInfo]);

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
