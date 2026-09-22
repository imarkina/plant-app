import type { PlantReport } from './plant-report.types';

export type PotType = 'plastic' | 'terracotta' | 'ceramic_glazed' | 'self_watering';
export type SubstrateType = 'standard' | 'aroid_mix' | 'mineral' | 'other';
export type PhotoType = 'growth' | 'purchase' | 'diagnosis' | 'archive';

export interface PhotoEntry {
  id: string;
  createdAt: number;
  image?: Blob;
  imageUrl?: string;
  analysis?: PlantReport;
  isAvatar?: boolean;
  type: PhotoType;
  note?: string;
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
}

/** Profile defaults for a freshly created plant that hasn't been placed in a location. */
export const EMPTY_PLANT_PROFILE: Omit<Plant, 'id' | 'name' | 'photos'> = {
  locationId: null,
  speciesId: null,
  customSpeciesName: null,
  purchasedAt: null,
  potType: null,
  potDiameterCm: null,
  hasDrainage: null,
  substrateType: null,
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
  /** Возвращает сохранённое растение с разрешёнными imageUrl у фото — чтобы вызывающий код мог обновить кэш без повторного getAll(). */
  save(plant: Plant): Promise<Plant>;
  /** Возвращает сохранённое фото с разрешённым imageUrl — по той же причине. */
  addPhoto(plantId: string, photo: PhotoEntry): Promise<PhotoEntry>;
  deletePhoto(plantId: string, photoId: string): Promise<void>;
  updatePhotoType(photoId: string, type: PhotoType): Promise<void>;
  setAvatarPhoto(plantId: string, photoId: string): Promise<void>;
  updateProfile(plantId: string, update: PlantProfileUpdate): Promise<void>;
  /** Безвозвратное удаление: сами фото из Storage, строки photos/care_tasks/plants. */
  deletePlant(plantId: string): Promise<void>;
}
