import React from 'react';
import { usePlants } from '../hooks/usePlants';
import { PlantsContext } from './PlantsContext';

export const PlantsProvider = ({ children }: { children: React.ReactNode }) => {
  const { plants, addPlant, loading } = usePlants();

  return <PlantsContext.Provider value={{ plants, addPlant, loading }}>{children}</PlantsContext.Provider>;
};
