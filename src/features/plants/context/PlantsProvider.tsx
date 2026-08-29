import React from 'react';
import { usePlants } from '../hooks/usePlants';
import { PlantsContext } from './PlantsContext';

export const PlantsProvider = ({ children }: { children: React.ReactNode }) => {
  const { plants, addPlant, loading, addPhoto } = usePlants();

  return (
    <PlantsContext.Provider value={{ plants, addPlant, loading, addPhoto }}>
      {children}
    </PlantsContext.Provider>
  );
};
