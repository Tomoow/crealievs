/**
 * DatePicker: input + calendar popover. Logic split into types, utils, hooks, keyboard, and DatePickerCalendar.
 */
import React from 'react';
import { Calendar, X } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { DatePickerProps, CalendarViewMode, MonthTransition } from './DatePicker.types';
import { YEAR_INITIAL_PAST, YEAR_INITIAL_FUTURE } from './DatePicker.constants';
import {
  formatDateDDMMYYYY,
  formatDigitsAsDate,
  parseDateInput,
  startOfDay,
} from './DatePicker.utils';
import { useIsMobile, useDatePickerFloating, useDatePickerOpenEffects } from './DatePicker.hooks';
import { useDatePickerCalendarKeyboard } from './DatePicker.keyboard';
import { DatePickerSheet } from './DatePickerSheet';
import { DatePickerCalendar, type DatePickerCalendarProps } from './DatePickerCalendar';
import './DatePicker.css';

export type { DatePickerProps } from './DatePicker.types';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'dd/mm/yyyy',
  label,
  required = false,
  helperText,
  errorMessage,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  fullWidth = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
}) => {
  const autoId = React.useId();
  const fieldId = id ?? `date-picker-${autoId}`;
  const calendarId = `${fieldId}-calendar`;
  const descriptionId = errorMessage || helperText ? `${fieldId}-description` : undefined;

  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState<Date>(() => value ?? new Date());
  const [triggerFocused, setTriggerFocused] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<CalendarViewMode>('days');
  const [inputValue, setInputValue] = React.useState<string>(() =>
    value ? formatDateDDMMYYYY(value) : ''
  );
  const [yearWindowStart, setYearWindowStart] = React.useState(() =>
    (value ?? new Date()).getFullYear() - YEAR_INITIAL_PAST
  );
  const [yearWindowEnd, setYearWindowEnd] = React.useState(() =>
    (value ?? new Date()).getFullYear() + YEAR_INITIAL_FUTURE
  );
  const [monthTransition, setMonthTransition] = React.useState<MonthTransition | null>(null);
  const [slidePhase, setSlidePhase] = React.useState<'start' | 'end'>('start');
  const [focusedDay, setFocusedDay] = React.useState<Date | null>(null);

  const slideStripRef = React.useRef<HTMLDivElement>(null);
  const focusTargetRef = React.useRef<Date | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const hasError = Boolean(errorMessage);
  const formatDescriptionId = `${fieldId}-format`;
  const describedByAttr = [ariaDescribedBy, descriptionId, !descriptionId ? formatDescriptionId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  const floating = useDatePickerFloating(isOpen, isMobile, containerRef, calendarRef);
  useDatePickerOpenEffects({
    isOpen,
    viewMode,
    setViewMode,
    setIsOpen,
    wrapperRef,
    calendarRef,
    inputRef,
  });

  React.useEffect(() => {
    if (!isOpen) {
      setTriggerFocused(false);
      setViewMode('days');
      setMonthTransition(null);
      setFocusedDay(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (viewMode === 'days') setFocusedDay(value ?? new Date());
  }, [viewMode, value]);

  /* Clear month transition when leaving days view so arrows aren’t stuck disabled. */
  React.useEffect(() => {
    if (viewMode !== 'days') setMonthTransition(null);
  }, [viewMode]);

  React.useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  React.useEffect(() => {
    setInputValue(value ? formatDateDDMMYYYY(value) : '');
  }, [value]);

  React.useEffect(() => {
    if (viewMode === 'years') {
      const viewYear = viewDate.getFullYear();
      setYearWindowStart(viewYear - YEAR_INITIAL_PAST);
      setYearWindowEnd(viewYear + YEAR_INITIAL_FUTURE);
    }
  }, [viewMode, viewDate]);

  React.useEffect(() => {
    if (!monthTransition) return;
    const id = requestAnimationFrame(() => setSlidePhase('end'));
    return () => cancelAnimationFrame(id);
  }, [monthTransition]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const today = React.useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const yearOptions = React.useMemo(
    () => Array.from({ length: yearWindowEnd - yearWindowStart + 1 }, (_, i) => yearWindowStart + i),
    [yearWindowStart, yearWindowEnd]
  );

  const canPrevMonth =
    !minDate || viewYear > minDate.getFullYear() || (viewYear === minDate.getFullYear() && viewMonth > minDate.getMonth());
  const canNextMonth =
    !maxDate || viewYear < maxDate.getFullYear() || (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());
  const canPrevYear = !minDate || viewYear > minDate.getFullYear();
  const canNextYear = !maxDate || viewYear < maxDate.getFullYear();

  const openCalendar = React.useCallback(() => {
    if (disabled || readOnly) return;
    setViewDate(value ?? new Date());
    setIsOpen(true);
  }, [disabled, readOnly, value]);

  const closeCalendar = React.useCallback(() => setIsOpen(false), []);

  const handleInputClick = React.useCallback(() => {
    if (disabled || readOnly) return;
    openCalendar();
  }, [disabled, readOnly, openCalendar]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    setInputValue(formatDigitsAsDate(raw));
  }, [readOnly]);

  const handleInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setTriggerFocused(false);
      if (readOnly) {
        onBlur?.(e);
        return;
      }
      const parsed = parseDateInput(inputValue);
      if (parsed) {
        const d = startOfDay(parsed);
        if ((!minDate || d >= startOfDay(minDate)) && (!maxDate || d <= startOfDay(maxDate))) {
          onChange(parsed);
          setViewDate(parsed);
          setInputValue(formatDateDDMMYYYY(parsed));
        } else {
          setInputValue(value ? formatDateDDMMYYYY(value) : '');
        }
      } else {
        setInputValue(value ? formatDateDDMMYYYY(value) : '');
      }
      onBlur?.(e);
    },
    [readOnly, inputValue, value, minDate, maxDate, onChange, onBlur]
  );

  const handleInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        (e.target as HTMLInputElement).blur();
        openCalendar();
      }
      if (e.key === ' ') {
        e.preventDefault();
        openCalendar();
      }
    },
    [openCalendar]
  );

  const handleSelectDay = React.useCallback(
    (date: Date) => {
      const d = startOfDay(date);
      if (minDate && d < startOfDay(minDate)) return;
      if (maxDate && d > startOfDay(maxDate)) return;
      onChange(date);
    },
    [minDate, maxDate, onChange]
  );

  const handleToday = React.useCallback(() => {
    const t = startOfDay(new Date());
    if (minDate && t < startOfDay(minDate)) return;
    if (maxDate && t > startOfDay(maxDate)) return;
    onChange(t);
    setViewDate(new Date());
  }, [minDate, maxDate, onChange]);

  const handleClear = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled || readOnly) return;
      onChange(null);
    },
    [disabled, readOnly, onChange]
  );

  const isDayDisabled = React.useCallback(
    (date: Date) => {
      const d = startOfDay(date);
      if (minDate && d < startOfDay(minDate)) return true;
      if (maxDate && d > startOfDay(maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const goToPrevMonth = React.useCallback(() => {
    if (!canPrevMonth) return;
    if (viewMode !== 'days') {
      setViewDate(new Date(viewYear, viewMonth - 1));
      return;
    }
    if (monthTransition) return;
    const to = new Date(viewYear, viewMonth - 1);
    setMonthTransition({ from: viewDate, to, direction: 'prev' });
    setSlidePhase('start');
  }, [viewMode, monthTransition, canPrevMonth, viewYear, viewMonth, viewDate]);

  const goToNextMonth = React.useCallback(() => {
    if (!canNextMonth) return;
    if (viewMode !== 'days') {
      setViewDate(new Date(viewYear, viewMonth + 1));
      return;
    }
    if (monthTransition) return;
    const to = new Date(viewYear, viewMonth + 1);
    setMonthTransition({ from: viewDate, to, direction: 'next' });
    setSlidePhase('start');
  }, [viewMode, monthTransition, canNextMonth, viewYear, viewMonth, viewDate]);

  const handleSlideTransitionEnd = React.useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== slideStripRef.current || e.propertyName !== 'transform') return;
    if (monthTransition) {
      setViewDate(monthTransition.to);
      setMonthTransition(null);
      setSlidePhase('start');
    }
  }, [monthTransition]);

  const handleCalendarWheel = React.useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (viewMode !== 'days' || monthTransition) return;
      e.preventDefault();
      if (e.deltaY > 0) goToNextMonth();
      else goToPrevMonth();
    },
    [viewMode, monthTransition, goToPrevMonth, goToNextMonth]
  );

  const handleCalendarKeyDown = useDatePickerCalendarKeyboard({
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
  });

  const displayText = inputValue;
  const isPlaceholder = !value && !inputValue;
  const triggerAriaLabel = ariaLabel || (typeof label === 'string' ? label : undefined);

  const iconButtonProps = {
    variant: 'default' as const,
    size: 'small' as const,
    tooltipVariant: 'plain' as const,
    tooltipPosition: 'top' as const,
  };

  const calendarProps: DatePickerCalendarProps = {
    viewMode,
    setViewMode,
    viewYear,
    viewMonth,
    setViewDate,
    value,
    monthTransition,
    slidePhase,
    slideStripRef,
    handleSlideTransitionEnd,
    focusTargetRef,
    focusedDay,
    today,
    yearOptions,
    setYearWindowStart,
    setYearWindowEnd,
    canPrevMonth,
    canNextMonth,
    canPrevYear,
    canNextYear,
    goToPrevMonth,
    goToNextMonth,
    handleSelectDay,
    isDayDisabled,
    onToday: handleToday,
    onConfirm: closeCalendar,
    onReturnToDaysView: () => setMonthTransition(null),
    handleCalendarWheel,
  };

  const calendarDialog = (
    <div
      ref={calendarRef}
      id={calendarId}
      role="dialog"
      aria-modal="true"
      aria-label="Calendar"
      tabIndex={-1}
      className={isMobile ? 'date-picker__sheet date-picker__calendar' : 'date-picker__calendar'}
      style={!isMobile ? { position: floating.strategy, top: floating.y ?? 0, left: floating.x ?? 0 } : undefined}
      onKeyDown={handleCalendarKeyDown}
    >
      <DatePickerCalendar {...calendarProps} />
    </div>
  );

  const calendarEl = isMobile ? (
    <DatePickerSheet onClose={closeCalendar}>{calendarDialog}</DatePickerSheet>
  ) : (
    calendarDialog
  );

  return (
    <div
      ref={wrapperRef}
      className={`date-picker-wrapper${hasError ? ' date-picker-wrapper--error' : ''}${fullWidth ? ' date-picker-wrapper--full-width' : ''} ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={fieldId}
          className={`date-picker__label${hasError ? ' date-picker__label--error' : ''}`.trim()}
        >
          {label}
          {required && <span className="date-picker__required-indicator">*</span>}
        </label>
      )}

      <div
        ref={containerRef}
        className={`date-picker-container${hasError ? ' date-picker-container--error' : ''}${
          disabled ? ' date-picker-container--disabled' : ''
        }${readOnly ? ' date-picker-container--readonly' : ''}${
          isOpen ? ' date-picker-container--open' : ''
        }${triggerFocused ? ' date-picker-container--focused' : ''}`}
        onClick={(e) => {
          if (disabled || readOnly) return;
          if ((e.target as HTMLElement).closest('.date-picker__actions')) return;
          openCalendar();
        }}
      >
        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayText}
          placeholder={placeholder}
          className={`date-picker__input${isPlaceholder ? ' date-picker__input--placeholder' : ''}`}
          onClick={handleInputClick}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onFocus={(e) => {
            setTriggerFocused(true);
            onFocus?.(e);
          }}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={triggerAriaLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={calendarId}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-describedby={describedByAttr || undefined}
        />

        <span className="date-picker__actions">
          {value && !readOnly && !disabled && (
            <IconButton
              {...iconButtonProps}
              icon={X}
              onClick={handleClear}
              aria-label="Clear date"
              className="date-picker__clear-button"
            />
          )}
          {value && !readOnly && !disabled && (
            <span className="date-picker__separator" aria-hidden="true" />
          )}
          <IconButton
            {...iconButtonProps}
            icon={Calendar}
            tabIndex={-1}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              if (isOpen) closeCalendar();
              else openCalendar();
            }}
            aria-label={isOpen ? 'Close calendar' : 'Open calendar'}
            className="date-picker__calendar-button"
          />
        </span>
      </div>

      {isOpen && calendarEl}

      {!descriptionId && (
        <span id={formatDescriptionId} className="date-picker__format-hint">
          Format: day, month, year, for example 25 slash 01 slash 2026.
        </span>
      )}
      {descriptionId && (
        <span
          id={descriptionId}
          className={`date-picker__helper-text${hasError ? ' date-picker__helper-text--error' : ''}`.trim()}
        >
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
};
