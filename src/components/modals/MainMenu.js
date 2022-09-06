import React from 'react';
import Modal from '../Modal';
import { FlexR, Heading, A } from '../styled/common';
import { Button } from '../styled/menu';

const MainMenu = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <Modal onClose={onClose}>
          <FlexR>
            <img src="icon.svg" width="60" />
            <div>
              <Heading>Polygon Pong</Heading>
              <A href="https://github.com/norgeous/polygon-pong/" target="_blank">
                norgeous/polygon-pong
              </A>
            </div>
          </FlexR>
          <Button onClick={onClose}><span>🕹️</span><span>Join Multiplayer (WIP)</span></Button>
        </Modal>
      )}
    </>
  );
};

export default MainMenu;
