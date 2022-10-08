import React, { createContext, useContext, useEffect, useState } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import useStateObject from '../hooks/useStateObject';

import usePeerJsMesh from '../peerJsMesh/usePeerJsMesh';
import useWakeLock from '../hooks/useWakeLock';
import usePhaser from '../hooks/usePhaser';
import useSystemInfo from '../hooks/useSystemInfo';
import useNetworkGame from '../hooks/useNetworkGame';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const sysInfo = useSystemInfo();
  const { visibilityState, idCard } = sysInfo;
  const [enableNetwork, setEnableNetwork] = useState(true);
  
  const [route, setRoute] = useLocalStorage('route', 'MAINMENU');
  const [volume, setVolume] = useLocalStorage('volume', 0.5);
  const [showFps, setShowFps] = useLocalStorage('showfps', false);
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock();
  const { gameReady, game, scene, fps, targetFps } = usePhaser();

  const [ballsArray, setBallById, deleteBallById] = useStateObject({});
  const [cpuPlayers, setCpuPlayerById, deleteCpuPlayerById] = useStateObject({});

  // peerjs plumbing
  const dataReducer = {
    GREETING: ({ id }) => peerConnections[id].send({ type:'IDCARD', payload: idCard }),
    IDCARD: ({ id, payload, setPeerDataById }) => setPeerDataById(id, { idCard: payload }),
    PING: ({ id }) => peerConnections[id].send({ type: 'PONG' }),
    PONG: ({ id, peerData, setPeerDataById }) => setPeerDataById(id, {
      ping: Math.round((window.performance.now() - peerData[id].pingStart) / 2),
      pingStart: undefined,
    }),
    SETGAMESTATE: ({ payload }) => {
      // if gameobjects from payload ar missing add them
      payload.balls?.forEach(({ id, emojiId }) => {
        if (!scene.balls[id]) setBallById(id, { emojiId });
      });
      scene.setGameState(payload);
    },
  };
  
  const {
    peer,
    peerConnections,
    networkList,
    broadcast,
    // open,
    // peerData,
  } = usePeerJsMesh({
    networkName: 'polygon-pong-multiplayer',
    maxPeers: 9,
    active: enableNetwork && visibilityState === 'visible',
    dataReducer,
  });

  const enhancedNetworkList = networkList.map(entry => ({
    ...entry,
    ...(entry.type === 'local' && {idCard}),
  }));

  const hostId = enhancedNetworkList
    .reduce((prev, current) => {
      if (!current.idCard?.hostFitness) return prev;
      return (prev.idCard?.hostFitness > current.idCard.hostFitness) ? prev : current;
    }, {}).id;
  
  const networkOverview = [
    ...enhancedNetworkList.map(entry => ({
      ...entry,
      isHost: entry.id === hostId,
    })),
    ...cpuPlayers.map(cpuPlayer => ({
      ...cpuPlayer,
      type: 'cpu',
    })),
  ];

  const peerId = peer?.id;

  const isHost = peerId === hostId;

  useNetworkGame({
    gameReady,
    scene,
    peerId,
    isHost,
    players: networkOverview.filter(({ open }) => open),
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
        networkOverview,
        isHost,
        enableNetwork, setEnableNetwork,
        cpuPlayers, setCpuPlayerById, deleteCpuPlayerById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
