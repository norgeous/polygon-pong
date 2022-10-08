import React from 'react';
import { getUiIcon, ballEmojis } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Sideways, Outline, Button } from '../styled/menu';

const AddRemoveControl = ({item, count = 0, add, remove}) => {
  return (
    <Sideways>
      <Outline>
        <Button onClick={remove}>
          {getUiIcon('remove')}
        </Button>
        {item}×{String(Math.round(count)).padStart(2, '0')}
        <Button onClick={add}>
          {getUiIcon('add')}
        </Button>
      </Outline>
    </Sideways>
  );
};

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
      <Sideways>
        {ballEmojis.map((e, i) => (
          <AddRemoveControl
            item={e}
            count={ballsArray.filter(({ emojiId }) => emojiId === i).length}
            add={() => randomBall(e)}
            remove={() => {
              const firstAdded = ballsArray.find(({ emojiId }) => emojiId === i);
              deleteBallById(firstAdded.id);
            }}
          />
        ))}
      </Sideways>

      <AddRemoveControl
        item={`${getUiIcon('cpu')}`}
        count={0}
      />
    </Modal>
  );
};

export default HostControls;
