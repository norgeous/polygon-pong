import React from 'react';
import { Overlay, OverlayInner, Title } from './styled/layout';

const Modal = ({ onClose, title, children }) => (
  <Overlay onClick={() => onClose()}>
    <OverlayInner onClick={e => e.stopPropagation()}>
      {title && <Title>{title}</Title>}
      {children}
    </OverlayInner>
  </Overlay>
);

export default Modal;
