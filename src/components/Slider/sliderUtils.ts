/**
 * Utility functions for slider value calculations
 */

/**
 * Convert a value to a percentage position (0-100)
 */
export function valueToPercent(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

/**
 * Convert a percentage (0-100) to a value, clamped to min/max and stepped
 */
export function percentToValue(
  percent: number,
  min: number,
  max: number,
  step: number
): number {
  const rawValue = min + (percent / 100) * (max - min);
  return clampToStep(rawValue, min, max, step);
}

/**
 * Clamp a value to min/max and snap to step, always return rounded integer
 */
export function clampToStep(value: number, min: number, max: number, step: number): number {
  const stepped = Math.round((value - min) / step) * step + min;
  const clamped = Math.max(min, Math.min(max, stepped));
  return Math.round(clamped);
}

/**
 * Get value from pointer position (clientX) relative to track element
 */
export function getValueFromPosition(
  clientX: number,
  trackRect: DOMRect,
  min: number,
  max: number,
  step: number
): number {
  const percentage = Math.max(0, Math.min(1, (clientX - trackRect.left) / trackRect.width));
  const rawValue = min + percentage * (max - min);
  return clampToStep(rawValue, min, max, step);
}

/**
 * Find the closest thumb index to a given value
 */
export function findClosestThumb(
  value: number,
  values: number[]
): number {
  let closestIndex = 0;
  let minDistance = Math.abs(value - values[0]);

  for (let i = 1; i < values.length; i++) {
    const distance = Math.abs(value - values[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}
