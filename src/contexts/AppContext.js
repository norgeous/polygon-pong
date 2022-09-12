import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [route, setRoute] = useState('MAINMENU');

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
