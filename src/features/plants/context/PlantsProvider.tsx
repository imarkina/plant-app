import React from 'react';
import { usePlants } from '../hooks/usePlants';
import { PlantsContext } from './PlantsContext';

export const PlantsProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    plants,
    loading,
    addPlant,
    addPhoto,
    deletePhoto,
    setAvatarPhoto,
    updateProfile,
    archive,
    restore,
    deletePlant,
  } = usePlants();

  return (
    <PlantsContext.Provider
      value={{
        plants,
        loading,
        addPlant,
        addPhoto,
        deletePhoto,
        setAvatarPhoto,
        updateProfile,
        archive,
        restore,
        deletePlant,
      }}
    >
      {children}
    </PlantsContext.Provider>
  );
};
