import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { GET } from './route';

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

describe('Listings API GET', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return error if API key is not configured (undefined)', async () => {
    delete process.env.CSFLOAT_API_KEY;
    const response = await GET();
    expect(response).toMatchObject({
      body: {
        listings: [],
        error: "CSFloat API key not configured. Add your key in .env.local",
      },
      init: { status: 200 }
    });
    expect(response.body.timestamp).toBeDefined();
  });

  it('should return error if API key is not configured (default string)', async () => {
    process.env.CSFLOAT_API_KEY = "your_api_key_here";
    const response = await GET();
    expect(response).toMatchObject({
      body: {
        listings: [],
        error: "CSFloat API key not configured. Add your key in .env.local",
      },
      init: { status: 200 }
    });
    expect(response.body.timestamp).toBeDefined();
  });
});
