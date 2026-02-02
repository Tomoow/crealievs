import React from 'react';
import { useFloating, offset, flip, size, Placement } from '@floating-ui/react-dom';
import { CALENDAR_MIN_WIDTH_PX } from './DatePicker.constants';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handle = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);
  return isMobile;
}

export function useDatePickerFloating(
  isOpen: boolean,
  isMobile: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  calendarRef: React.RefObject<HTMLDivElement | null>
) {
  const { x, y, strategy, refs, update } = useFloating({
    placement: 'bottom-start' as Placement,
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ['top-start', 'bottom-start'] }),
      size({
        apply({ elements, rects }) {
          const w = Math.max(rects.reference.width, CALENDAR_MIN_WIDTH_PX);
          Object.assign(elements.floating.style, { width: `${w}px` });
        },
      }),
    ],
  });

  React.useEffect(() => {
    if (containerRef.current) refs.setReference(containerRef.current);
  }, [refs, containerRef]);

  React.useEffect(() => {
    if (isOpen && calendarRef.current && !isMobile) {
      refs.setFloating(calendarRef.current);
      requestAnimationFrame(() => update());
    }
  }, [isOpen, isMobile, refs, update, calendarRef]);

  React.useEffect(() => {
    if (!isOpen || isMobile) return;
    const handleUpdate = () => {
      if (refs.reference.current && refs.floating.current) update();
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, isMobile, update, refs]);

  return { x, y, strategy, refs, update };
}

export function useDatePickerOpenEffects(opts: {
  isOpen: boolean;
  viewMode: 'days' | 'months' | 'years';
  setViewMode: React.Dispatch<React.SetStateAction<'days' | 'months' | 'years'>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { isOpen, viewMode, setViewMode, setIsOpen, wrapperRef, calendarRef, inputRef } = opts;

  React.useEffect(() => {
    if (!isOpen) {
      setViewMode('days');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    const calendar = calendarRef.current;
    if (!calendar) return;
    requestAnimationFrame(() => calendar.focus());
  }, [isOpen, setViewMode, calendarRef, inputRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside, true), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, setIsOpen, wrapperRef, calendarRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (viewMode !== 'days') setViewMode('days');
        else setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, viewMode, setViewMode, setIsOpen]);
}
