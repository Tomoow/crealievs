/**
 * Segmented Buttons: single-select group built from segment instances (icon + label).
 * Uses a sliding pill indicator so the white background animates from one segment to the next.
 * ResizeObserver keeps the indicator aligned when the viewport or layout changes.
 */
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import type { SegmentedButtonsProps, SegmentOption } from './SegmentedButtons.types';
import './SegmentedButtons.css';

export type { SegmentedButtonsProps, SegmentOption } from './SegmentedButtons.types';

type IndicatorStyle = { left: number; top: number; width: number; height: number } | null;

export const SegmentedButtons: React.FC<SegmentedButtonsProps> = ({
  options,
  value,
  onChange,
  size = 'default',
  className = '',
  'aria-label': ariaLabel,
  id,
}) => {
  const autoId = React.useId();
  const groupId = id ?? `segmented-buttons-${autoId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<IndicatorStyle>(null);

  const updateIndicator = useCallback(() => {
    if (value === null) {
      setIndicator(null);
      return;
    }
    const container = containerRef.current;
    const segment = container?.querySelector<HTMLButtonElement>(
      `[data-segment-value="${CSS.escape(value)}"]`
    );
    if (!container || !segment) return;

    const cRect = container.getBoundingClientRect();
    const sRect = segment.getBoundingClientRect();
    setIndicator({
      left: sRect.left - cRect.left,
      top: sRect.top - cRect.top,
      width: sRect.width,
      height: sRect.height,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, options]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, currentIndex: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const nextIndex =
      e.key === 'ArrowLeft'
        ? Math.max(0, currentIndex - 1)
        : Math.min(options.length - 1, currentIndex + 1);
    const next = options[nextIndex];
    if (next && !next.disabled) onChange(next.value);
  };

  return (
    <div
      ref={containerRef}
      id={groupId}
      role="radiogroup"
      aria-label={ariaLabel}
      className={`segmented-buttons ${size === 'small' ? 'segmented-buttons--small' : ''} ${className}`.trim()}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const index = Array.from(
          (e.currentTarget as HTMLElement).querySelectorAll('[role="radio"]')
        ).indexOf(target);
        if (index >= 0) handleKeyDown(e, index);
      }}
    >
      {indicator !== null && (
        <div
          className="segmented-buttons__indicator"
          aria-hidden
          style={{
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
          }}
        />
      )}
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            aria-disabled={option.disabled}
            data-segment-value={option.value}
            className="segmented-buttons__segment"
            onClick={(e) => {
              if (!option.disabled) {
                onChange(option.value);
                (e.currentTarget as HTMLButtonElement).blur();
              }
            }}
          >
            {Icon && <Icon className="segmented-buttons__icon" aria-hidden />}
            <span className="segmented-buttons__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
