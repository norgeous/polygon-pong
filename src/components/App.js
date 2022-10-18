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
import { formatNumber } from '../utils/formatNumber';
import AddRemoveCpuPlayers from './controls/AddRemoveCpuPlayers';
import HealthBar from './HealthBar';

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
        {getGameIcon('coin')}×{formatNumber(0,2)}
        &emsp;
        {formatNumber(1,7)}
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
        <Button onClick={() => setRoute('PLAYERS')}>
          {players.length ? `${getUiIcon('network')}×${players.length}` : getUiIcon('disconnected')}
        </Button>
        <Button onClick={() => setRoute('SETTINGS')}>{getUiIcon('settings')}</Button>
        <AddRemoveCpuPlayers />
      </TopRight>
      <BottomRight>
      </BottomRight>
      <Bottom>
        <HealthBar value={2} max={5}/>
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
