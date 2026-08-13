import React from 'react';
import { usePlants } from '../hooks/usePlants';
import { PlantsContext } from './PlantsContext';

export const PlantsProvider = ({ children }: { children: React.ReactNode }) => {
  const { plants, addPlant } = usePlants();

  return <PlantsContext.Provider value={{ plants, addPlant }}>{children}</PlantsContext.Provider>;
};
