import { describe, it, expect } from 'vitest';
import { filterListings } from './filters';
import { EnrichedListing, FilterState } from '../types';

const mockListing = (overrides: Partial<EnrichedListing> = {}): EnrichedListing => ({
  id: '1',
  price: 1000, // $10.00
  discount_percentage: 10,
  total_sticker_value: 500, // $5.00
  item: {
    market_hash_name: 'AK-47 | Redline (Field-Tested)',
    is_stattrak: false,
    is_souvenir: false,
    float_value: 0.2,
  },
  ...overrides,
} as EnrichedListing);

const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 0,
  minDiscount: 0,
  minStickerValue: 0,
  skinSearch: '',
  weaponSearch: '',
  itemTypes: [],
  minFloat: 0,
  maxFloat: 1,
  showOverpriced: false,
};

describe('filterListings - Discount and Sticker Filters', () => {
  it('should filter by minDiscount when only minDiscount is set', () => {
    const listings = [
      mockListing({ id: '1', discount_percentage: 5 }),
      mockListing({ id: '2', discount_percentage: 15 }),
    ];
    const filters = { ...defaultFilters, minDiscount: 10 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter by minStickerValue when only minStickerValue is set', () => {
    const listings = [
      mockListing({ id: '1', total_sticker_value: 200 }), // $2.00
      mockListing({ id: '2', total_sticker_value: 800 }), // $8.00
    ];
    const filters = { ...defaultFilters, minStickerValue: 5 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should include listing if it meets EITHER minDiscount OR minStickerValue when both are set', () => {
    const listings = [
      mockListing({ id: '1', discount_percentage: 5, total_sticker_value: 200 }), // Neither
      mockListing({ id: '2', discount_percentage: 15, total_sticker_value: 200 }), // Meets discount only
      mockListing({ id: '3', discount_percentage: 5, total_sticker_value: 800 }), // Meets sticker only
      mockListing({ id: '4', discount_percentage: 15, total_sticker_value: 800 }), // Meets both
    ];
    const filters = { ...defaultFilters, minDiscount: 10, minStickerValue: 5 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(3);
    expect(result.map(l => l.id)).toEqual(['2', '3', '4']);
  });

  it('should return all if both filters are 0', () => {
    const listings = [
      mockListing({ id: '1', discount_percentage: 5, total_sticker_value: 200 }),
      mockListing({ id: '2', discount_percentage: 15, total_sticker_value: 800 }),
    ];
    const result = filterListings(listings, defaultFilters);
    expect(result).toHaveLength(2);
  });
});
