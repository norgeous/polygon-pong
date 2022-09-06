import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import usePeer from '../hooks/usePeer';
import usePhaser from '../hooks/usePhaser';

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
  const [route, setRoute] = useState('MAINMENU');
  const [position, setPosition] = useState(0);

  const { score, game } = usePhaser();
  const { hardCodedPeerIds, peerId, connections2, broadcast, peerData } = usePeer();

  useEffect(() => broadcast({ position }), [position]);

  const setPlayerPosition = p => {
    setPosition(p);
    const player = game.scene.scenes[0].physics.world.bodies.entries.find(({gameObject}) => gameObject.name === 'player');
    console.log({game, player});
    player.setVelocity(p,0);
  };

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
      />
      <TopLeft>{1000000 + score}</TopLeft>
      <TopRight>
        <Button onClick={() => setRoute('NETWORK')}>🙎x{connections2.length + 1}</Button>
        <Button onClick={() => setRoute('SETTINGS')}>⚙️</Button>
      </TopRight>
      <BottomRight>🪙x22</BottomRight>
      <Bottom>
        <pre>{JSON.stringify(peerData, null, 2)}</pre>
        <input
          type="range"
          min={-500}
          max={500}
          step={1}
          value={position}
          onChange={e => setPlayerPosition(e.target.value)}
          onTouchEnd={() => setPlayerPosition(0)}
          onMouseUp={() => setPlayerPosition(0)}
        />
      </Bottom>
      <BottomLeft>❤️❤️🖤</BottomLeft> 
      <Div id="phaser"></Div>
    </>
  );
};

export default App;
