import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';
import usePeer from '../hooks/usePeer';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [route, setRoute] = useState('MAINMENU');
  const { countryCode, flag } = useLocation();
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);
  const { game, fps, targetFps } = usePhaser({});
  const { cores, ram, timeTaken, hostFitness } = useSystemInfo();
  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer();

  // console.log(game);

  // useEffect(() => broadcast({ position }), [position]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        countryCode, flag,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        cores, ram, timeTaken, hostFitness,
        hardCodedPeerIds, peerId, connections2, broadcast, peerData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
