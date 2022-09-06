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
            <img src="icon.svg" width="80" />
            <div>
              <Heading>gh-pages-pwa!</Heading>
              <A href="https://github.com/norgeous/gh-pages-pwa/" target="_blank">
                norgeous/gh-pages-pwa
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
