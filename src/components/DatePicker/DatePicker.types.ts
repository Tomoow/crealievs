export type CalendarViewMode = 'days' | 'months' | 'years';

export type DatePickerLabelProps =
  | { label: string; 'aria-label'?: never }
  | { label?: undefined; 'aria-label': string };

export type DatePickerProps = DatePickerLabelProps & {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  backToTodayLabel?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type MonthTransition = {
  from: Date;
  to: Date;
  direction: 'prev' | 'next';
};
