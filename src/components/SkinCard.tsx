"use client";

import { EnrichedListing } from "@/types";
import { memo } from "react";
import Image from "next/image";

interface SkinCardProps {
  listing: EnrichedListing;
}

function getWearColor(wear: string): string {
  switch (wear) {
    case "Factory New":
      return "#4ade80";
    case "Minimal Wear":
      return "#60a5fa";
    case "Field-Tested":
      return "#facc15";
    case "Well-Worn":
      return "#fb923c";
    case "Battle-Scarred":
      return "#f87171";
    default:
      return "#94a3b8";
  }
}

function getRarityGradient(rarity: number): string {
  const gradients: Record<number, string> = {
    1: "linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)", // Consumer
    2: "linear-gradient(135deg, #4b69ff 0%, #3b5bdb 100%)", // Industrial
    3: "linear-gradient(135deg, #8847ff 0%, #6741d9 100%)", // Mil-Spec
    4: "linear-gradient(135deg, #d32ce6 0%, #ae3ec9 100%)", // Restricted
    5: "linear-gradient(135deg, #eb4b4b 0%, #c92a2a 100%)", // Classified
    6: "linear-gradient(135deg, #e4ae39 0%, #f59f00 100%)", // Covert
    7: "linear-gradient(135deg, #e4ae39 0%, #ffd700 100%)", // Contraband / Gold
  };
  return gradients[rarity] || gradients[1];
}

const SkinCard = memo(function SkinCard({ listing }: SkinCardProps) {
  const { item, price, discount_percentage, id } = listing;
  const priceInDollars = (price / 100).toFixed(2);
  const refPriceInDollars =
    listing.reference_price ? (listing.reference_price / 100).toFixed(2) : null;
  const isGreatDeal = discount_percentage >= 15;
  const wearColor = getWearColor(item.wear_name ?? "");
  const imageUrl = `https://community.fastly.steamstatic.com/economy/image/${item.icon_url}/360fx360f`;
  const floatDisplay = item.float_value != null ? item.float_value.toFixed(4) : "N/A";

  return (
    <a
      href={`https://csfloat.com/item/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="skin-card"
      style={{ "--rarity-gradient": getRarityGradient(item.rarity) } as React.CSSProperties}
    >
      {/* Rarity bar */}
      <div className="skin-card-rarity-bar" />

      {/* Discount / Overpriced badge */}
      {discount_percentage > 0 && (
        <div className={`discount-badge ${isGreatDeal ? "great-deal" : ""}`}>
          -{discount_percentage.toFixed(1)}%
        </div>
      )}
      {discount_percentage < 0 && (
        <div className="discount-badge overpriced-badge">
          +{Math.abs(discount_percentage).toFixed(1)}%
        </div>
      )}

      {/* StatTrak badge */}
      {item.is_stattrak && <div className="stattrak-badge">StatTrak™</div>}

      {/* Image */}
      <div className="skin-image-container">
        <Image
          src={imageUrl}
          alt={item.market_hash_name}
          width={200}
          height={200}
          className="skin-image"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="skin-info">
        <h3 className="skin-name">{item.item_name ?? item.market_hash_name}</h3>
        <div className="skin-meta">
          {item.wear_name && (
            <span className="wear-badge" style={{ color: wearColor, borderColor: wearColor }}>
              {item.wear_name}
            </span>
          )}
          <span className="float-value">
            Float: {floatDisplay}
          </span>
        </div>

        <div className="skin-pricing">
          <span className="skin-price">${priceInDollars}</span>
          {refPriceInDollars && (
            <span className="skin-ref-price">
              Ref: ${refPriceInDollars}
            </span>
          )}
        </div>

        <div className="buy-button">
          Buy on CSFloat →
        </div>
      </div>
    </a>
  );
});

export default SkinCard;
