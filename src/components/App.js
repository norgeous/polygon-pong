import React, { useState, useEffect } from 'react';

import usePeer from '../hooks/usePeer';
import usePhaser from '../hooks/usePhaser';
import useBattery from '../hooks/useBattery';
import useClock from '../hooks/useClock';
import useSystemInfo from '../hooks/useSystemInfo';

import MainMenu from './modals/MainMenu';
import Settings from './modals/Settings';
import Network from './modals/Network';
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
  const batteryPercent = useBattery();
  const clock = useClock();
  const hostFitness = useSystemInfo();

  const [route, setRoute] = useState('MAINMENU');
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
      <TopLeft>
        ❤️❤️🖤 {1000000 + score}
        <br/>
        <br/>
        {fps}/{game?.loop?.targetFps}fps
      </TopLeft>
      <TopRight>
        <Button onClick={() => setRoute('NETWORK')}>🙎x{connections2.length + 1}</Button>
        {batteryPercent > 50 ? '🔋' : '🪫'}{batteryPercent}%
        <Button onClick={() => setRoute('SETTINGS')}>⚙️</Button>
      </TopRight>
      <BottomRight>
        🪙x22
        {/* <pre>{JSON.stringify(hostFitness,null,2)}</pre> */}
      </BottomRight>
      <Bottom>
        {/* <button onClick={() => {
          const player = game.scene.scenes[0].children.list.find(({name}) => name === 'player');
          player.setVelocity(0,-10);
        }}>fire</button> */}
      </Bottom>
      <BottomLeft>{clock}</BottomLeft> 
      <PhaserDiv />
    </>
  );
};

export default App;
