"use client";

import { FilterState, ItemType } from "@/types";



const ITEM_TYPE_OPTIONS: { value: ItemType; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "stattrak", label: "StatTrak™" },
  { value: "souvenir", label: "Souvenir" },
];

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const toggleItemType = (type: ItemType) => {
    const current = filters.itemTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, itemTypes: updated });
  };

  return (
    <div className="filter-bar">
      {/* Row 1: Search fields */}
      <div className="filter-bar-inner">
        {/* Skin Name Search */}
        <div className="filter-group filter-group-wide">
          <label className="filter-label" htmlFor="skinSearch">
            🔍 Skin Name
          </label>
          <input
            id="skinSearch"
            type="text"
            value={filters.skinSearch}
            placeholder="e.g. Asiimov, Redline..."
            className="filter-input"
            onChange={(e) =>
              onChange({ ...filters, skinSearch: e.target.value })
            }
          />
        </div>

        {/* Weapon Search */}
        <div className="filter-group filter-group-wide">
          <label className="filter-label" htmlFor="weaponSearch">
            🔫 Weapon
          </label>
          <input
            id="weaponSearch"
            type="text"
            value={filters.weaponSearch}
            placeholder="e.g. AK-47, M4A4, AWP..."
            className="filter-input"
            onChange={(e) =>
              onChange({ ...filters, weaponSearch: e.target.value })
            }
          />
        </div>

        {/* Item Type Multi-select */}
        <div className="filter-group">
          <span className="filter-label">🏷️ Type</span>
          <div className="item-type-toggles">
            {ITEM_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`type-toggle ${
                  filters.itemTypes.includes(opt.value) ? "type-toggle-active" : ""
                }`}
                onClick={() => toggleItemType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Numeric filters */}
      <div className="filter-bar-inner" style={{ marginTop: "12px" }}>
        {/* Min Price */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="minPrice">
            💰 Min Price ($)
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            step={1}
            value={filters.minPrice || ""}
            placeholder="No min"
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>

        {/* Max Price */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="maxPrice">
            💰 Max Price ($)
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            step={1}
            value={filters.maxPrice || ""}
            placeholder="No limit"
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>

        {/* Min Discount */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="minDiscount">
            🏷️ Min Discount (%)
          </label>
          <input
            id="minDiscount"
            type="number"
            min={0}
            max={100}
            step={1}
            value={filters.minDiscount || ""}
            placeholder="0%"
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                minDiscount: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>

        {/* Min Sticker Value */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="minStickerValue">
            🎨 Min Sticker Value ($)
          </label>
          <input
            id="minStickerValue"
            type="number"
            min={0}
            step={1}
            value={filters.minStickerValue || ""}
            placeholder="No min"
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                minStickerValue: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>

        {/* Float Range */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="minFloat">
            🎯 Min Float
          </label>
          <input
            id="minFloat"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={filters.minFloat}
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                minFloat: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="maxFloat">
            🎯 Max Float
          </label>
          <input
            id="maxFloat"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={filters.maxFloat}
            className="filter-input"
            onChange={(e) =>
              onChange({
                ...filters,
                maxFloat: e.target.value ? Number(e.target.value) : 1,
              })
            }
          />
        </div>

        {/* Show Overpriced Toggle */}
        <div className="filter-group">
          <span className="filter-label">📉 Non-Rentable</span>
          <button
            type="button"
            className={`type-toggle ${filters.showOverpriced ? "type-toggle-active" : ""}`}
            onClick={() =>
              onChange({ ...filters, showOverpriced: !filters.showOverpriced })
            }
          >
            {filters.showOverpriced ? "Affichés" : "Masqués"}
          </button>
        </div>
      </div>
    </div>
  );
}
