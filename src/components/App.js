import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import usePeer from '../hooks/usePeer';
import usePhaser from '../hooks/usePhaser';
import useBattery from '../hooks/useBattery';
import useClock from '../hooks/useClock';

import MainMenu from './modals/MainMenu';
import Settings from './modals/Settings';
import Network from './modals/Network';
import { TopLeft, TopRight, BottomRight, Bottom, BottomLeft } from './styled/layout';
import { Button } from './styled/common';

const Div = styled.div`
  background-color: #111;
  canvas {
    image-rendering: pixelated;
  }
`;

const App = () => {
  const batteryPercent = useBattery();
  const clock = useClock();
  const [route, setRoute] = useState('MAINMENU');
  const [position, setPosition] = useState(0);
  const [fps, setFps] = useState(0);

  const update = (scene) => {
    setFps(Math.round(scene.game.loop.actualFps));
  };

  const { score, game } = usePhaser({ update });
  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer();

  useEffect(() => broadcast({ position }), [position]);

  const setPlayerPosition = p => {
    setPosition(p);
    // console.log(game.scene.scenes[0].children.list.find(({name}) => name === 'player'))
    const player = game.scene.scenes[0].children.list.find(({name}) => name === 'player');
    // console.log({game, player});
    player.setVelocity(p,0);
  };

  console.log(game);

  // if (!game) return null;

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
        ❤️❤️🖤
        <br/>
        <br/>
        {1000000 + score} {fps}/{game?.loop?.targetFps}fps
      </TopLeft>
      <TopRight>
        <Button onClick={() => setRoute('NETWORK')}>🙎x{connections2.length + 1}</Button>
        {batteryPercent > 50 ? '🔋' : '🪫'}{batteryPercent}%
        <Button onClick={() => setRoute('SETTINGS')}>⚙️</Button>
      </TopRight>
      <BottomRight>🪙x22</BottomRight>
      <Bottom>
        <input
          type="range"
          min={-50}
          max={50}
          step={1}
          value={position}
          onChange={e => setPlayerPosition(e.target.value)}
          onTouchEnd={() => setPlayerPosition(0)}
          onMouseUp={() => setPlayerPosition(0)}
        />
      </Bottom>
      <BottomLeft>{clock}</BottomLeft> 
      <Div id="phaser"></Div>
    </>
  );
};

export default App;
