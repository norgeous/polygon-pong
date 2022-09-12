import React from 'react';

import { useAppContext } from '../contexts/AppContext';

import usePeer from '../hooks/usePeer';
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
  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer();

  // useEffect(() => broadcast({ position }), [position]);

  // http://ip-api.com/json/[ip.here]?fields=countryCode,zip

  return (
    <>
      {route === 'MAINMENU' && <MainMenu />}
      {route === 'SETTINGS' && <Settings />}
      <Network
        open={route === 'NETWORK'}
        onClose={() => setRoute()}
        hardCodedPeerIds={hardCodedPeerIds}
        peerId={peerId}
        connections2={connections2}
        broadcast={broadcast}
        peerData={peerData}
      />
      {route === 'PROFILE' && <Profile/>}
      <TopLeft>
        ❤️❤️🖤 1,000,001
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
