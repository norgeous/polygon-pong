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
import { getUiIcon, getGameIcon } from '../utils/emoji';

const App = () => {
  const {
    route, setRoute,
    connections,
    sysInfo,
  } = useAppContext();
  
  const { batteryPercent, clock } = sysInfo;

  return (
    <>
      {route === 'MAINMENU' && <MainMenu />}
      {route === 'SETTINGS' && <Settings />}
      {route === 'NETWORK' && <Network />}
      {route === 'PROFILE' && <Profile/>}

      <TopLeft>
        {getGameIcon('heart_on')}
        {getGameIcon('heart_on')}
        {getGameIcon('heart_off')}
        <br/>
        <br/>
        1,000,023
      </TopLeft>
      <TopRight>
        <Button onClick={() => setRoute('NETWORK')}>{getUiIcon('network')}x{connections.length}</Button>
        <Button onClick={() => setRoute('PROFILE')}>
          {!!batteryPercent ?
            `${batteryPercent > 50 ? getUiIcon('battery_full') : getUiIcon('battery_half')}${batteryPercent}` :
            getUiIcon('toolbox')
          }
        </Button>
        <Button onClick={() => setRoute('SETTINGS')}>{getUiIcon('settings')}</Button>
      </TopRight>
      <BottomRight>
        {getGameIcon('coin')}x22
      </BottomRight>
      <Bottom>
      </Bottom>
      <BottomLeft>{clock}</BottomLeft> 
      <PhaserDiv />
    </>
  );
};

export default App;
