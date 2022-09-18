import React, { createContext, useContext, useEffect } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import usePeer from '../hooks/usePeer';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';
import Player from '../phaser/objects/Player';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { game, fps, targetFps } = usePhaser({});
  const { peerIds, peerId, connections, broadcast, peerData } = usePeer(game);

  // on join / leave peerNet, add / remove the player to scene
  useEffect(() => {
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {

        if (peerId) {
          scene.player1 = new Player(scene, 'Player 1', 'local');
        } else {
          // console.log(scene.player1);
          scene.player1.destroy();
        }
      }
    }
  }, [game, peerId]);

  // when connections change, add / remove other players to scene
  useEffect(() => {
    // console.log('connections changed', connections);
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {
        scene.otherPlayers.forEach(p => p.destroy());
        scene.otherPlayers = connections.map(c => new Player(scene, 'Other Player', 'remote'));
      }
    }
  }, [game, connections]);

  // broadcast ball physics state
  useEffect(() => {
    if (game && peerId && peerId === peerIds[0] && broadcast) {
      const send = () => {
        // broadcast ball physics
        const scene = game.scene.scenes[0];
        const { x, y } = scene.ball.ball;
        const { x: vx, y: vy } = scene.ball.ball.body.velocity;
        const { angle: a, angularVelocity: va } = scene.ball.ball.body;
        broadcast({
          action: 'SETBALL',
          payload: { x, y, a, vx, vy, va },
        });
      };
      const t = setInterval(send, 50);
      return () => clearInterval(t);
    };
  }, [game, peerId, peerIds, broadcast]);
  
  // set react data into game
  useEffect(() => {if (game) game.maxVolume = volume}, [game, volume]);
  useEffect(() => {if (game) game.sysInfo = sysInfo}, [game, sysInfo]);
  
  // pause / resume game when switching tabs or apps
  // useEffect(() => {
  //   // console.log(game);
  //   if (!game) return;
  //   if (visibilityState === 'hidden') game.scene.scenes[0].matter.pause()
  //   if (visibilityState === 'visible') game.scene.scenes[0].matter.resume()
  // }, [visibilityState]);

  return (
    <AppContext.Provider
      value={{
        // packageConfig: globalThis.packageConfig,
        route, setRoute,
        // location,
        volume, setVolume,
        // visibilityState,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        // clock,
        // batteryPercent,
        sysInfo,
        peerIds, peerId, connections, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
