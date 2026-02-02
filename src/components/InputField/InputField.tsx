import React from 'react';
import { LucideIcon, X, Eye, EyeOff, Plus, Minus } from 'lucide-react';
import { IconButton } from '../IconButton';
import './InputField.css';

export type InputFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'search'
  | 'number';

type InputFieldLabelProps =
  | {
      /** Visible label rendered above the input. */
      label: string;
      /** Only required when no visible `label` is provided. */
      'aria-label'?: never;
    }
  | {
      label?: undefined;
      'aria-label': string;
    };

export type InputFieldProps = InputFieldLabelProps & {
  type?: InputFieldType;
  required?: boolean;
  placeholder?: string;
  value: string;
  helperText?: string;
  /** Left icon (ignored when type='number' for stepper mode) */
  leftIcon?: LucideIcon;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Called when the clear button is activated.
   * If not provided, defaults to clearing the input value.
   */
  onClear?: () => void;
  /**
   * Accessible name for the clear button.
   * @default 'Clear input'
   */
  clearButtonAriaLabel?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  readOnly?: boolean;
  /** Minimum numeric value when using type='number'. */
  min?: number;
  /** Maximum numeric value when using type='number'. */
  max?: number;
  /** Step size when using type='number'. @default 1 */
  step?: number;
};

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

