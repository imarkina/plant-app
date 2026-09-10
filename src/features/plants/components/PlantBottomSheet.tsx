import type { Plant } from '../models/plant.types';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { PlantDetailTabs } from './PlantDetailTabs';

type Props = {
  plant: Plant;
  open: boolean;
  onClose: () => void;
};

const TITLE_ID = 'plant-sheet-title';

/**
 * Родитель должен держать `plant` последним выбранным значением (не обнулять
 * его при закрытии), иначе контент исчезнет раньше, чем доиграет анимация
 * BottomSheet.
 */
export const PlantBottomSheet = ({ plant, open, onClose }: Props) => {
  return (
    <BottomSheet open={open} onClose={onClose} labelledBy={TITLE_ID}>
      <PlantDetailTabs plant={plant} onBack={onClose} embedded titleId={TITLE_ID} />
    </BottomSheet>
  );
};
