import type { PlantReport } from './plant-report.types';

export type PotType = 'plastic' | 'terracotta' | 'ceramic_glazed' | 'self_watering';
export type SubstrateType = 'standard' | 'aroid_mix' | 'mineral' | 'other';
export type ArchiveStatus = 'died' | 'given_away_or_sold' | 'other';

export interface PhotoEntry {
  id: string;
  createdAt: number;
  image?: Blob;
  imageUrl?: string;
  analysis?: PlantReport;
  isAvatar?: boolean;
}

export interface Plant {
  id: string;
  name: string;
  photos: PhotoEntry[];
  locationId: string | null;
  speciesId: string | null;
  customSpeciesName: string | null;
  purchasedAt: string | null;
  potType: PotType | null;
  potDiameterCm: number | null;
  hasDrainage: boolean | null;
  substrateType: SubstrateType | null;
  isArchived: boolean;
  archiveStatus: ArchiveStatus | null;
  archiveReasonDetail: string | null;
  archivedAt: string | null;
}

/** Profile defaults for a freshly created plant that hasn't been placed in a location or archived. */
export const EMPTY_PLANT_PROFILE: Omit<Plant, 'id' | 'name' | 'photos'> = {
  locationId: null,
  speciesId: null,
  customSpeciesName: null,
  purchasedAt: null,
  potType: null,
  potDiameterCm: null,
  hasDrainage: null,
  substrateType: null,
  isArchived: false,
  archiveStatus: null,
  archiveReasonDetail: null,
  archivedAt: null,
};

export interface PlantProfileUpdate {
  name?: string;
  locationId?: string | null;
  speciesId?: string | null;
  customSpeciesName?: string | null;
  purchasedAt?: string | null;
  potType?: PotType | null;
  potDiameterCm?: number | null;
  hasDrainage?: boolean | null;
  substrateType?: SubstrateType | null;
}

export interface PlantsRepository {
  getAll(): Promise<Plant[]>;
  getActive(): Promise<Plant[]>;
  getArchived(): Promise<Plant[]>;
  save(plant: Plant): Promise<void>;
  addPhoto(plantId: string, photo: PhotoEntry): Promise<void>;
  setAvatarPhoto(plantId: string, photoId: string): Promise<void>;
  updateProfile(plantId: string, update: PlantProfileUpdate): Promise<void>;
  archive(plantId: string, status: ArchiveStatus, reasonDetail?: string | null): Promise<void>;
  restore(plantId: string): Promise<void>;
}
