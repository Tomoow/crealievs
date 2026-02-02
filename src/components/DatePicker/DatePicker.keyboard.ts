import React from 'react';
import { startOfDay } from './DatePicker.utils';

export function useDatePickerCalendarKeyboard(opts: {
  calendarRef: React.RefObject<HTMLDivElement | null>;
  viewMode: 'days' | 'months' | 'years';
  monthTransition: { from: Date; to: Date; direction: 'prev' | 'next' } | null;
  minDate?: Date;
  maxDate?: Date;
  focusTargetRef: React.MutableRefObject<Date | null>;
  setViewDate: (d: Date) => void;
  setFocusedDay: React.Dispatch<React.SetStateAction<Date | null>>;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}) {
  const {
    calendarRef,
    viewMode,
    monthTransition,
    minDate,
    maxDate,
    focusTargetRef,
    setViewDate,
    setFocusedDay,
    goToPrevMonth,
    goToNextMonth,
  } = opts;

  return React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key;
      const calendar = calendarRef.current;
      if (!calendar) return;

      if (key === 'Tab') {
        const focusableSelector =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(calendar.querySelectorAll<HTMLElement>(focusableSelector));
        const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
        if (focusables.length === 0) return;
        if (currentIndex === -1) {
          e.preventDefault();
          (e.shiftKey ? focusables[focusables.length - 1] : focusables[0])?.focus();
          return;
        }
        const nextIndex = e.shiftKey
          ? currentIndex === 0 ? focusables.length - 1 : currentIndex - 1
          : currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
        e.preventDefault();
        focusables[nextIndex]?.focus();
        return;
      }

      if (viewMode !== 'days' || monthTransition) return;
      const target = e.target as HTMLElement;
      const dayButton = target.closest?.('.date-picker__day');
      const dataDate = dayButton?.getAttribute('data-date');

      if (dayButton && dataDate) {
        const current = new Date(parseInt(dataDate, 10));
        let next: Date;
        if (key === 'ArrowLeft') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
        else if (key === 'ArrowRight') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
        else if (key === 'ArrowUp') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
        else if (key === 'ArrowDown') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
        else return;

        const nextDayStart = startOfDay(next);
        if (minDate && nextDayStart < startOfDay(minDate)) return;
        if (maxDate && nextDayStart > startOfDay(maxDate)) return;

        e.preventDefault();
        setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
        focusTargetRef.current = next;
        setFocusedDay(next);
        return;
      }

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const inCalendar = (e.target as HTMLElement).closest?.('[role="dialog"]');
        if (inCalendar) {
          e.preventDefault();
          if (key === 'ArrowLeft') goToPrevMonth();
          else goToNextMonth();
        }
      }
    },
    [
      calendarRef,
      viewMode,
      monthTransition,
      minDate,
      maxDate,
      focusTargetRef,
      setViewDate,
      setFocusedDay,
      goToPrevMonth,
      goToNextMonth,
    ]
  );
}
