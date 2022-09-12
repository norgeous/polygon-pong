import React from 'react';
import { useAppContext } from '../contexts/AppContext';
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
  const {
    route, setRoute,
    connections2,
    clock,
    batteryPercent,
  } = useAppContext();

  return (
    <>
      {route === 'MAINMENU' && <MainMenu />}
      {route === 'SETTINGS' && <Settings />}
      {route === 'NETWORK' && <Network />}
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
