import test from 'node:test';
import assert from 'node:assert';
import { getWearColor, getRarityGradient } from './skin.ts';

test('getWearColor - Factory New', () => {
  assert.strictEqual(getWearColor("Factory New"), "#4ade80");
});

test('getWearColor - Minimal Wear', () => {
  assert.strictEqual(getWearColor("Minimal Wear"), "#60a5fa");
});

test('getWearColor - Field-Tested', () => {
  assert.strictEqual(getWearColor("Field-Tested"), "#facc15");
});

test('getWearColor - Well-Worn', () => {
  assert.strictEqual(getWearColor("Well-Worn"), "#fb923c");
});

test('getWearColor - Battle-Scarred', () => {
  assert.strictEqual(getWearColor("Battle-Scarred"), "#f87171");
});

test('getWearColor - unknown wear', () => {
  assert.strictEqual(getWearColor("Unknown Wear"), "#94a3b8");
});

test('getWearColor - empty string', () => {
  assert.strictEqual(getWearColor(""), "#94a3b8");
});

test('getRarityGradient - Consumer (1)', () => {
  assert.strictEqual(getRarityGradient(1), "linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)");
});

test('getRarityGradient - Industrial (2)', () => {
  assert.strictEqual(getRarityGradient(2), "linear-gradient(135deg, #4b69ff 0%, #3b5bdb 100%)");
});

test('getRarityGradient - Mil-Spec (3)', () => {
  assert.strictEqual(getRarityGradient(3), "linear-gradient(135deg, #8847ff 0%, #6741d9 100%)");
});

test('getRarityGradient - Restricted (4)', () => {
  assert.strictEqual(getRarityGradient(4), "linear-gradient(135deg, #d32ce6 0%, #ae3ec9 100%)");
});

test('getRarityGradient - Classified (5)', () => {
  assert.strictEqual(getRarityGradient(5), "linear-gradient(135deg, #eb4b4b 0%, #c92a2a 100%)");
});

test('getRarityGradient - Covert (6)', () => {
  assert.strictEqual(getRarityGradient(6), "linear-gradient(135deg, #e4ae39 0%, #f59f00 100%)");
});

test('getRarityGradient - Contraband / Gold (7)', () => {
  assert.strictEqual(getRarityGradient(7), "linear-gradient(135deg, #e4ae39 0%, #ffd700 100%)");
});

test('getRarityGradient - unknown rarity (0)', () => {
  assert.strictEqual(getRarityGradient(0), "linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)");
});

test('getRarityGradient - unknown rarity (8)', () => {
  assert.strictEqual(getRarityGradient(8), "linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)");
});
