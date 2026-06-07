import { describe, it, expect } from 'vitest';
import { getWearColor, getRarityGradient } from './colors';

describe('colors utility', () => {
  describe('getWearColor', () => {
    it('should return correct color for Factory New', () => {
      expect(getWearColor('Factory New')).toBe('#4ade80');
    });

    it('should return correct color for Minimal Wear', () => {
      expect(getWearColor('Minimal Wear')).toBe('#60a5fa');
    });

    it('should return correct color for Field-Tested', () => {
      expect(getWearColor('Field-Tested')).toBe('#facc15');
    });

    it('should return correct color for Well-Worn', () => {
      expect(getWearColor('Well-Worn')).toBe('#fb923c');
    });

    it('should return correct color for Battle-Scarred', () => {
      expect(getWearColor('Battle-Scarred')).toBe('#f87171');
    });

    it('should return default color for unknown wear', () => {
      expect(getWearColor('Unknown')).toBe('#94a3b8');
    });

    it('should return default color for empty string', () => {
      expect(getWearColor('')).toBe('#94a3b8');
    });
  });

  describe('getRarityGradient', () => {
    it('should return correct gradient for Consumer (1)', () => {
      expect(getRarityGradient(1)).toBe('linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)');
    });

    it('should return correct gradient for Industrial (2)', () => {
      expect(getRarityGradient(2)).toBe('linear-gradient(135deg, #4b69ff 0%, #3b5bdb 100%)');
    });

    it('should return correct gradient for Mil-Spec (3)', () => {
      expect(getRarityGradient(3)).toBe('linear-gradient(135deg, #8847ff 0%, #6741d9 100%)');
    });

    it('should return correct gradient for Restricted (4)', () => {
      expect(getRarityGradient(4)).toBe('linear-gradient(135deg, #d32ce6 0%, #ae3ec9 100%)');
    });

    it('should return correct gradient for Classified (5)', () => {
      expect(getRarityGradient(5)).toBe('linear-gradient(135deg, #eb4b4b 0%, #c92a2a 100%)');
    });

    it('should return correct gradient for Covert (6)', () => {
      expect(getRarityGradient(6)).toBe('linear-gradient(135deg, #e4ae39 0%, #f59f00 100%)');
    });

    it('should return correct gradient for Contraband / Gold (7)', () => {
      expect(getRarityGradient(7)).toBe('linear-gradient(135deg, #e4ae39 0%, #ffd700 100%)');
    });

    it('should return Consumer gradient for unknown rarity', () => {
      expect(getRarityGradient(99)).toBe('linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)');
    });

    it('should return Consumer gradient for 0', () => {
      expect(getRarityGradient(0)).toBe('linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)');
    });
  });
});
