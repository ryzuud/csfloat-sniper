import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from './FilterBar';
import { FilterState } from '@/types';

describe('FilterBar', () => {
  const defaultFilters: FilterState = {
    minPrice: 0,
    maxPrice: 0,
    minDiscount: 0,
    minStickerValue: 0,
    skinSearch: '',
    weaponSearch: '',
    itemTypes: ['normal'],
    minFloat: 0,
    maxFloat: 1,
    showOverpriced: false,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    cleanup();
  });

  it('renders correctly with default filters', () => {
    render(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);

    // Check if the component renders the skin search input
    expect(screen.getByLabelText(/🔍 Skin Name/i)).toBeInTheDocument();

    // Check if the Normal toggle button is active
    const normalButton = screen.getByRole('button', { name: /Normal/i });
    expect(normalButton).toHaveClass('type-toggle-active');
  });

  it('calls onChange when string inputs change', async () => {
    const user = userEvent.setup();
    render(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);

    const skinInput = screen.getByLabelText(/🔍 Skin Name/i);
    await user.type(skinInput, 'A');

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      skinSearch: 'A',
    });

    mockOnChange.mockClear();

    const weaponInput = screen.getByLabelText(/🔫 Weapon/i);
    await user.type(weaponInput, 'A');

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      weaponSearch: 'A',
    });
  });

  it('toggles item types correctly', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);

    // Click StatTrak
    const stattrakButton = screen.getByRole('button', { name: /StatTrak™/i });
    await user.click(stattrakButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      itemTypes: ['normal', 'stattrak'],
    });

    // Reset mock
    mockOnChange.mockClear();

    // Render with stattrak active and click to remove
    rerender(
      <FilterBar
        filters={{...defaultFilters, itemTypes: ['normal', 'stattrak']}}
        onChange={mockOnChange}
      />
    );

    const activeStattrakButton = screen.getByRole('button', { name: /StatTrak™/i });
    await user.click(activeStattrakButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      itemTypes: ['normal'],
    });
  });

  it('calls onChange when numeric inputs change', async () => {
    const { rerender } = render(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);

    const numericInputs = [
      { label: /💰 Min Price \(\$\)/i, key: 'minPrice' },
      { label: /💰 Max Price \(\$\)/i, key: 'maxPrice' },
      { label: /🏷️ Min Discount \(%\)/i, key: 'minDiscount' },
      { label: /🎨 Min Sticker Value \(\$\)/i, key: 'minStickerValue' },
      { label: /🎯 Min Float/i, key: 'minFloat' },
      { label: /🎯 Max Float/i, key: 'maxFloat' },
    ];

    for (const input of numericInputs) {
      mockOnChange.mockClear();
      const el = screen.getByLabelText(input.label);

      // We use fireEvent.change to directly trigger the event logic
      fireEvent.change(el, { target: { value: '5' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultFilters,
        [input.key]: 5,
      });

      // Revert state for next iteration
      rerender(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);
    }
  });

  it('calls onChange with default values when numeric inputs are cleared', async () => {
    const { rerender } = render(<FilterBar filters={{...defaultFilters, minPrice: 10, maxPrice: 10, minDiscount: 10, minStickerValue: 10, minFloat: 0.5, maxFloat: 0.5}} onChange={mockOnChange} />);

    const numericInputs = [
      { label: /💰 Min Price \(\$\)/i, key: 'minPrice' },
      { label: /💰 Max Price \(\$\)/i, key: 'maxPrice' },
      { label: /🏷️ Min Discount \(%\)/i, key: 'minDiscount' },
      { label: /🎨 Min Sticker Value \(\$\)/i, key: 'minStickerValue' },
      { label: /🎯 Min Float/i, key: 'minFloat' },
      { label: /🎯 Max Float/i, key: 'maxFloat' },
    ];

    for (const input of numericInputs) {
      mockOnChange.mockClear();
      const el = screen.getByLabelText(input.label);

      // Test fallback for empty string
      fireEvent.change(el, { target: { value: '' } });

      const expectedEmptyValue = input.key === 'maxFloat' ? 1 : 0;
      expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
        [input.key]: expectedEmptyValue,
      }));
    }
  });

  it('calls onChange when boolean toggle changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<FilterBar filters={defaultFilters} onChange={mockOnChange} />);

    const toggleButton = screen.getByRole('button', { name: /Masqués/i });

    // Check initial state
    expect(screen.getByText(/Masqués/i)).toBeInTheDocument();

    await user.click(toggleButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      showOverpriced: true,
    });

    // Rerender with the active state to check text change
    rerender(<FilterBar filters={{...defaultFilters, showOverpriced: true}} onChange={mockOnChange} />);
    expect(screen.getByText(/Affichés/i)).toBeInTheDocument();
  });
});
