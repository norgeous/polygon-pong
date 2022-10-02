import React from 'react';
import { getUiIcon, ballEmojis } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Sideways, Button } from '../styled/menu';

const HostControls = () => {
  const {
    setRoute,
    ballsArray,
    setBallById,
    deleteBallById,
  } = useAppContext();

  const randomBall = emoji => {
    const newId = Math.random().toString().replace('0.','');
    const newData = {
      emojiId: ballEmojis.findIndex(b => b === emoji),
    };
    setBallById(newId, newData);
  };

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      {getUiIcon('add')} Add Ball
      <Sideways>
        {ballEmojis.map(e => <Button onClick={() => randomBall(e)}>{e}</Button>)}
      </Sideways>

      {getUiIcon('remove')} Remove Ball
      <Sideways>
        {ballsArray.map(({id, emojiId}) => (
          <Button onClick={() => deleteBallById(id)}>
            {ballEmojis[emojiId]}
          </Button>
        ))}
      </Sideways>
    </Modal>
  );
};

export default HostControls;
