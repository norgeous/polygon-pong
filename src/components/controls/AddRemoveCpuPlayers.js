import React from 'react';
import { getPlayerTypeIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import AddRemove from '../AddRemove';

const getNewId = () => Math.random().toString().replace('0.','');

const AddRemoveCpuPlayers = () => {
  const {
    players,
    setPlayerById,
    deletePlayerById,
  } = useAppContext();

  const localPlayers = players.filter(({ type }) => type === 'local');
  const remotePlayers = players.filter(({ type }) => type === 'remote');
  const cpuPlayers = players.filter(({ type }) => type === 'cpu');

  return (
    <>
      <AddRemove
        item={`${getPlayerTypeIcon('local')}`}
        count={localPlayers.length}
        add={() => {
          setPlayerById(getNewId(), {
            type: 'local',
            idCard: {},
          });
        }}
        remove={() => deletePlayerById(localPlayers[0].id)}
      />
      <AddRemove
        item={`${getPlayerTypeIcon('remote')}`}
        count={remotePlayers.length}
        add={() => {
          setPlayerById(getNewId(), {
            type: 'remote',
            idCard: {},
          });
        }}
        remove={() => deletePlayerById(remotePlayers[0].id)}
      />
      <AddRemove
        item={`${getPlayerTypeIcon('cpu')}`}
        count={cpuPlayers.length}
        add={() => {
          setPlayerById(getNewId(), {
            type: 'cpu',
            behaviour: 'nearest ball',
            movementSpeed: 1,
            idCard: {},
          });
        }}
        remove={() => deletePlayerById(cpuPlayers[0].id)}
      />
    </>
  );
};

export default AddRemoveCpuPlayers;