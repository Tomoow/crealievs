import React from 'react';
import { Check, Minus } from 'lucide-react';
import './Checkbox.css';

export type CheckboxState = 'default' | 'hover' | 'focus' | 'disabled';

export interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   * @default false
   */
  checked?: boolean;
  /**
   * Whether the checkbox is in an indeterminate state (partially selected)
   * When true, overrides the checked state visually
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Label text to display next to the checkbox
   * If no label is provided, ariaLabel is required for accessibility
   */
  label?: string;
  /**
   * Secondary descriptive text displayed below the primary label
   */
  description?: string;
  /**
   * Whether to show the description text
   * @default false
   */
  showDescription?: boolean;
  /**
   * Accessible label for screen readers (required when label is not provided)
   */
  ariaLabel?: string;
  /**
   * Visual state of the checkbox
   * @default 'default'
   */
  state?: CheckboxState;
  /**
   * Change handler function
   */
  onChange?: (checked: boolean) => void;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
  /**
   * HTML id attribute for the checkbox input
   */
  id?: string;
  /**
   * HTML name attribute for the checkbox input
   */
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  label,
  description,
  showDescription = false,
  ariaLabel,
  state = 'default',
  onChange,
  className = '',
  id,
  name,
}) => {
  // Validate accessibility: require ariaLabel when no label
  if (!label && !ariaLabel) {
    console.warn(
      'Checkbox: Either "label" or "ariaLabel" must be provided for accessibility. ' +
      'When no visible label is present, ariaLabel is required.'
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state !== 'disabled' && onChange) {
      onChange(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (state !== 'disabled' && onChange) {
        onChange(!checked);
      }
    }
  };

  const isDisabled = state === 'disabled';
  const stateClass = state !== 'default' ? `checkbox--state-${state}` : '';
  const checkedClass = checked ? 'checkbox--checked' : '';
  const indeterminateClass = indeterminate ? 'checkbox--indeterminate' : '';

  // Generate ID if not provided (needed for label association)
  const checkboxId = id || `checkbox-${React.useId()}`;

  // Set indeterminate property on input element
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`checkbox-wrapper ${className}`.trim()}
      htmlFor={checkboxId}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked && !indeterminate}
        disabled={isDisabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="checkbox-input"
        aria-label={ariaLabel || undefined}
      />
      <span
        className={`checkbox ${checkedClass} ${indeterminateClass} ${stateClass}`.trim()}
        aria-hidden="true"
      >
        {indeterminate ? (
          <Minus className="checkbox__icon" />
        ) : (
          checked && <Check className="checkbox__icon" />
        )}
      </span>
      {(label || (showDescription && description)) && (
        <span className="checkbox__content">
          {label && (
            <span className="checkbox__label">{label}</span>
          )}
          {showDescription && description && (
            <span className="checkbox__description">{description}</span>
          )}
        </span>
      )}
    </label>
  );
};
