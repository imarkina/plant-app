export interface Species {
  id: string;
  commonName: string;
  botanicalName: string | null;
}

export interface SpeciesRepository {
  getAll(): Promise<Species[]>;
}
