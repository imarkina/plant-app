import { useContext } from 'react';
import { PlantsContext } from '../context/PlantsContext';

export const usePlantsContext = () => {
  const context = useContext(PlantsContext);

  if (!context) {
    throw new Error('context must be inside a provider');
  }

  return context;
};
