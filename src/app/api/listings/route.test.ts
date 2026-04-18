import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './route';

// Mock NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn().mockImplementation((body, init) => {
        return {
          status: init?.status ?? 200,
          json: async () => body,
        };
      }),
    },
  };
});

describe('GET /api/listings', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Default fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return error if API key is not configured', async () => {
    delete process.env.CSFLOAT_API_KEY;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.error).toBe('CSFloat API key not configured. Add your key in .env.local');
    expect(data.listings).toEqual([]);
  });

  it('should return error if API key is the default value', async () => {
    process.env.CSFLOAT_API_KEY = 'your_api_key_here';

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBe('CSFloat API key not configured. Add your key in .env.local');
  });

  it('should handle rate limiting (429)', async () => {
    process.env.CSFLOAT_API_KEY = 'valid_key';

    (global.fetch as any).mockResolvedValue({
      status: 429,
      ok: false,
    });

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBe('Rate limited by CSFloat. Please wait a moment.');
  });

  it('should handle unauthorized (401)', async () => {
    process.env.CSFLOAT_API_KEY = 'invalid_key';

    (global.fetch as any).mockResolvedValue({
      status: 401,
      ok: false,
    });

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBe('Invalid CSFloat API key. Check your .env.local file.');
  });

  it('should handle generic fetch errors (non-ok responses)', async () => {
    process.env.CSFLOAT_API_KEY = 'valid_key';

    (global.fetch as any).mockResolvedValue({
      status: 500,
      statusText: 'Internal Server Error',
      ok: false,
    });

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBe('CSFloat API error: 500 Internal Server Error');
  });

  it('should successfully fetch, deduplicate, calculate discount and sort listings', async () => {
    process.env.CSFLOAT_API_KEY = 'valid_key';

    const mockListing1 = {
      id: '1',
      price: 9000, // 90.00
      item: {
        scm: { price: 10000 }, // 100.00
        stickers: []
      },
      reference: { predicted_price: 10000 }
    };

    const mockListing2 = {
      id: '2',
      price: 8000, // 80.00
      item: {
        scm: { price: 10000 },
        stickers: [
          { reference: { price: 500 } }
        ]
      },
      // Missing reference, should fallback to item.scm.price
    };

    const mockListing3 = {
      id: '1', // Duplicate ID
      price: 9000,
      item: {
        scm: { price: 10000 }
      }
    };

    const mockResponse1 = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [mockListing1] })
    };

    const mockResponse2 = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue({ listings: [mockListing2, mockListing3] })
    };

    const mockResponseEmpty = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue([])
    };

    (global.fetch as any)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2)
      .mockResolvedValueOnce(mockResponseEmpty)
      .mockResolvedValueOnce(mockResponseEmpty);

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBeUndefined();
    expect(data.listings.length).toBe(2); // Deduplicated ID '1'

    // Listing 2 discount: (10000 - 8000) / 10000 = 20%
    expect(data.listings[0].id).toBe('2');
    expect(data.listings[0].discount_percentage).toBe(20);
    expect(data.listings[0].reference_price).toBe(10000);
    expect(data.listings[0].total_sticker_value).toBe(500);

    // Listing 1 discount: (10000 - 9000) / 10000 = 10%
    expect(data.listings[1].id).toBe('1');
    expect(data.listings[1].discount_percentage).toBe(10);
    expect(data.listings[1].reference_price).toBe(10000);
    expect(data.listings[1].total_sticker_value).toBe(0);
  });

  it('should handle fetch throwing an exception', async () => {
    process.env.CSFLOAT_API_KEY = 'valid_key';

    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const response = await GET();
    const data = await response.json();

    expect(data.error).toBe('Failed to connect to CSFloat. Check your internet connection.');
  });
});
