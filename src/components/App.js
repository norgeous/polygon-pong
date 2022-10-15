import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainMenu from './modals/MainMenu';
import Settings from './modals/Settings';
import PlayerList from './modals/PlayerList';
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
import AddRemoveCpuPlayers from './controls/AddRemoveCpuPlayers';

const App = () => {
  const {
    route, setRoute,
    showFps, fps,
    players,
    sysInfo,
    isHost,
  } = useAppContext();
  
  const { batteryAvailable, batteryPercent, clock } = sysInfo;

  return (
    <>
      {route === 'MAINMENU' && <MainMenu />}
      {route === 'SETTINGS' && <Settings />}
      {route === 'PLAYERS' && <PlayerList />}
      {route === 'PROFILE' && <Profile />}
      {route === 'HOSTCONTROLS' && <HostControls />}

      <TopLeft>
        {getGameIcon('heart_on')}
        {getGameIcon('heart_on')}
        {getGameIcon('heart_off')}
        &emsp;
        {getGameIcon('coin')}×22
        &emsp;
        1,000,024
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
        <AddRemoveCpuPlayers />
        <Button onClick={() => setRoute('PLAYERS')}>
          {players.length ? `${getUiIcon('network')}×${players.length}` : getUiIcon('disconnected')}
        </Button>
        <Button onClick={() => setRoute('SETTINGS')}>{getUiIcon('settings')}</Button>
      </TopRight>
      {/* <BottomRight>
      </BottomRight> */}
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
