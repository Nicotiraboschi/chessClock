import { createContext, useContext } from 'react';
import { useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [initialSeconds, setInitialSeconds] = useState(180);
  const [isStarted, setIsStarted] = useState(false);
  const [toTimer, setToTimer] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState('');

  return (
    <AppContext.Provider
      value={{
        initialSeconds,
        setInitialSeconds,
        isStarted,
        setIsStarted,
        toTimer,
        setToTimer,
        joinedRoom,
        setJoinedRoom,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
