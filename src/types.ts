// ─── CSFloat API Types ───

export interface CSFloatSticker {
  stickerId: number;
  slot: number;
  icon_url: string;
  name: string;
  scm?: {
    price: number;
    volume: number;
  };
  reference?: {
    price: number;
    quantity: number;
    updated_at: string;
  };
}

export interface CSFloatItem {
  asset_id: string;
  def_index: number;
  paint_index: number;
  paint_seed: number;
  float_value: number;
  icon_url: string;
  d_param: string;
  is_stattrak: boolean;
  is_souvenir: boolean;
  rarity: number;
  quality: number;
  market_hash_name: string;
  stickers: CSFloatSticker[];
  tradable: number;
  inspect_link: string;
  has_screenshot: boolean;
  scm?: {
    price: number;
    volume: number;
  };
  item_name: string;
  wear_name: string;
  description: string;
  collection: string;
}

export interface CSFloatSeller {
  avatar: string;
  flags: number;
  online: boolean;
  stall_public: boolean;
  statistics: {
    median_trade_time: number;
    total_failed_trades: number;
    total_trades: number;
    total_verified_trades: number;
  };
  steam_id: string;
  username: string;
}

export interface CSFloatReference {
  base_price: number;
  float_factor: number;
  predicted_price: number;
  quantity: number;
  last_updated: string;
}

export interface CSFloatListing {
  id: string;
  created_at: string;
  type: string;
  price: number; // in cents
  state: string;
  seller: CSFloatSeller;
  reference?: CSFloatReference;
  item: CSFloatItem;
  is_seller: boolean;
  min_offer_price: number;
  max_offer_discount: number;
  is_watchlisted: boolean;
  watchers: number;
}

// ─── Enriched listing with computed discount ───

export interface EnrichedListing extends CSFloatListing {
  discount_percentage: number;
  reference_price: number;
  total_sticker_value: number; // in cents
}

// ─── UI Filter State ───

export type WearFilter =
  | "Any"
  | "Factory New"
  | "Minimal Wear"
  | "Field-Tested"
  | "Well-Worn"
  | "Battle-Scarred";

export type ItemType = "normal" | "stattrak" | "souvenir";

export interface FilterState {
  minPrice: number;         // in dollars
  maxPrice: number;         // in dollars
  minDiscount: number;      // percentage
  minStickerValue: number;  // in dollars
  skinSearch: string;       // search by skin name
  weaponSearch: string;     // search by weapon name
  itemTypes: ItemType[];    // normal, stattrak, souvenir
  minFloat: number;         // 0 to 1
  maxFloat: number;         // 0 to 1
  showOverpriced: boolean;  // show skins with negative discount
}

// ─── API Response ───

export interface ListingsAPIResponse {
  listings: EnrichedListing[];
  timestamp: number;
  error?: string;
}
