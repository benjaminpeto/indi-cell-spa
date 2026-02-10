import { formatMaybeArray, formatWeight } from '../../../shared/utils/format-reponse';
import type { ApiProductDetails, ProductOption } from '../../../types/api';

type SpecRow = {
  label: string;
  value: string | null;
};

export function getSelectedOptionCode(selectedCode: number | null, options: ProductOption[]) {
  return selectedCode ?? options[0]?.code ?? null;
}

export function buildSpecs(data: ApiProductDetails): SpecRow[] {
  const screenResolution = data.displaySize?.trim() || null;
  const screenSize = data.displayResolution?.trim() || null;
  const cameras = [formatMaybeArray(data.primaryCamera), formatMaybeArray(data.secondaryCmera)]
    .filter(Boolean)
    .join(' / ');

  return [
    { label: 'Brand', value: data.brand?.trim() || null },
    { label: 'Model', value: data.model?.trim() || null },
    { label: 'CPU', value: data.cpu?.trim() || null },
    { label: 'RAM', value: data.ram?.trim() || null },
    { label: 'Operating System', value: data.os?.trim() || null },
    { label: 'Screen resolution', value: screenResolution },
    { label: 'Screen size', value: screenSize },
    { label: 'Battery', value: data.battery?.trim() || null },
    { label: 'Cameras', value: cameras || null },
    { label: 'Dimensions', value: data.dimentions?.trim() || null },
    { label: 'Weight', value: formatWeight(data.weight) },
  ].filter(row => row.value !== null);
}
