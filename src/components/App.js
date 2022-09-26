import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainMenu from './modals/MainMenu';
import Settings from './modals/Settings';
import Network from './modals/Network';
import Profile from './modals/Profile';
import HostControls from './modals/HostControls';
import {
  TopLeft,
  TopRight,
  BottomRight,
  Bottom,
  BottomLeft,
  PhaserDiv,
  FpsCounter,
} from './styled/layout';
import { Button } from './styled/common';
import { getUiIcon, getGameIcon } from '../utils/emoji';

const App = () => {
  const {
    route, setRoute,
    showFps, fps,
    connections,
    sysInfo,
  } = useAppContext();
  
  const { batteryAvailable, batteryPercent, clock } = sysInfo;

  const isHost = connections.find(({ connectionType }) => connectionType === 'local')?.isHost;
  const connectionCount = connections.reduce((acc, {connection}) => connection?.open ? acc+1 : acc, 0);

  return (
    <>
      {route === 'MAINMENU' && <MainMenu />}
      {route === 'SETTINGS' && <Settings />}
      {route === 'NETWORK' && <Network />}
      {route === 'PROFILE' && <Profile />}
      {route === 'HOSTCONTROLS' && <HostControls />}

      <TopLeft>
        {getGameIcon('heart_on')}
        {getGameIcon('heart_on')}
        {getGameIcon('heart_off')}
        <br/>
        <br/>
        1,000,023
        <br/>
        <br/>
        {showFps && <FpsCounter>{fps}</FpsCounter>}
      </TopLeft>
      <TopRight>
        {isHost && (
          <Button onClick={() => setRoute('HOSTCONTROLS')}>
            {getUiIcon('host')}
          </Button>
        )}
        <Button onClick={() => setRoute('NETWORK')}>
          {connectionCount ? `${getUiIcon('network')}×${connectionCount}` : getUiIcon('disconnected')}
        </Button>
        <Button onClick={() => setRoute('SETTINGS')}>{getUiIcon('settings')}</Button>
      </TopRight>
      <BottomRight>
        {getGameIcon('coin')}×22
      </BottomRight>
      <Bottom>
      </Bottom>
      <BottomLeft>
        {clock}
        {' '}
        {batteryAvailable ?
          `${batteryPercent > 50 ? getUiIcon('battery_full') : getUiIcon('battery_half')}${batteryPercent}%` :
          getUiIcon('toolbox')
        }
      </BottomLeft> 
      <PhaserDiv />
    </>
  );
};

export default App;
