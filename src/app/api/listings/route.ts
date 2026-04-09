import { NextResponse } from "next/server";
import type { CSFloatListing, EnrichedListing } from "@/types";

export const dynamic = "force-dynamic";

const CSFLOAT_API_URL = "https://csfloat.com/api/v1/listings";

export async function GET() {
  const apiKey = process.env.CSFLOAT_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      {
        listings: [],
        timestamp: Date.now(),
        error: "CSFloat API key not configured. Add your key in .env.local",
      },
      { status: 200 }
    );
  }

  try {
    const LIMIT = "50"; // CSFloat API max per request

    const buildUrl = (sortBy: string, page: number) => {
      const params = new URLSearchParams({
        type: "buy_now",
        limit: LIMIT,
        sort_by: sortBy,
        page: String(page),
      });
      return `${CSFLOAT_API_URL}?${params.toString()}`;
    };

    const fetchOpts = { headers: { Authorization: apiKey }, next: { revalidate: 0 } };

    // Fetch 2 pages × 2 sort types = 4 requests in parallel (~200 listings)
    const responses = await Promise.all([
      fetch(buildUrl("highest_discount", 0), fetchOpts),
      fetch(buildUrl("highest_discount", 1), fetchOpts),
      fetch(buildUrl("most_recent", 0), fetchOpts),
      fetch(buildUrl("most_recent", 1), fetchOpts),
    ]);

    // Handle rate limiting
    if (responses.some((r) => r.status === 429)) {
      return NextResponse.json(
        {
          listings: [],
          timestamp: Date.now(),
          error: "Rate limited by CSFloat. Please wait a moment.",
        },
        { status: 200 }
      );
    }

    if (responses.some((r) => r.status === 401)) {
      return NextResponse.json(
        {
          listings: [],
          timestamp: Date.now(),
          error: "Invalid CSFloat API key. Check your .env.local file.",
        },
        { status: 200 }
      );
    }

    const failedRes = responses.find((r) => !r.ok);
    if (failedRes) {
      return NextResponse.json(
        {
          listings: [],
          timestamp: Date.now(),
          error: `CSFloat API error: ${failedRes.status} ${failedRes.statusText}`,
        },
        { status: 200 }
      );
    }

    const rawResults = await Promise.all(responses.map((r) => r.json()));

    const parseListings = (raw: unknown): CSFloatListing[] => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "object" && raw !== null) {
        const obj = raw as Record<string, unknown>;
        return (obj.data ?? obj.listings ?? []) as CSFloatListing[];
      }
      return [];
    };

    // Merge all pages and deduplicate by listing ID
    const seen = new Set<string>();
    const allListings: CSFloatListing[] = [];
    for (const raw of rawResults) {
      for (const listing of parseListings(raw)) {
        if (!seen.has(listing.id)) {
          seen.add(listing.id);
          allListings.push(listing);
        }
      }
    }

    // Enrich each listing with calculated discount percentage
    // Uses CSFloat's own reference.predicted_price for accurate discount
    const enriched: EnrichedListing[] = allListings.map((listing) => {
      const referencePrice =
        listing.reference?.predicted_price ?? listing.item.scm?.price ?? listing.price;
      const discount =
        referencePrice > 0
          ? ((referencePrice - listing.price) / referencePrice) * 100
          : 0;

      const totalStickerValue = (listing.item.stickers ?? []).reduce(
        (sum, s) => sum + (s.reference?.price ?? s.scm?.price ?? 0),
        0
      );

      return {
        ...listing,
        discount_percentage: Math.round(discount * 10) / 10,
        reference_price: referencePrice,
        total_sticker_value: totalStickerValue,
      };
    });

    // Sort by highest discount
    enriched.sort((a, b) => b.discount_percentage - a.discount_percentage);

    return NextResponse.json({
      listings: enriched,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("CSFloat API fetch error:", error);
    return NextResponse.json(
      {
        listings: [],
        timestamp: Date.now(),
        error: "Failed to connect to CSFloat. Check your internet connection.",
      },
      { status: 200 }
    );
  }
}
