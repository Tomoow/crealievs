import React from 'react';

interface ThumbProps {
  index: number;
  value: number;
  percent: number;
  disabled: boolean;
  formatValue: (value: number) => string;
  isActive: boolean;
  isHovered: boolean;
  isFocused: boolean;
  showTooltip: boolean;
  onPointerDown: (e: React.PointerEvent, index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  inputRef: (index: number, ref: HTMLInputElement | null) => void;
  inputId?: string;
  inputName?: string;
  ariaLabel?: string;
  min: number;
  max: number;
  step: number;
  variant: 'default' | 'ranged';
}

export const Thumb: React.FC<ThumbProps> = ({
  index,
  value,
  percent,
  disabled,
  formatValue,
  isActive,
  isHovered,
  isFocused,
  showTooltip,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  inputRef,
  inputId,
  inputName,
  ariaLabel,
  min,
  max,
  step,
  variant,
}) => {
  const thumbRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="slider-thumb-wrapper"
      style={{ left: `${percent}%` }}
    >
      {/* Hidden input for accessibility */}
      <input
        ref={(el) => inputRef(index, el)}
        type="range"
        id={inputId}
        name={inputName}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={() => {}} // Controlled by pointer events
        className="slider-input"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onFocus={() => onFocus(index)}
        onBlur={onBlur}
        onKeyDown={(e) => onKeyDown(e, index)}
        tabIndex={disabled ? -1 : 0}
      />

      {/* Thumb with hit area via ::before */}
      <div
        ref={thumbRef}
        className={`slider-thumb ${
          variant === 'ranged' ? (index === 0 ? 'slider-thumb--min' : 'slider-thumb--max') : ''
        } ${isActive ? 'slider-thumb--active' : ''} ${
          isHovered ? 'slider-thumb--hovered' : ''
        } ${isFocused ? 'slider-thumb--focused' : ''}`.trim()}
        onPointerDown={(e) => onPointerDown(e, index)}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={onMouseLeave}
      >
        {/* Tooltip */}
        <div className={`slider-tooltip slider-tooltip--plain ${showTooltip ? 'slider-tooltip--visible' : ''}`.trim()}>
          <span className="slider-tooltip__content">{formatValue(value)}</span>
        </div>
      </div>
    </div>
  );
};
