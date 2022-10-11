import { useState, useMemo } from 'react';

const useStateArray = (initialValue = {}) => {
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

  const a = useMemo(() => Object.entries(o).map(([id, data]) => ({
    id,
    ...data
  })), [o]);

  return [
    a, // read
    setById, // create / update
    deletebyId // delete
  ];
};

export default useStateArray;
