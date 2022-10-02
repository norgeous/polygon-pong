import React from 'react';
import { getUiIcon, ballEmojis } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Sideways, Button } from '../styled/menu';

const HostControls = () => {
  const {
    setRoute,
    flatBalls,
    setBallById,
    removeBallById,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      {getUiIcon('add')} Add Ball
      <Sideways>
        {ballEmojis.map(e => (
          <Button onClick={() => setBallById(e, { emoji: e })}>
            {e}
          </Button>
        ))}
      </Sideways>

      {getUiIcon('remove')} Remove Ball
      <Sideways>
        {flatBalls.map((ball) => (
          <Button onClick={() => removeBallById(ball.id)}>
            {ball.emoji}
          </Button>
        ))}
      </Sideways>
    </Modal>
  );
};

export default HostControls;
