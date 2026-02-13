/**
 * Tab: single-select tab list. Figma 67:580 (underline bar), 67:581 (tab instance states).
 * Underline variant: sliding pill indicator under active tab. Overflow: arrows + drag-to-scroll.
 */
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { TabProps, TabOption } from './Tab.types';
import './Tab.css';

export type { TabProps, TabOption, TabVariant } from './Tab.types';

type UnderlineIndicatorStyle = { left: number; width: number } | null;

function useScrollOverflow(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const [showArrows, setShowArrows] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth } = el;
    setShowArrows(scrollWidth > clientWidth);
  }, [scrollRef]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollRef, update]);

  return { showArrows, update };
}

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [underlineIndicator, setUnderlineIndicator] = useState<UnderlineIndicatorStyle>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  const { showArrows, update: updateScrollState } = useScrollOverflow(scrollRef);

  useLayoutEffect(() => {
    if (variant !== 'underline' || value === null) {
      setUnderlineIndicator(null);
      return;
    }
    const list = listRef.current;
    const tabEl = list?.querySelector<HTMLButtonElement>(`[data-tab-value="${CSS.escape(value)}"]`);
    if (!list || !tabEl) return;
    setUnderlineIndicator({
      left: tabEl.offsetLeft,
      width: tabEl.offsetWidth,
    });
  }, [variant, value, tabs]);

  const currentIndex = tabs.findIndex((t) => t.value === value);

  const scrollToCenterTab = useCallback(
    (index: number) => {
      const scrollEl = scrollRef.current;
      const list = listRef.current;
      const tabValue = tabs[index]?.value;
      if (!scrollEl || !list || tabValue == null) return;
      const tabEl = list.querySelector<HTMLButtonElement>(`[data-tab-value="${CSS.escape(tabValue)}"]`);
      if (!tabEl) return;
      const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
      const scrollCenter = scrollEl.clientWidth / 2;
      const targetScroll = Math.max(0, Math.min(tabCenter - scrollCenter, scrollEl.scrollWidth - scrollEl.clientWidth));
      scrollEl.scrollTo({ left: targetScroll, behavior: 'smooth' });
      requestAnimationFrame(updateScrollState);
      setTimeout(updateScrollState, 350);
    },
    [tabs, updateScrollState]
  );

  useLayoutEffect(() => {
    if (value === null || currentIndex < 0) return;
    scrollToCenterTab(currentIndex);
  }, [value, currentIndex, scrollToCenterTab]);

  const canGoLeft = showArrows && currentIndex > 0;
  const canGoRight = showArrows && currentIndex < tabs.length - 1;

  const handleScrollLeft = () => {
    if (!canGoLeft) return;
    const prevIndex = currentIndex - 1;
    const prev = tabs[prevIndex];
    if (prev && !prev.disabled) onChange(prev.value);
  };
  const handleScrollRight = () => {
    if (!canGoRight) return;
    const nextIndex = currentIndex + 1;
    const next = tabs[nextIndex];
    if (next && !next.disabled) onChange(next.value);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = dragRef.current.startX - e.clientX;
    el.scrollLeft = dragRef.current.startScrollLeft + dx;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
    setIsDragging(false);
  };

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
    <div className={`tab tab--${variant} ${className}`.trim()}>
      {showArrows && (
        <IconButton
          icon={ChevronLeft}
          variant="tertiary"
          size="small"
          aria-label="Previous tab"
          state={canGoLeft ? 'default' : 'disabled'}
          onClick={handleScrollLeft}
          className="tab__nav tab__nav--left"
        />
      )}
      <div className="tab__scroll-wrap">
        <div
          ref={scrollRef}
          className={`tab__scroll ${isDragging ? 'tab__scroll--dragging' : ''}`.trim()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            ref={listRef}
            id={groupId}
            role="tablist"
            aria-label={ariaLabel}
            className="tab__list"
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
        </div>
        {variant === 'underline' && (
          <div role="presentation" className="tab__baseline" aria-hidden />
        )}
      </div>
      {showArrows && (
        <IconButton
          icon={ChevronRight}
          variant="tertiary"
          size="small"
          aria-label="Next tab"
          state={canGoRight ? 'default' : 'disabled'}
          onClick={handleScrollRight}
          className="tab__nav tab__nav--right"
        />
      )}
    </div>
  );
};
