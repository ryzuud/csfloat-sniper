"use client";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-rarity-bar" />
      <div className="skeleton-image" />
      <div className="skeleton-info">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-line skeleton-price" />
        <div className="skeleton-line skeleton-button" />
      </div>
    </div>
  );
}
