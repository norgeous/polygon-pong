import React, { useState } from 'react';

import { useAppContext } from '../contexts/AppContext';

import usePeer from '../hooks/usePeer';
import usePhaser from '../hooks/usePhaser';
import useBattery from '../hooks/useBattery';
import useClock from '../hooks/useClock';

import MainMenu from './modals/MainMenu';
import Settings from './modals/Settings';
import Network from './modals/Network';
import Profile from './modals/Profile';
import {
  TopLeft,
  TopRight,
  BottomRight,
  Bottom,
  BottomLeft,
  PhaserDiv,
} from './styled/layout';
import { Button } from './styled/common';

const App = () => {
  const { route, setRoute } = useAppContext();
  const batteryPercent = useBattery();
  const clock = useClock();

  // const [position, setPosition] = useState(0);
  const [fps, setFps] = useState(0);

  const update = (scene) => {
    setFps(Math.round(scene.game.loop.actualFps));
  };

  const { score, game } = usePhaser({ update });
  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer();

  // useEffect(() => broadcast({ position }), [position]);

  // console.log(game);

  return (
    <>
      <MainMenu
        open={route === 'MAINMENU'}
        onClose={() => setRoute()}
        setRoute={setRoute}
      />
      <Settings
        open={route === 'SETTINGS'}
        onClose={() => setRoute()}
        setRoute={setRoute}
      />
      <Network
        open={route === 'NETWORK'}
        onClose={() => setRoute()}
        hardCodedPeerIds={hardCodedPeerIds}
        peerId={peerId}
        connections2={connections2}
        broadcast={broadcast}
        peerData={peerData}
      />
      <Profile
        open={route === 'PROFILE'}
        onClose={() => setRoute()}
        setRoute={setRoute}
        fps={fps}
        targetFps={game?.loop?.targetFps}
      />
      <TopLeft>
        ❤️❤️🖤 {1000000 + score}
      </TopLeft>
      <TopRight>
        <Button onClick={() => setRoute('NETWORK')}>🙎x{connections2.length + 1}</Button>
        {batteryPercent > 50 ? '🔋' : '🪫'}{batteryPercent}%
        <Button onClick={() => setRoute('SETTINGS')}>⚙️</Button>
      </TopRight>
      <BottomRight>
        🪙x22
      </BottomRight>
      <Bottom>
      </Bottom>
      <BottomLeft>{clock}</BottomLeft> 
      <PhaserDiv />
    </>
  );
};

export default App;
