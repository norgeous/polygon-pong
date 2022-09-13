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
  const [volume, setVolume] = useLocalStorage(0.5);
  const location = useLocation();
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);
  const { cores, ram, timeTaken, hostFitness } = useSystemInfo();

  const { game, fps, targetFps } = usePhaser({});

  const { hardCodedPeerIds, peerId, connections, broadcast, peerData } = usePeer({
    location,
    hostFitness,
  });

  // console.log(game);

  // broadcast visibilitychange events
  useEffect(() => broadcast({ visibilityState }), [visibilityState, broadcast]);
  useEffect(() => {if (game) game.maxVolume = volume}, [game, volume]);

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
        hardCodedPeerIds, peerId, connections, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
