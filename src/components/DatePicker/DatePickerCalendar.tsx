import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { IconButton } from '../IconButton';
import { Button } from '../Button';
import type { CalendarViewMode, MonthTransition } from './DatePicker.types';
import { WEEKDAYS, MONTHS_SHORT, YEAR_PAGE_SIZE } from './DatePicker.constants';
import { getCalendarDays, isSameDay } from './DatePicker.utils';

export type DatePickerCalendarProps = {
  viewMode: CalendarViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<CalendarViewMode>>;
  viewYear: number;
  viewMonth: number;
  setViewDate: (d: Date) => void;
  value: Date | null;
  monthTransition: MonthTransition | null;
  slidePhase: 'start' | 'end';
  slideStripRef: React.Ref<HTMLDivElement>;
  handleSlideTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void;
  focusTargetRef: React.MutableRefObject<Date | null>;
  focusedDay: Date | null;
  today: Date;
  yearOptions: number[];
  setYearWindowStart: React.Dispatch<React.SetStateAction<number>>;
  setYearWindowEnd: React.Dispatch<React.SetStateAction<number>>;
  canPrevMonth: boolean;
  canNextMonth: boolean;
  canPrevYear: boolean;
  canNextYear: boolean;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  handleSelectDay: (date: Date) => void;
  isDayDisabled: (date: Date) => boolean;
  onToday: () => void;
  onConfirm: () => void;
  onReturnToDaysView: () => void;
  handleCalendarWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
};

const iconButtonProps = {
  variant: 'default' as const,
  size: 'small' as const,
  tooltipVariant: 'plain' as const,
  tooltipPosition: 'top' as const,
};

