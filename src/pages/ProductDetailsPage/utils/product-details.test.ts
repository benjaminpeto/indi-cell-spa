import { describe, expect, it } from 'vitest';

import type { ApiProductDetails } from '../../../types/api';
import { buildSpecs, getSelectedOptionCode } from './product-details';

describe('getSelectedOptionCode', () => {
  it('returns selected code when provided', () => {
    expect(getSelectedOptionCode(2000, [{ code: 1000, name: 'Black' }])).toBe(2000);
  });

  it('falls back to first option code when selected code is null', () => {
    expect(
      getSelectedOptionCode(null, [
        { code: 1000, name: 'Black' },
        { code: 1001, name: 'Gold' },
      ]),
    ).toBe(1000);
  });

  it('returns null when no selected code and no options exist', () => {
    expect(getSelectedOptionCode(null, [])).toBeNull();
  });
});

describe('buildSpecs', () => {
  it('builds spec rows with formatted cameras and numeric weight', () => {
    const data = {
      id: '1',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170',
      imgUrl: 'x',
      cpu: 'Quad-core',
      ram: '2 GB',
      os: 'Android',
      displaySize: '720 x 1280 pixels',
      displayResolution: '7.0 inches',
      battery: '3400 mAh',
      primaryCamera: ['13 MP', 'autofocus'],
      secondaryCmera: ['2 MP'],
      dimentions: '191.7 x 101 x 9.4 mm',
      weight: '260',
    } satisfies ApiProductDetails;

    const specs = buildSpecs(data);

    expect(specs).toContainEqual({ label: 'Brand', value: 'Acer' });
    expect(specs).toContainEqual({ label: 'Cameras', value: '13 MP, autofocus / 2 MP' });
    expect(specs).toContainEqual({ label: 'Weight', value: '260 g' });
  });

  it('omits null/empty values from output', () => {
    const data = {
      id: '1',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170',
      imgUrl: 'x',
      cpu: '',
      ram: undefined,
      os: 'Android',
      displaySize: '',
      displayResolution: '',
      battery: '',
      primaryCamera: [],
      secondaryCmera: [],
      dimentions: '',
      weight: '',
    } satisfies ApiProductDetails;

    const specs = buildSpecs(data);

    expect(specs.find(row => row.label === 'CPU')).toBeUndefined();
    expect(specs.find(row => row.label === 'RAM')).toBeUndefined();
    expect(specs.find(row => row.label === 'Battery')).toBeUndefined();
    expect(specs.find(row => row.label === 'Cameras')).toBeUndefined();
    expect(specs.find(row => row.label === 'Weight')).toBeUndefined();
    expect(specs).toContainEqual({ label: 'Brand', value: 'Acer' });
    expect(specs).toContainEqual({ label: 'Operating System', value: 'Android' });
  });
});
