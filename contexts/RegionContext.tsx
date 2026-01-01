import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RegionName = 'sundessa' | 'mantora' | 'torgul' | 'ridian' | 'jakkar' | 'olma';

interface RegionContextType {
  region: RegionName;
  setRegion: (region: RegionName) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<RegionName>('sundessa');

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
