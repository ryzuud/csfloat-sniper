import { render, screen } from '@testing-library/react';
import SkinCard from './SkinCard';
import { EnrichedListing } from '@/types';
import { describe, it, expect, vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Exclude unoptimized prop from being passed to native img tag to prevent React warning
    const { unoptimized, ...imgProps } = props;
    return <img {...imgProps} />;
  },
}));

describe('SkinCard', () => {
  it('should render item_name if present', () => {
    const listing = {
      id: '1',
      price: 1000,
      discount_percentage: 10,
      item: {
        item_name: 'AK-47 | Redline',
        market_hash_name: 'AK-47 | Redline (Field-Tested)',
        rarity: 1,
        icon_url: 'icon',
        float_value: 0.15,
        wear_name: 'Field-Tested'
      }
    } as EnrichedListing;

    render(<SkinCard listing={listing} />);
    expect(screen.getByText('AK-47 | Redline')).toBeInTheDocument();
  });

  it('should fallback to market_hash_name if item_name is missing', () => {
    const listing = {
      id: '1',
      price: 1000,
      discount_percentage: 10,
      item: {
        market_hash_name: 'AK-47 | Redline (Field-Tested)',
        rarity: 1,
        icon_url: 'icon',
        float_value: 0.15,
        wear_name: 'Field-Tested'
      }
    } as EnrichedListing;

    render(<SkinCard listing={listing} />);
    expect(screen.getByText('AK-47 | Redline (Field-Tested)')).toBeInTheDocument();
  });
});
