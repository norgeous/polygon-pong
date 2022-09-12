import React, { createContext, useContext, useState, useEffect } from 'react';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [route, setRoute] = useState('MAINMENU');
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);
  const { game, fps, targetFps } = usePhaser({});
  const hostFitness = useSystemInfo();

  // console.log(game);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, fps, targetFps,
        hostFitness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
