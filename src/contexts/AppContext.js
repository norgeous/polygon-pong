import React, { createContext, useContext, useEffect } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import useStateArray from '../hooks/useStateArray';

import usePeerJsMesh from '../peerJsMesh/usePeerJsMesh';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';
import useNetworkGame from '../hooks/useNetworkGame';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState, idCard } = sysInfo;
  const [enableNetwork, setEnableNetwork] = useLocalStorage('enableNetwork', true);
  
  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [showFps, setShowFps] = useLocalStorage('showFps', false);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { gameReady, game, scene, fps, targetFps } = usePhaser();

  const [players, setPlayerById, deletePlayerById] = useStateArray();
  const [ballsArray, setBallById, deleteBallById] = useStateArray();

  // peerjs plumbing
  const connectionReducer = {
    OPEN: ({ id, payload }) => setPlayerById(id, payload),
    CLOSE: ({ id }) => deletePlayerById(id),
    // INTERVAL: () => {},
  };
  const dataReducer = {
    GREETING: ({ id }) => connections.find(({ id: cid }) => cid === id).send({ type:'IDCARD', payload: idCard }),
    IDCARD: ({ id, payload }) => setPlayerById(id, { idCard: payload }),
    PING: ({ id }) => connections.find(({ id: cid }) => cid === id).send({ type: 'PONG' }),
    PONG: ({ id, peerData }) => setPlayerById(id, {
      ping: Math.round((window.performance.now() - peerData[id].pingStart) / 2),
      pingStart: undefined,
    }),
    SETGAMESTATE: ({ payload }) => {
      // if gameobjects from payload are missing, add them
      payload.balls?.forEach(({ id, emojiId }) => {
        if (!scene.balls[id]) setBallById(id, { emojiId });
      });
      scene.setGameState(payload);
    },
  };
  
  const {
    peerIds,
    peer,
    connections,
    peerData,
    broadcast,
  } = usePeerJsMesh({
    networkName: 'polygon-pong-multiplayer',
    maxPeers: 9,
    active: enableNetwork && visibilityState === 'visible',
    connectionReducer,
    dataReducer,
    // setPlayerById,
    // deletePlayerById,
  });

  const peerId = peer?.id;

  // const isHost = peerId === hostId;
  const isHost = true;

  useNetworkGame({
    gameReady,
    scene,
    peerId,
    isHost,
    players,
    broadcast,
    ballsArray,
  });

  // set react data into game
  useEffect(() => { if (game && game.maxVolume !== volume) { game.maxVolume = volume; }}, [game, volume]);
  useEffect(() => { if (game && game.visibilityState !== visibilityState) { game.visibilityState = visibilityState; }}, [game, visibilityState]);

  return (
    <AppContext.Provider
      value={{
        route, setRoute,
        volume, setVolume,
        wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
        game, scene,
        showFps, setShowFps, fps, targetFps,
        ballsArray, setBallById, deleteBallById,
        sysInfo,
        isHost,
        enableNetwork, setEnableNetwork,
        players, setPlayerById, deletePlayerById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
