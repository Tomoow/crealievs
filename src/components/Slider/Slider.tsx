import React, { useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { useSlider } from './useSlider';
import { Thumb } from './Thumb';
import './Slider.css';

export type SliderVariant = 'default' | 'ranged';
export type SliderState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

export interface SliderProps {
  /**
   * Variant of the slider
   * - default: Single thumb slider
   * - ranged: Two thumb slider for selecting a range
   * @default 'default'
   */
  variant?: SliderVariant;
  /**
   * Current value (for default variant) or array of [min, max] values (for ranged variant)
   * @default 0 (default) or [0, 100] (ranged)
   */
  value?: number | [number, number];
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  /**
   * Label text to display next to the slider
   * If no label is provided, ariaLabel is required for accessibility
   */
  label?: string;
  /**
   * Whether to show an icon before the label
   * @default false
   */
  showIcon?: boolean;
  /**
   * Lucide icon component to display before the label (only used when showIcon is true)
   */
  icon?: LucideIcon;
  /**
   * Accessible label for screen readers (required when label is not provided)
   */
  ariaLabel?: string;
  /**
   * Visual state of the slider
   * @default 'default'
   */
  state?: SliderState;
  /**
   * Change handler function
   * For default variant: receives the new value
   * For ranged variant: receives [min, max] array
   */
  onChange?: (value: number | [number, number]) => void;
  /**
   * Format function to display value in tooltip
   * @default (val) => String(val)
   */
  formatValue?: (value: number) => string;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
  /**
   * HTML id attribute for the slider input
   */
  id?: string;
  /**
   * HTML name attribute for the slider input
   */
  name?: string;
}

export const Slider: React.FC<SliderProps> = ({
  variant = 'default',
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  showIcon = false,
  icon: Icon,
  ariaLabel,
  state = 'default',
  onChange,
  formatValue = (val) => String(val),
  className = '',
  id,
  name,
}) => {
  // Validate accessibility: require ariaLabel when no label
  if (!label && !ariaLabel) {
    console.warn(
      'Slider: Either "label" or "ariaLabel" must be provided for accessibility. ' +
      'When no visible label is present, ariaLabel is required.'
    );
  }

  const isDisabled = state === 'disabled';
  const isRanged = variant === 'ranged';

  // Use the slider hook for all interaction logic
  const slider = useSlider({
    value,
    min,
    max,
    step,
    ranged: isRanged,
    disabled: isDisabled,
    onChange,
  });

  // Generate IDs
  const sliderId = id || `slider-${React.useId()}`;
  const minInputId = isRanged ? `${sliderId}-min` : sliderId;
  const maxInputId = isRanged ? `${sliderId}-max` : undefined;

  // Determine visual state
  const visualState: SliderState = isDisabled
    ? 'disabled'
    : slider.interaction.pressedThumb !== null
    ? 'pressed'
    : slider.interaction.focusedThumb !== null
    ? 'focus'
    : slider.interaction.hoveredThumb !== null
    ? 'hover'
    : state;

  const stateClass = visualState !== 'default' ? `slider--state-${visualState}` : '';
  const variantClass = `slider--variant-${variant}`;
  const trackStateClass =
    slider.interaction.pressedThumb !== null
      ? 'slider-track--active'
      : slider.interaction.focusedThumb !== null
      ? 'slider-track--focused'
      : '';

  // Focus the input when state prop is 'focus'
  useEffect(() => {
    if (state === 'focus' && !isDisabled) {
      slider.focusInput(0);
    }
  }, [state, isDisabled, slider]);

  // Calculate filled track position
  const filledLeft = isRanged ? slider.percentages[0] : 0;
  const filledWidth = isRanged
    ? slider.percentages[1] - slider.percentages[0]
    : slider.percentages[0];

  return (
    <div className={`slider-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={minInputId} className="slider__label">
          {showIcon && Icon && (
            <Icon className="slider__icon" aria-hidden="true" />
          )}
          {label}
        </label>
      )}

      <div className="slider-container">
        {/* Visual track */}
        <div
          ref={slider.trackRef}
          className={`slider-track ${variantClass} ${stateClass} ${trackStateClass}`.trim()}
          onPointerDown={slider.handleTrackPointerDown}
        >
          {/* Filled track segment */}
          <div
            className="slider-track__filled"
            style={{
              left: `${filledLeft}%`,
              width: `${filledWidth}%`,
            }}
          />

          {/* Render thumbs */}
          {slider.values.map((val, index) => {
            const showTooltip =
              !isDisabled &&
              (slider.interaction.pressedThumb === index ||
                slider.interaction.focusedThumb === index ||
                slider.interaction.hoveredThumb === index ||
                (!isRanged &&
                  (slider.interaction.pressedThumb !== null ||
                    slider.interaction.focusedThumb !== null)));

            return (
              <Thumb
                key={index}
                index={index}
                value={val}
                percent={slider.percentages[index]}
                disabled={isDisabled}
                formatValue={formatValue}
                isActive={slider.interaction.pressedThumb === index}
                isHovered={slider.interaction.hoveredThumb === index}
                isFocused={slider.interaction.focusedThumb === index}
                showTooltip={showTooltip}
                onPointerDown={slider.handleThumbPointerDown}
                onMouseEnter={slider.handleThumbMouseEnter}
                onMouseLeave={slider.handleThumbMouseLeave}
                onFocus={slider.handleFocus}
                onBlur={slider.handleBlur}
                onKeyDown={slider.handleKeyDown}
                inputRef={slider.registerInputRef}
                inputId={index === 0 ? minInputId : maxInputId}
                inputName={name ? (isRanged ? `${name}-${index === 0 ? 'min' : 'max'}` : name) : undefined}
                ariaLabel={
                  ariaLabel
                    ? isRanged
                      ? `${ariaLabel} ${index === 0 ? 'minimum' : 'maximum'}`
                      : ariaLabel
                    : undefined
                }
                min={min}
                max={max}
                step={step}
                variant={variant}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
