import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import AddRemove from '../AddRemove';

const AddRemoveCpuPlayers = () => {
  const {
    players,
    setPlayerById,
    deletePlayerById,
  } = useAppContext();

  const cpuPlayers = players.filter(({ type }) => type === 'cpu');

  return (
    <AddRemove
      item={`${getUiIcon('cpu')}`}
      count={players.length}
      add={() => {
        const newId = Math.random().toString().replace('0.','');
        setPlayerById(newId, {
          type: 'cpu',
          behaviour: 'nearestBall',
          movementSpeed: 1,
          idCard: {},
        });
      }}
      remove={() => {
        const firstAdded = cpuPlayers[0];
        deletePlayerById(firstAdded.id);
      }}
    />
  );
};

export default AddRemoveCpuPlayers;