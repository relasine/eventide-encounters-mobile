import React, { createContext, useContext, useState, ReactNode } from 'react';
import { randomRolls } from '@/constants/types';

interface RollContextType {
  roll: randomRolls;
  setRoll: (roll: randomRolls) => void;
}

const RollContext = createContext<RollContextType | undefined>(undefined);

export function RollProvider({ children }: { children: ReactNode }) {
  const [roll, setRoll] = useState<randomRolls>('d6');

  return (
    <RollContext.Provider value={{ roll, setRoll }}>
      {children}
    </RollContext.Provider>
  );
}

export function useRoll() {
  const context = useContext(RollContext);
  if (context === undefined) {
    throw new Error('useRoll must be used within a RollProvider');
  }
  return context;
}

