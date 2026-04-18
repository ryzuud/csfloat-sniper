"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { EnrichedListing, FilterState, ListingsAPIResponse } from "@/types";
import FilterBar from "@/components/FilterBar";
import SkinCard from "@/components/SkinCard";
import SkeletonCard from "@/components/SkeletonCard";

const POLL_INTERVAL = 300000; // 5 minutes

export default function Home() {
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 1,
    maxPrice: 0,
    minDiscount: 0,
    minStickerValue: 0,
    skinSearch: "",
    weaponSearch: "",
    itemTypes: [],
    minFloat: 0,
    maxFloat: 1,
    showOverpriced: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch("/api/listings");
      const data: ListingsAPIResponse = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setError(null);
      }

      setListings(data.listings);
      setLastUpdate(new Date());
    } catch {
      setError("Failed to fetch listings. Check your connection.");
    } finally {
      setLoading(false);
      setCountdown(POLL_INTERVAL / 1000);
    }
  }, []);

  const handleManualRefresh = useCallback(() => {
    // Reset timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setCountdown(POLL_INTERVAL / 1000);
    fetchListings();

    intervalRef.current = setInterval(fetchListings, POLL_INTERVAL);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);
  }, [fetchListings]);

  // Apply client-side filters using useMemo
  // This avoids double rendering that useState + useEffect causes and provides a stable array reference
  // Optimized to use a single pass over the array
  const filteredListings = useMemo(() => {
    const skinSearch = filters.skinSearch.trim().toLowerCase();
    const weaponSearch = filters.weaponSearch.trim().toLowerCase();
    const hasItemTypes = filters.itemTypes.length > 0;

    return listings.filter((l) => {
      // Hide overpriced skins (negative discount) unless toggled on
      if (!filters.showOverpriced && l.discount_percentage < 0) return false;

      // Price filters
      if (filters.minPrice > 0 && l.price / 100 < filters.minPrice) return false;
      if (filters.maxPrice > 0 && l.price / 100 > filters.maxPrice) return false;

      // Discount & Sticker Value filters (OR logic if both present)
      if (filters.minDiscount > 0 || filters.minStickerValue > 0) {
        const meetsDiscount =
          filters.minDiscount > 0 && l.discount_percentage >= filters.minDiscount;
        const hasHighStickerValue =
          filters.minStickerValue > 0 &&
          l.total_sticker_value / 100 >= filters.minStickerValue;

        if (filters.minDiscount > 0 && filters.minStickerValue > 0) {
          if (!meetsDiscount && !hasHighStickerValue) return false;
        } else if (filters.minDiscount > 0) {
          if (!meetsDiscount) return false;
        } else {
          if (!hasHighStickerValue) return false;
        }
      }

      // Search filters
      if (
        skinSearch &&
        !l.item.market_hash_name.toLowerCase().includes(skinSearch)
      ) {
        return false;
      }

      if (weaponSearch) {
        const weaponName = l.item.market_hash_name
          .split("|")[0]
          .trim()
          .toLowerCase();
        if (!weaponName.includes(weaponSearch)) return false;
      }

      // Item type filters
      if (hasItemTypes) {
        let typeMatch = false;
        if (filters.itemTypes.includes("stattrak") && l.item.is_stattrak) {
          typeMatch = true;
        } else if (filters.itemTypes.includes("souvenir") && l.item.is_souvenir) {
          typeMatch = true;
        } else if (
          filters.itemTypes.includes("normal") &&
          !l.item.is_stattrak &&
          !l.item.is_souvenir
        ) {
          typeMatch = true;
        }

        if (!typeMatch) return false;
      }

      // Float filters
      if (filters.minFloat > 0 && l.item.float_value < filters.minFloat) return false;
      if (filters.maxFloat < 1 && l.item.float_value > filters.maxFloat) return false;

      return true;
    });
  }, [listings, filters]);

  // Polling & countdown
  useEffect(() => {
    fetchListings();

    intervalRef.current = setInterval(fetchListings, POLL_INTERVAL);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchListings]);

  return (
    <main className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="title-icon">⚡</span>
            CSFloat Sniper
          </h1>
          <p className="dashboard-subtitle">
            Real-time CS2 skin deals — sorted by best discount
          </p>
        </div>
        <div className="header-right">
          <div className="live-indicator">
            <span className="live-dot" />
            <span className="live-text">LIVE</span>
          </div>
          <button
            className="refresh-btn"
            onClick={handleManualRefresh}
            title="Refresh now"
          >
            🔄 Refresh
          </button>
          <div className="refresh-countdown">
            <span className="countdown-label">Auto-refresh</span>
            <span className="countdown-value">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</span>
          </div>
          {lastUpdate && (
            <div className="last-update">
              Updated {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Stats bar */}
      <div className="stats-bar">
        <span className="stat">
          {filteredListings.length} deal{filteredListings.length !== 1 ? "s" : ""} found
        </span>
        {filters.minPrice > 0 || filters.maxPrice > 0 || filters.minDiscount > 0 || filters.minStickerValue > 0 || filters.skinSearch || filters.weaponSearch || filters.itemTypes.length > 0 || filters.minFloat > 0 || filters.maxFloat < 1 ? (
          <button
            className="clear-filters"
            onClick={() => setFilters({ minPrice: 1, maxPrice: 0, minDiscount: 0, minStickerValue: 0, skinSearch: "", weaponSearch: "", itemTypes: [], minFloat: 0, maxFloat: 1, showOverpriced: false })}
          >
            ✕ Clear filters
          </button>
        ) : null}
      </div>

      {/* Grid */}
      <div className="listings-grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredListings.length > 0
          ? filteredListings.map((listing) => (
              <SkinCard key={listing.id} listing={listing} />
            ))
          : !error && (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>No deals match your filters</p>
                <p className="empty-hint">Try adjusting your search criteria</p>
              </div>
            )}
      </div>
    </main>
  );
}
