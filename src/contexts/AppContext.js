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

  const { game, fps, targetFps } = usePhaser({
    update: scene => {

      // broadcast ball physics
      const { x, y } = scene.ball.ball;
      const { x: vx, y: vy } = scene.ball.ball.body.velocity;
      const { angle, angularVelocity } = scene.ball.ball.body;
      // console.log(scene.ball.ball.body);
      // console.log({ x, y, vx, vy, angle, angularVelocity });
      // broadcast();
    },
  });

  const { peerIds, peerId, connections, broadcast, peerData } = usePeer({
    location,
    hostFitness,
    visibilityState,
  });

  // console.log(game);

  // broadcast visibilitychange events
  useEffect(() => broadcast({ visibilityState }), [visibilityState]);
  
  // set volume into game
  useEffect(() => {if (game) game.maxVolume = volume}, [game, volume]);
  
  useEffect(() => {
    console.log(game);
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
