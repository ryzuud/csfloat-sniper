import { describe, it, expect } from 'vitest';
import { parseListings } from './parseListings';
import type { CSFloatListing } from '@/types';

describe('parseListings', () => {
  const mockListing: CSFloatListing = {
    id: '1',
    created_at: '2023-01-01T00:00:00Z',
    type: 'buy_now',
    price: 1000,
    state: 'listed',
    seller: {
      avatar: '',
      flags: 0,
      online: true,
      stall_public: true,
      statistics: {
        median_trade_time: 0,
        total_failed_trades: 0,
        total_trades: 0,
        total_verified_trades: 0,
      },
      steam_id: '123',
      username: 'test',
    },
    item: {
      asset_id: '1',
      def_index: 1,
      paint_index: 1,
      paint_seed: 1,
      float_value: 0.1,
      icon_url: '',
      d_param: '',
      is_stattrak: false,
      is_souvenir: false,
      rarity: 1,
      quality: 1,
      market_hash_name: 'AK-47 | Redline (Field-Tested)',
      stickers: [],
      tradable: 1,
      inspect_link: '',
      has_screenshot: false,
      item_name: 'AK-47 | Redline',
      wear_name: 'Field-Tested',
      description: '',
      collection: '',
    },
    is_seller: false,
    min_offer_price: 0,
    max_offer_discount: 0,
    is_watchlisted: false,
    watchers: 0,
  };

  it('should return the input if it is an array', () => {
    const input = [mockListing];
    expect(parseListings(input)).toEqual([mockListing]);
  });

  it('should return the data property if it is an array within an object', () => {
    const input = { data: [mockListing] };
    expect(parseListings(input)).toEqual([mockListing]);
  });

  it('should return the listings property if it is an array within an object', () => {
    const input = { listings: [mockListing] };
    expect(parseListings(input)).toEqual([mockListing]);
  });

  it('should return an empty array if input is null', () => {
    expect(parseListings(null)).toEqual([]);
  });

  it('should return an empty array if input is undefined', () => {
    expect(parseListings(undefined)).toEqual([]);
  });

  it('should return an empty array if input is a primitive string', () => {
    expect(parseListings('string')).toEqual([]);
  });

  it('should return an empty array if input is a primitive number', () => {
    expect(parseListings(123)).toEqual([]);
  });

  it('should return an empty array if input is a primitive boolean', () => {
    expect(parseListings(true)).toEqual([]);
  });

  it('should return an empty array if input is an object missing data or listings', () => {
    const input = { otherField: [mockListing] };
    expect(parseListings(input)).toEqual([]);
  });

  it('should return an empty array if data exists but is not an array', () => {
    const input = { data: 123 };
    expect(parseListings(input)).toEqual([]);
  });

  it('should return an empty array if listings exists but is not an array', () => {
    const input = { listings: 'not an array' };
    expect(parseListings(input)).toEqual([]);
  });
});
