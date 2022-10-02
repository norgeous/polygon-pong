import { useState, useMemo } from 'react';

const useStateObject = (initialValue = {}) => {
  const [o, setO] = useState(initialValue);

  const setById = (id, data) => setO(oldO => ({
    ...oldO,
    [id]: {
      ...oldO[id],
      ...data,
    },
  }));

  const deletebyId = deleteId => setO(oldO => Object.fromEntries(
    Object.entries(oldO)
      .filter(([id]) => id !== deleteId)
  ));

  const flat = useMemo(() => Object.entries(o).map(([id, data]) => ({
    id,
    ...data
  })), [o]);

  return [
    o, // read
    flat, // read
    setById, // create / update
    deletebyId // delete
  ];
};

export default useStateObject;
