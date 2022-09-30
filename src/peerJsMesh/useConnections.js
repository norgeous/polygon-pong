import { useReducer, useEffect } from 'react';

const useConnections = ({ peerIds, peer }) => {
  const [peerConnections, dispatch] = useReducer((state, { type, payload }) => {
    return ({
      ADD: dataConnection => ({
        ...state,
        [dataConnection.peer]: dataConnection,
      }),
      REMOVE: ({ id }) => Object.fromEntries(Object.entries(state).filter(([key]) => key !== id)),
    })[type]?.(payload);
  }, {});

  // when joining peerjs
  useEffect(() => {
    if (peer) {
      // listen for incoming connections
      peer.on('connection', dataConnection => dispatch({ type: 'ADD', payload: dataConnection }));

      // try to establish outgoing connections to all predefined peer ids (except ours)
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const dataConnection  = peer.connect(id, { label: 'data' });
        dispatch({ type: 'ADD', payload: dataConnection });
      });
    }
  }, [peer]);

  return [peerConnections, dispatch];
};

export default useConnections;