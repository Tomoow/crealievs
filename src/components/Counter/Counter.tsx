/**
 * Counter: [decrement] [number input] [increment] with pill-shaped ends.
 * Matches Figma DS Counter; uses semantic tokens.
 */
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { CounterProps } from './Counter.types';
import './Counter.css';

export type { CounterProps } from './Counter.types';

const NUMERIC_ALLOWED_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

export const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  id,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autoId = React.useId();
  const inputId = id ?? `counter-${autoId}`;
  const liveRegionId = `${inputId}-live`;

  const numValue = Number.isFinite(value) ? value : (min ?? 0);
  const effectiveValue = numValue;
  const canDecrement = !disabled && (typeof min !== 'number' || effectiveValue > min);
  const canIncrement = !disabled && (typeof max !== 'number' || effectiveValue < max);

  const handleDecrement = () => {
    if (!canDecrement) return;
    const next = typeof min === 'number' ? Math.max(min, effectiveValue - step) : effectiveValue - step;
    onChange(next);
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next = typeof max === 'number' ? Math.min(max, effectiveValue + step) : effectiveValue + step;
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(min ?? 0);
      return;
    }
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) {
      let next = n;
      if (typeof min === 'number') next = Math.max(min, next);
      if (typeof max === 'number') next = Math.min(max, next);
      onChange(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const isDigit = /^\d$/.test(e.key);
    const isCtrl = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
    if (!NUMERIC_ALLOWED_KEYS.has(e.key) && !isDigit && !isCtrl) {
      e.preventDefault();
    }
  };

  const decrementLabel = canDecrement ? 'Decrease value' : "Can't go lower";
  const incrementLabel = canIncrement ? 'Increase value' : "Can't go higher";

  return (
    <div className={`counter ${className}`.trim()} role="group" aria-label={ariaLabel ?? 'Counter'}>
      <IconButton
        icon={Minus}
        variant="tertiary"
        size="small"
        onClick={handleDecrement}
        aria-label={decrementLabel}
        state={canDecrement ? 'default' : 'disabled'}
      />
      <div className="counter__field-wrap">
        <input
          ref={inputRef}
          id={inputId}
          type="number"
          min={typeof min === 'number' ? min : undefined}
          max={typeof max === 'number' ? max : undefined}
          step={step}
          value={effectiveValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={disabled}
          aria-label={ariaLabel ?? 'Value'}
          aria-valuenow={effectiveValue}
          aria-valuemin={min}
          aria-valuemax={max}
          className="counter__input"
          style={{
            width: `${Math.max(2, String(effectiveValue).length)}ch`,
          }}
        />
      </div>
      <IconButton
        icon={Plus}
        variant="primary"
        size="small"
        onClick={handleIncrement}
        aria-label={incrementLabel}
        state={canIncrement ? 'default' : 'disabled'}
      />
      <div id={liveRegionId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {effectiveValue}
      </div>
    </div>
  );
};
