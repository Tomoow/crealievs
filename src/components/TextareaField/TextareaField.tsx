import React from 'react';
import { LucideIcon } from 'lucide-react';
import './TextareaField.css';

type TextareaFieldLabelProps =
  | {
      /** Visible label rendered above the textarea. */
      label: string;
      /** Only required when no visible `label` is provided. */
      'aria-label'?: never;
    }
  | {
      label?: undefined;
      'aria-label': string;
    };

export type TextareaFieldProps = TextareaFieldLabelProps & {
  required?: boolean;
  placeholder?: string;
  value: string;
  helperText?: string;
  /** Left icon displayed at the top left of the textarea */
  leftIcon?: LucideIcon;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  readOnly?: boolean;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
};

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  required = false,
  placeholder,
  value,
  helperText,
  leftIcon: LeftIcon,
  errorMessage,
  onChange,
  onFocus,
  onBlur,
  className = '',
  id,
  name,
  autoComplete,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  readOnly = false,
  rows = 4,
  cols,
  resize = 'vertical',
}) => {
  const autoId = React.useId();
  const textareaId = id ?? `textarea-field-${autoId}`;

  const hasError = Boolean(errorMessage);
  const helperOrErrorId = errorMessage || helperText ? `${textareaId}-description` : undefined;
  const ariaDescribedByAttr = [ariaDescribedBy, helperOrErrorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`textarea-field-wrapper ${hasError ? 'textarea-field-wrapper--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={textareaId} className={`textarea-field__label ${hasError ? 'textarea-field__label--error' : ''}`.trim()}>
          {label}
          {required && <span className="textarea-field__required-indicator">*</span>}
        </label>
      )}

      <div
        className={`textarea-field-container${hasError ? ' textarea-field-container--error' : ''}${
          readOnly ? ' textarea-field-container--readonly' : ''
        }`}
      >
        {LeftIcon && <LeftIcon className="textarea-field__left-icon" aria-hidden="true" />}
        <textarea
          id={textareaId}
          name={name}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          rows={rows}
          cols={cols}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`textarea-field textarea-field--resize-${resize}`}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedByAttr}
          aria-invalid={hasError || undefined}
          aria-required={required}
        />
      </div>

      {helperOrErrorId && (
        <span id={helperOrErrorId} className={`textarea-field__helper-text ${hasError ? 'textarea-field__helper-text--error' : ''}`.trim()}>
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
};
