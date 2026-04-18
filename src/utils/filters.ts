import { EnrichedListing, FilterState } from "../types";

export function filterListings(
  listings: EnrichedListing[],
  filters: FilterState
): EnrichedListing[] {
  const normalizedSkinSearch = filters.skinSearch.trim().toLowerCase();
  const normalizedWeaponSearch = filters.weaponSearch.trim().toLowerCase();
  const hasItemTypesFilter = filters.itemTypes.length > 0;
  const includeStattrak = filters.itemTypes.includes("stattrak");
  const includeSouvenir = filters.itemTypes.includes("souvenir");
  const includeNormal = filters.itemTypes.includes("normal");

  return listings.filter((l) => {
    // Hide overpriced skins (negative discount) unless toggled on
    if (!filters.showOverpriced && l.discount_percentage < 0) {
      return false;
    }

    const priceInDollars = l.price / 100;
    if (filters.minPrice > 0 && priceInDollars < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice > 0 && priceInDollars > filters.maxPrice) {
      return false;
    }

    if (filters.minDiscount > 0 || filters.minStickerValue > 0) {
      const meetsDiscount =
        filters.minDiscount <= 0 || l.discount_percentage >= filters.minDiscount;
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

    if (
      normalizedSkinSearch &&
      !l.item.market_hash_name.toLowerCase().includes(normalizedSkinSearch)
    ) {
      return false;
    }

    if (normalizedWeaponSearch) {
      const weaponName = l.item.market_hash_name.split("|")[0].trim().toLowerCase();
      if (!weaponName.includes(normalizedWeaponSearch)) {
        return false;
      }
    }

    if (hasItemTypesFilter) {
      let matchesType = false;
      if (includeStattrak && l.item.is_stattrak) matchesType = true;
      if (includeSouvenir && l.item.is_souvenir) matchesType = true;
      if (includeNormal && !l.item.is_stattrak && !l.item.is_souvenir)
        matchesType = true;

      if (!matchesType) return false;
    }

    if (filters.minFloat > 0 && l.item.float_value < filters.minFloat) {
      return false;
    }

    if (filters.maxFloat < 1 && l.item.float_value > filters.maxFloat) {
      return false;
    }

    return true;
  });
}
