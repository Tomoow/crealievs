import React from 'react';
import './SlideToggle.css';

export type SlideToggleState = 'default' | 'hover' | 'focus' | 'disabled';

export interface SlideToggleProps {
  /**
   * Whether the toggle is checked (on)
   * @default false
   */
  checked?: boolean;
  /**
   * Label text to display next to the toggle
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
   * Visual state of the toggle
   * @default 'default'
   */
  state?: SlideToggleState;
  /**
   * Change handler function
   */
  onChange?: (checked: boolean) => void;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
  /**
   * HTML id attribute for the toggle input
   */
  id?: string;
  /**
   * HTML name attribute for the toggle input
   */
  name?: string;
}

export const SlideToggle: React.FC<SlideToggleProps> = ({
  checked = false,
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
      'SlideToggle: Either "label" or "ariaLabel" must be provided for accessibility. ' +
      'When no visible label is present, ariaLabel is required.'
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state !== 'disabled' && onChange) {
      onChange(e.target.checked);
    }
  };

  const isDisabled = state === 'disabled';
  const stateClass = state !== 'default' ? `slide-toggle--state-${state}` : '';
  const checkedClass = checked ? 'slide-toggle--checked' : '';

  // Generate ID if not provided (needed for label association)
  const toggleId = id || `slide-toggle-${React.useId()}`;

  return (
    <label
      className={`slide-toggle-wrapper ${className}`.trim()}
      htmlFor={toggleId}
    >
      <input
        type="checkbox"
        id={toggleId}
        name={name}
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
        className="slide-toggle-input"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || undefined}
      />
      <span
        className={`slide-toggle ${checkedClass} ${stateClass}`.trim()}
        aria-hidden="true"
      >
        <span className="slide-toggle__knob" />
      </span>
      {(label || (showDescription && description)) && (
        <span className="slide-toggle__content">
          {label && (
            <span className="slide-toggle__label">{label}</span>
          )}
          {showDescription && description && (
            <span className="slide-toggle__description">{description}</span>
          )}
        </span>
      )}
    </label>
  );
};
