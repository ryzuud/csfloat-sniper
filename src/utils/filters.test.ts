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

describe('filterListings - Overpriced Filter', () => {
  it('should hide overpriced items by default', () => {
    const listings = [
      mockListing({ id: '1', discount_percentage: 5 }),
      mockListing({ id: '2', discount_percentage: -5 }),
    ];
    const result = filterListings(listings, defaultFilters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should show overpriced items if showOverpriced is true', () => {
    const listings = [
      mockListing({ id: '1', discount_percentage: 5 }),
      mockListing({ id: '2', discount_percentage: -5 }),
    ];
    const filters = { ...defaultFilters, showOverpriced: true };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(2);
  });
});

describe('filterListings - Price Filters', () => {
  it('should filter out items below minPrice', () => {
    const listings = [
      mockListing({ id: '1', price: 500 }), // $5.00
      mockListing({ id: '2', price: 1500 }), // $15.00
    ];
    const filters = { ...defaultFilters, minPrice: 10 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter out items above maxPrice', () => {
    const listings = [
      mockListing({ id: '1', price: 500 }), // $5.00
      mockListing({ id: '2', price: 1500 }), // $15.00
    ];
    const filters = { ...defaultFilters, maxPrice: 10 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter items within minPrice and maxPrice range', () => {
    const listings = [
      mockListing({ id: '1', price: 500 }), // $5.00
      mockListing({ id: '2', price: 1500 }), // $15.00
      mockListing({ id: '3', price: 2500 }), // $25.00
    ];
    const filters = { ...defaultFilters, minPrice: 10, maxPrice: 20 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});

describe('filterListings - Text Search Filters', () => {
  it('should filter items by skinSearch case-insensitively', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, market_hash_name: 'AK-47 | Redline (Field-Tested)' } }),
      mockListing({ id: '2', item: { ...mockListing().item, market_hash_name: 'M4A4 | Howl (Minimal Wear)' } }),
    ];
    const filters = { ...defaultFilters, skinSearch: 'rEdLInE' };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter items by weaponSearch case-insensitively', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, market_hash_name: 'AK-47 | Redline (Field-Tested)' } }),
      mockListing({ id: '2', item: { ...mockListing().item, market_hash_name: 'M4A4 | Howl (Minimal Wear)' } }),
    ];
    const filters = { ...defaultFilters, weaponSearch: 'aK-47' };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter correctly when both text filters are active', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, market_hash_name: 'AK-47 | Redline (Field-Tested)' } }),
      mockListing({ id: '2', item: { ...mockListing().item, market_hash_name: 'AK-47 | Vulcan (Field-Tested)' } }),
      mockListing({ id: '3', item: { ...mockListing().item, market_hash_name: 'M4A4 | Redline (Field-Tested)' } }),
    ];
    const filters = { ...defaultFilters, weaponSearch: 'AK-47', skinSearch: 'Redline' };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('filterListings - Item Types Filters', () => {
  const listings = [
    mockListing({ id: '1', item: { ...mockListing().item, is_stattrak: true, is_souvenir: false } }),
    mockListing({ id: '2', item: { ...mockListing().item, is_stattrak: false, is_souvenir: true } }),
    mockListing({ id: '3', item: { ...mockListing().item, is_stattrak: false, is_souvenir: false } }),
  ];

  it('should filter for StatTrak items', () => {
    const filters = { ...defaultFilters, itemTypes: ['stattrak'] };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter for Souvenir items', () => {
    const filters = { ...defaultFilters, itemTypes: ['souvenir'] };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter for Normal items', () => {
    const filters = { ...defaultFilters, itemTypes: ['normal'] };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('should handle multiple itemTypes', () => {
    const filters = { ...defaultFilters, itemTypes: ['stattrak', 'normal'] };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(2);
    expect(result.map(l => l.id)).toEqual(['1', '3']);
  });
});

describe('filterListings - Float Value Filters', () => {
  it('should filter out items below minFloat', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, float_value: 0.1 } }),
      mockListing({ id: '2', item: { ...mockListing().item, float_value: 0.3 } }),
    ];
    const filters = { ...defaultFilters, minFloat: 0.2 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter out items above maxFloat', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, float_value: 0.1 } }),
      mockListing({ id: '2', item: { ...mockListing().item, float_value: 0.3 } }),
    ];
    const filters = { ...defaultFilters, maxFloat: 0.2 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter items within float range', () => {
    const listings = [
      mockListing({ id: '1', item: { ...mockListing().item, float_value: 0.1 } }),
      mockListing({ id: '2', item: { ...mockListing().item, float_value: 0.25 } }),
      mockListing({ id: '3', item: { ...mockListing().item, float_value: 0.4 } }),
    ];
    const filters = { ...defaultFilters, minFloat: 0.2, maxFloat: 0.3 };
    const result = filterListings(listings, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});
