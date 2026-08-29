import type { PlantReport } from './plant-report.types';
import type {
  ArchiveStatus,
  PhotoEntry,
  Plant,
  PlantProfileUpdate,
  PotType,
  SubstrateType,
} from './plant.types';

interface SupabasePhotoRow {
  id: string;
  created_at: string;
  image_url: string | null;
  analysis: PlantReport | null;
  is_avatar: boolean;
}

interface SupabasePlantRow {
  id: string;
  name: string;
  photos: SupabasePhotoRow[];
  location_id: string | null;
  species_id: string | null;
  custom_species_name: string | null;
  purchased_at: string | null;
  pot_type: PotType | null;
  pot_diameter_cm: number | null;
  has_drainage: boolean | null;
  substrate_type: SubstrateType | null;
  is_archived: boolean;
  archive_status: ArchiveStatus | null;
  archive_reason_detail: string | null;
  archived_at: string | null;
}

export function mapPhotoRowToPhotoEntry(row: SupabasePhotoRow): PhotoEntry {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    imageUrl: row.image_url ?? undefined,
    analysis: row.analysis ?? undefined,
    isAvatar: row.is_avatar,
  };
}

export function mapPlantRowToPlant(row: SupabasePlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    photos: row.photos.map(mapPhotoRowToPhotoEntry),
    locationId: row.location_id,
    speciesId: row.species_id,
    customSpeciesName: row.custom_species_name,
    purchasedAt: row.purchased_at,
    potType: row.pot_type,
    potDiameterCm: row.pot_diameter_cm,
    hasDrainage: row.has_drainage,
    substrateType: row.substrate_type,
    isArchived: row.is_archived,
    archiveStatus: row.archive_status,
    archiveReasonDetail: row.archive_reason_detail,
    archivedAt: row.archived_at,
  };
}

/** Builds a partial Supabase update payload, touching only the fields that were actually passed. */
export function mapPlantProfileUpdateToRow(update: PlantProfileUpdate): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (update.name !== undefined) row.name = update.name;
  if (update.locationId !== undefined) row.location_id = update.locationId;
  if (update.speciesId !== undefined) row.species_id = update.speciesId;
  if (update.customSpeciesName !== undefined) row.custom_species_name = update.customSpeciesName;
  if (update.purchasedAt !== undefined) row.purchased_at = update.purchasedAt;
  if (update.potType !== undefined) row.pot_type = update.potType;
  if (update.potDiameterCm !== undefined) row.pot_diameter_cm = update.potDiameterCm;
  if (update.hasDrainage !== undefined) row.has_drainage = update.hasDrainage;
  if (update.substrateType !== undefined) row.substrate_type = update.substrateType;

  return row;
}
