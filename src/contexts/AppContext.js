import React, { createContext, useContext, useState, useEffect } from 'react';
import useClock from '../hooks/useClock';
import useLocation from '../hooks/useLocation';
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
  const batteryPercent = useBattery();
  const location = useLocation();
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);
  const { cores, ram, timeTaken, hostFitness } = useSystemInfo();

  const { game, fps, targetFps } = usePhaser({});

  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer({
    location,
    hostFitness,
  });

  // console.log(game);

  // useEffect(() => broadcast({ position }), [position]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        location,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        clock,
        batteryPercent,
        cores, ram, timeTaken, hostFitness,
        hardCodedPeerIds, peerId, connections2, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
