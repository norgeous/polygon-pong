import React from 'react';
import { Overlay, OverlayInner } from './styled/layout';

const Modal = ({ onClose, children }) => (
  <Overlay onClick={() => onClose()}>
    <OverlayInner onClick={e => e.stopPropagation()}>
      {children}
    </OverlayInner>
  </Overlay>
);

export default Modal;
