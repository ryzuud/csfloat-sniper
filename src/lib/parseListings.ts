import type { CSFloatListing } from "@/types";

export const parseListings = (raw: unknown): CSFloatListing[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as CSFloatListing[];
    if (Array.isArray(obj.listings)) return obj.listings as CSFloatListing[];
  }
  return [];
};
