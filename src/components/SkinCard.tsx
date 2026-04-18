"use client";

import { EnrichedListing } from "@/types";
import { memo } from "react";
import Image from "next/image";
import { getWearColor, getRarityGradient } from "@/utils/skin";

interface SkinCardProps {
  listing: EnrichedListing;
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
