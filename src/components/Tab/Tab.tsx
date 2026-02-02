/**
 * Tab: single-select tab list. Figma 67:580 (underline bar), 67:581 (tab instance states).
 * Underline variant: sliding pill indicator (5px, pill radius) under active tab; pill variant: bg states.
 */
import React, { useRef, useLayoutEffect, useState } from 'react';
import type { TabProps, TabOption } from './Tab.types';
import './Tab.css';

export type { TabProps, TabOption, TabVariant } from './Tab.types';

type UnderlineIndicatorStyle = { left: number; width: number } | null;

export const Tab: React.FC<TabProps> = ({
  tabs,
  value,
  onChange,
  variant = 'underline',
  className = '',
  'aria-label': ariaLabel,
  id,
}) => {
  const autoId = React.useId();
  const groupId = id ?? `tab-${autoId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [underlineIndicator, setUnderlineIndicator] = useState<UnderlineIndicatorStyle>(null);

  useLayoutEffect(() => {
    if (variant !== 'underline' || value === null) {
      setUnderlineIndicator(null);
      return;
    }
    const container = containerRef.current;
    const tabEl = container?.querySelector<HTMLButtonElement>(
      `[data-tab-value="${CSS.escape(value)}"]`
    );
    if (!container || !tabEl) return;

    const cRect = container.getBoundingClientRect();
    const tRect = tabEl.getBoundingClientRect();
    setUnderlineIndicator({
      left: tRect.left - cRect.left,
      width: tRect.width,
    });
  }, [variant, value, tabs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, currentIndex: number) => {
    const enabled = tabs.filter((t) => !t.disabled);
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = Math.max(0, currentIndex - 1);
      const prev = tabs[prevIndex];
      if (prev && !prev.disabled) onChange(prev.value);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = Math.min(tabs.length - 1, currentIndex + 1);
      const next = tabs[nextIndex];
      if (next && !next.disabled) onChange(next.value);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = enabled[0];
      if (first) onChange(first.value);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = enabled[enabled.length - 1];
      if (last) onChange(last.value);
    }
  };

  return (
    <div
      ref={containerRef}
      id={groupId}
      role="tablist"
      aria-label={ariaLabel}
      className={`tab tab--${variant} ${className}`.trim()}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const index = Array.from((e.currentTarget as HTMLElement).querySelectorAll('[role="tab"]')).indexOf(target);
        if (index >= 0) handleKeyDown(e, index);
      }}
    >
      {variant === 'underline' && underlineIndicator !== null && (
        <div
          className="tab__indicator"
          aria-hidden
          style={{
            left: underlineIndicator.left,
            width: underlineIndicator.width,
          }}
        />
      )}
      {tabs.map((tab) => {
        const selected = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            id={`${groupId}-tab-${tab.value}`}
            data-tab-value={tab.value}
            className="tab__item"
            onClick={() => !tab.disabled && onChange(tab.value)}
          >
            <span className="tab__label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
