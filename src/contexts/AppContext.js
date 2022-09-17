import React, { createContext, useContext, useState, useEffect } from 'react';
import useClock from '../hooks/useClock';
import useDocumentVisibility from '../hooks/useDocumentVisibility';
import useLocation from '../hooks/useLocation';
import useLocalStorage from '../hooks/useLocalStorage';
import usePeer from '../hooks/usePeer';
import useWakeLock from '../hooks/useWakeLock';
import useBattery from '../hooks/useBattery';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';

import Player from '../phaser/objects/Player';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  // const [route, setRoute] = useState('MAINMENU');
  const [route, setRoute] = useState('NETWORK');
  const clock = useClock();
  const visibilityState = useDocumentVisibility();
  const batteryPercent = useBattery();
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const location = useLocation();
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);
  const { cores, ram, timeTaken, hostFitness } = useSystemInfo();
  const { game, fps, targetFps } = usePhaser({});
  const { peerIds, peerId, connections, broadcast, peerData } = usePeer(game, {
    location,
    hostFitness,
    visibilityState,
  });

  // on join / leave peerNet, add / remove the player to scene
  useEffect(() => {
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {

        if (peerId) {
          scene.player1 = new Player(scene, 'Player 1');
        } else {
          console.log(scene.player1);
          scene.player1.destroy();
        }
      }
    }
  }, [game, peerId]);

  // when connections change, add / remove other players to scene
  useEffect(() => {
    console.log('connections changed', connections);
    if (game) {
      const scene = game.scene.scenes[0];
      if (scene) {
        if (connections.length) {

          scene.otherPlayers = [new Player(scene, 'Other Player')];
        }
      }
    }
  }, [connections]);

  // broadcast ball physics state
  useEffect(() => {
    if (game && peerId && peerId === peerIds[0] && broadcast) {
      const send = () => {
        // broadcast ball physics
        const scene = game.scene.scenes[0];
        const { x, y } = scene.ball.ball;
        const { x: vx, y: vy } = scene.ball.ball.body.velocity;
        const { angle, angularVelocity } = scene.ball.ball.body;
        broadcast({
          action: 'SETBALL',
          ball: { x, y, vx, vy, angle, angularVelocity },
        });
      };
      const t = setInterval(send, 100);
      return () => clearInterval(t);
    };
  }, [game, peerId, peerIds, broadcast]);
  
  // set volume into game
  useEffect(() => {if (game) game.maxVolume = volume}, [game, volume]);
  
  // pause / resume game when switching tabs or apps
  useEffect(() => {
    // console.log(game);
    if (!game) return;
    if (visibilityState === 'hidden') game.scene.scenes[0].matter.pause()
    if (visibilityState === 'visible') game.scene.scenes[0].matter.resume()
  }, [visibilityState]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        location,
        volume, setVolume,
        visibilityState,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        clock,
        batteryPercent,
        cores, ram, timeTaken, hostFitness,
        peerIds, peerId, connections, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