export function DatePickerCalendar({
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
  onToday,
  onConfirm,
  onReturnToDaysView,
  handleCalendarWheel,
}: DatePickerCalendarProps) {
  const renderMonthPanel = (year: number, month: number) => {
    const days = getCalendarDays(year, month);
    return (
      <div key={`${year}-${month}`} className="date-picker__calendar-slide-panel">
        <div className="date-picker__weekdays">
          {WEEKDAYS.map((day, i) => (
            <span
              key={day}
              className={`date-picker__weekday${i >= 5 ? ' date-picker__weekday--weekend' : ''}`}
            >
              {day}
            </span>
          ))}
        </div>
        <div className="date-picker__days">
          {days.map(({ date, isCurrentMonth }) => {
            const dayNum = date.getDate();
            const isToday = isSameDay(date, today);
            const isSelected = value ? isSameDay(date, value) : false;
            const isDisabled = isDayDisabled(date);
            const isFocusTarget =
              focusTargetRef.current !== null && isSameDay(date, focusTargetRef.current);
            const isRovingFocused = focusedDay !== null && isSameDay(date, focusedDay);
            return (
              <button
                key={date.getTime()}
                type="button"
                data-date={date.getTime()}
                tabIndex={isRovingFocused ? 0 : -1}
                ref={
                  isFocusTarget
                    ? (el) => {
                        if (el) {
                          el.focus();
                          focusTargetRef.current = null;
                        }
                      }
                    : undefined
                }
                className={`date-picker__day${!isCurrentMonth ? ' date-picker__day--other-month' : ''}${
                  isToday ? ' date-picker__day--today' : ''
                }${isSelected ? ' date-picker__day--selected' : ''}`}
                onClick={() => handleSelectDay(date)}
                disabled={isDisabled}
                aria-label={date.toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                aria-selected={isSelected || undefined}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="date-picker__calendar-header">
        <div className="date-picker__calendar-nav">
          <IconButton
            {...iconButtonProps}
            icon={ChevronLeft}
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="date-picker__calendar-nav-icon"
            tabIndex={viewMode !== 'days' ? -1 : undefined}
            state={!canPrevMonth || monthTransition ? 'disabled' : 'default'}
          />
          <Button
            variant="simple"
            size="small"
            showRightIcon
            iconRight={viewMode === 'months' ? ChevronUp : ChevronDown}
            onClick={() => setViewMode((m) => (m === 'months' ? 'days' : 'months'))}
            aria-label="Select month"
            aria-haspopup="listbox"
            aria-expanded={viewMode === 'months'}
            className="date-picker__calendar-month-trigger"
          >
            {MONTHS_SHORT[viewMonth]}
          </Button>
          <IconButton
            {...iconButtonProps}
            icon={ChevronRight}
            onClick={goToNextMonth}
            aria-label="Next month"
            className="date-picker__calendar-nav-icon"
            tabIndex={viewMode !== 'days' ? -1 : undefined}
            state={!canNextMonth || monthTransition ? 'disabled' : 'default'}
          />
        </div>
        <div className="date-picker__calendar-nav">
          <IconButton
            {...iconButtonProps}
            icon={ChevronLeft}
            onClick={() =>
              viewMode === 'years'
                ? (setYearWindowStart((y) => y - YEAR_PAGE_SIZE), setYearWindowEnd((y) => y - YEAR_PAGE_SIZE))
                : setViewDate(new Date(viewYear - 1, viewMonth))
            }
            aria-label={viewMode === 'years' ? 'Previous year range' : 'Previous year'}
            className="date-picker__calendar-nav-icon"
            tabIndex={viewMode !== 'days' ? -1 : undefined}
            state={viewMode === 'years' ? 'default' : !canPrevYear ? 'disabled' : 'default'}
          />
          <Button
            variant="simple"
            size="small"
            showRightIcon
            iconRight={viewMode === 'years' ? ChevronUp : ChevronDown}
            onClick={() => setViewMode((m) => (m === 'years' ? 'days' : 'years'))}
            aria-label="Select year"
            aria-haspopup="listbox"
            aria-expanded={viewMode === 'years'}
            className="date-picker__calendar-year-trigger"
          >
            {viewYear}
          </Button>
          <IconButton
            {...iconButtonProps}
            icon={ChevronRight}
            onClick={() =>
              viewMode === 'years'
                ? (setYearWindowStart((y) => y + YEAR_PAGE_SIZE), setYearWindowEnd((y) => y + YEAR_PAGE_SIZE))
                : setViewDate(new Date(viewYear + 1, viewMonth))
            }
            aria-label={viewMode === 'years' ? 'Next year range' : 'Next year'}
            className="date-picker__calendar-nav-icon"
            tabIndex={viewMode !== 'days' ? -1 : undefined}
            state={viewMode === 'years' ? 'default' : !canNextYear ? 'disabled' : 'default'}
          />
        </div>
      </div>
      <div
        className="date-picker__calendar-body"
        onWheel={viewMode === 'days' ? handleCalendarWheel : undefined}
      >
        {viewMode === 'days' && !monthTransition && renderMonthPanel(viewYear, viewMonth)}
        {viewMode === 'days' && monthTransition && (
          <div className="date-picker__calendar-slide">
            <div
              ref={slideStripRef as React.RefObject<HTMLDivElement>}
              className={`date-picker__calendar-slide-strip date-picker__calendar-slide-strip--${monthTransition.direction} date-picker__calendar-slide-strip--${slidePhase}`}
              onTransitionEnd={handleSlideTransitionEnd}
              style={{
                transform: `translateX(${
                  monthTransition.direction === 'next'
                    ? slidePhase === 'start'
                      ? 0
                      : -50
                    : slidePhase === 'start'
                      ? -50
                      : 0
                }%)`,
              }}
            >
              {monthTransition.direction === 'next' ? (
                <>
                  {renderMonthPanel(monthTransition.from.getFullYear(), monthTransition.from.getMonth())}
                  {renderMonthPanel(monthTransition.to.getFullYear(), monthTransition.to.getMonth())}
                </>
              ) : (
                <>
                  {renderMonthPanel(monthTransition.to.getFullYear(), monthTransition.to.getMonth())}
                  {renderMonthPanel(monthTransition.from.getFullYear(), monthTransition.from.getMonth())}
                </>
              )}
            </div>
          </div>
        )}
        {viewMode === 'days' && (
          <div className="date-picker__calendar-body-footer">
            <Button
              variant="link"
              size="small"
              type="button"
              className="date-picker__calendar-footer-today"
              onClick={onToday}
            >
              Vandaag
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              className="date-picker__calendar-footer-confirm"
              onClick={onConfirm}
            >
              Bevestigen
            </Button>
          </div>
        )}
        {viewMode === 'months' && (
          <div className="date-picker__calendar-view date-picker__calendar-view--months" role="listbox" aria-label="Months">
            {MONTHS_SHORT.map((month, i) => (
              <button
                key={month}
                type="button"
                role="option"
                aria-selected={viewMonth === i}
                className="date-picker__calendar-pick-option"
                onClick={() => {
                  setViewDate(new Date(viewYear, i, 1));
                  setViewMode('days');
                  onReturnToDaysView();
                }}
              >
                {month}
              </button>
            ))}
          </div>
        )}
        {viewMode === 'years' && (
          <div className="date-picker__calendar-view--years-wrapper">
            <Button
              variant="simple"
              size="small"
              type="button"
              className="date-picker__calendar-load-more"
              onClick={() => setYearWindowStart((y) => y - YEAR_PAGE_SIZE)}
            >
              Load more
            </Button>
            <div className="date-picker__calendar-view date-picker__calendar-view--years" role="listbox" aria-label="Years">
              {yearOptions.map((yearVal) => (
                <button
                  key={yearVal}
                  type="button"
                  role="option"
                  aria-selected={viewYear === yearVal}
                  className="date-picker__calendar-pick-option"
                  onClick={() => {
                    setViewDate(new Date(yearVal, viewMonth, 1));
                    setViewMode('days');
                    onReturnToDaysView();
                  }}
                >
                  {yearVal}
                </button>
              ))}
            </div>
            <Button
              variant="simple"
              size="small"
              type="button"
              className="date-picker__calendar-load-more"
              onClick={() => setYearWindowEnd((y) => y + YEAR_PAGE_SIZE)}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