const createChangeEvent = (value: string): React.ChangeEvent<HTMLInputElement> => ({
  target: { value },
  currentTarget: { value },
} as React.ChangeEvent<HTMLInputElement>);

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  label,
  required = false,
  placeholder,
  value,
  helperText,
  leftIcon: LeftIcon,
  errorMessage,
  onChange,
  onClear,
  clearButtonAriaLabel = 'Clear input',
  onFocus,
  onBlur,
  className = '',
  id,
  name,
  autoComplete,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  readOnly = false,
  min,
  max,
  step = 1,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const autoId = React.useId();
  const inputId = id ?? `input-field-${autoId}`;
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const liveRegionId = `${inputId}-live`;

  const hasError = Boolean(errorMessage);
  const helperOrErrorId = errorMessage || helperText ? `${inputId}-description` : undefined;
  const ariaDescribedByAttr = [ariaDescribedBy, helperOrErrorId].filter(Boolean).join(' ') || undefined;

  const isPasswordType = type === 'password';
  const isNumberType = type === 'number';
  const shouldShowStepper = isNumberType && !readOnly;
  const effectiveType = isPasswordType && isPasswordVisible ? 'text' : type;
  const hasValue = value.length > 0;
  const isClearVisible = !isPasswordType && !shouldShowStepper && hasValue && !readOnly;
  const isPasswordToggleVisible = isPasswordType && hasValue && !readOnly;

  // Stepper logic
  const currentNumericValue = isNumberType && value.trim() ? Number(value) : null;
  const numericValue = Number.isNaN(currentNumericValue) ? null : currentNumericValue;
  const effectiveValue = numericValue ?? min ?? 0;

  const canDecrement = typeof min !== 'number' || effectiveValue > min;
  const canIncrement = typeof max !== 'number' || effectiveValue < max;

  const minusButtonLabel = canDecrement ? 'Decrease value' : "Can't go lower";
  const plusButtonLabel = canIncrement ? 'Increase value' : "Can't go higher";

  const handleStep = (direction: 1 | -1) => {
    const base = numericValue ?? min ?? 0;
    let next = base + direction * step;
    if (typeof min === 'number') next = Math.max(min, next);
    if (typeof max === 'number') next = Math.min(max, next);
    onChange(createChangeEvent(String(next)));
    // Announce new value to screen readers after a brief delay to ensure DOM update
    setTimeout(() => {
      const liveRegion = document.getElementById(liveRegionId);
      if (liveRegion) {
        liveRegion.textContent = String(next);
      }
    }, 0);
    // Don't move focus - keep it on the button so user can continue pressing
  };

  const handleClear = () => {
    onClear ? onClear() : onChange(createChangeEvent(''));
    inputRef.current?.focus();
  };

  const handleTogglePasswordVisibility = () => {
    const inputEl = inputRef.current;
    const selectionStart = inputEl?.selectionStart ?? null;
    const selectionEnd = inputEl?.selectionEnd ?? null;

    setIsPasswordVisible((prev) => !prev);

    if (inputEl && selectionStart !== null && selectionEnd !== null) {
      window.requestAnimationFrame(() => {
        try {
          inputRef.current?.setSelectionRange(selectionStart, selectionEnd);
        } catch {
          // Some input types may not support selection; ignore safely.
        }
        inputRef.current?.focus();
      });
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || /^\d+$/.test(newValue)) {
      onChange(e);
    }
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const isDigit = /^\d$/.test(e.key);
    const isCtrlKey = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
    if (!NUMERIC_ALLOWED_KEYS.has(e.key) && !isDigit && !isCtrlKey) {
      e.preventDefault();
    }
  };

  const commonInputProps = {
    id: inputId,
    name,
    ref: inputRef,
    value,
    placeholder,
    readOnly,
    required,
    autoComplete,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedByAttr,
    'aria-invalid': hasError || undefined,
    'aria-required': required,
  };

  const iconButtonProps = {
    variant: 'default' as const,
    size: 'small' as const,
    tooltipVariant: 'plain' as const,
    tooltipPosition: 'top' as const,
  };

  return (
    <div className={`input-field-wrapper ${hasError ? 'input-field-wrapper--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={`input-field__label ${hasError ? 'input-field__label--error' : ''}`.trim()}>
          {label}
          {required && <span className="input-field__required-indicator">*</span>}
        </label>
      )}

      <div
        className={`input-field-container${hasError ? ' input-field-container--error' : ''}${
          readOnly ? ' input-field-container--readonly' : ''
        }${shouldShowStepper ? ' input-field-container--stepper' : ''}`}
      >
        {shouldShowStepper ? (
          <>
            <IconButton
              {...iconButtonProps}
              icon={Minus}
              onClick={() => handleStep(-1)}
              aria-label={minusButtonLabel}
              className="input-field__stepper-button"
              state={canDecrement ? 'default' : 'disabled'}
            />
            <input
              {...commonInputProps}
              type="number"
              min={typeof min === 'number' ? min : undefined}
              max={typeof max === 'number' ? max : undefined}
              step={step}
              onChange={handleNumericChange}
              onKeyDown={handleNumericKeyDown}
              className="input-field input-field--stepper"
            />
            <IconButton
              {...iconButtonProps}
              icon={Plus}
              onClick={() => handleStep(1)}
              aria-label={plusButtonLabel}
              className="input-field__stepper-button"
              state={canIncrement ? 'default' : 'disabled'}
            />
            <div
              id={liveRegionId}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {numericValue !== null ? String(numericValue) : ''}
            </div>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="input-field__left-icon" aria-hidden="true" />}
            <input
              {...commonInputProps}
              type={effectiveType}
              min={isNumberType && typeof min === 'number' ? min : undefined}
              max={isNumberType && typeof max === 'number' ? max : undefined}
              step={isNumberType ? step : undefined}
              onChange={onChange}
              className="input-field"
            />
            {isClearVisible && (
              <IconButton
                {...iconButtonProps}
                icon={X}
                onClick={handleClear}
                aria-label={clearButtonAriaLabel}
                className="input-field__clear-button"
              />
            )}
            {isPasswordToggleVisible && (
              <IconButton
                {...iconButtonProps}
                icon={isPasswordVisible ? EyeOff : Eye}
                onClick={handleTogglePasswordVisibility}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="input-field__clear-button"
              />
            )}
          </>
        )}
      </div>

      {helperOrErrorId && (
        <span id={helperOrErrorId} className={`input-field__helper-text ${hasError ? 'input-field__helper-text--error' : ''}`.trim()}>
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
};