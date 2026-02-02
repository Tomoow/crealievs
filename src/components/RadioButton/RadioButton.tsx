import React from 'react';
import './RadioButton.css';
import { useRadioGroup } from './RadioGroup';

export type RadioButtonState = 'default' | 'hover' | 'focus' | 'disabled';

export interface RadioOptionProps {
  /**
   * The value of this radio option. Must be unique within the group.
   */
  value: string;
  /**
   * Primary label text to display next to the radio button
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
   * Visual state of the radio button for demonstration purposes
   * @default 'default'
   */
  state?: RadioButtonState;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
  /**
   * HTML id attribute for the radio button input
   */
  id?: string;
}

/**
 * RadioOption is a single radio button option that must be used within a RadioGroup.
 * It gets its state (checked/unchecked) from the RadioGroup context.
 */
export const RadioOption: React.FC<RadioOptionProps> = ({
  value,
  label,
  description,
  showDescription = false,
  ariaLabel,
  state = 'default',
  className = '',
  id,
}) => {
  const { value: selectedValue, onChange, name } = useRadioGroup();
  const checked = selectedValue === value;

  // Validate accessibility: require ariaLabel when no label
  if (!label && !ariaLabel) {
    console.warn(
      'RadioOption: Either "label" or "ariaLabel" must be provided for accessibility. ' +
      'When no visible label is present, ariaLabel is required.'
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state !== 'disabled') {
      onChange(e.target.value);
    }
  };

  const isDisabled = state === 'disabled';
  const stateClass = state !== 'default' ? `radio-button--state-${state}` : '';
  const checkedClass = checked ? 'radio-button--checked' : '';

  // Generate ID if not provided (needed for label association)
  const radioButtonId = id || `radio-${name}-${value}-${React.useId()}`;

  return (
    <label
      className={`radio-button-wrapper ${className}`.trim()}
      htmlFor={radioButtonId}
    >
      <input
        type="radio"
        id={radioButtonId}
        name={name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
        className="radio-button-input"
        aria-label={ariaLabel || undefined}
      />
      <span
        className={`radio-button ${checkedClass} ${stateClass}`.trim()}
        aria-hidden="true"
      >
        {checked && <span className="radio-button__dot" />}
      </span>
      {(label || (showDescription && description)) && (
        <span className="radio-button__content">
          {label && (
            <span className="radio-button__label">{label}</span>
          )}
          {showDescription && description && (
            <span className="radio-button__description">{description}</span>
          )}
        </span>
      )}
    </label>
  );
};

// Keep RadioButton as an alias for RadioOption for backward compatibility
export const RadioButton = RadioOption;
