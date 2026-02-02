import { useState, useRef, useEffect, useCallback } from 'react';
import {
  valueToPercent,
  getValueFromPosition,
  findClosestThumb,
  clampToStep,
} from './sliderUtils';

interface UseSliderOptions {
  value?: number | [number, number];
  min: number;
  max: number;
  step: number;
  ranged: boolean;
  disabled: boolean;
  onChange?: (value: number | [number, number]) => void;
}

interface InteractionState {
  pressedThumb: number | null;
  hoveredThumb: number | null;
  focusedThumb: number | null;
}

export function useSlider({
  value: controlledValue,
  min,
  max,
  step,
  ranged,
  disabled,
  onChange,
}: UseSliderOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    controlledValue !== undefined
      ? controlledValue
      : ranged
      ? [min, max]
      : min
  );

  // Sync with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Normalize values to array format for unified handling
  const values: number[] = ranged
    ? (currentValue as [number, number])
    : [currentValue as number];

  // Calculate percentages for each thumb
  const percentages = values.map((val) => valueToPercent(val, min, max));

  // Interaction state
  const [interaction, setInteraction] = useState<InteractionState>({
    pressedThumb: null,
    hoveredThumb: null,
    focusedThumb: null,
  });

  // Update values helper
  const updateValues = useCallback(
    (newValues: number[]) => {
      const roundedValues = newValues.map((v) => Math.round(v));
      const finalValue = ranged ? ([roundedValues[0], roundedValues[1]] as [number, number]) : roundedValues[0];
      setInternalValue(finalValue);
      onChange?.(finalValue);
    },
    [ranged, onChange]
  );

  // Handle pointer down on thumb
  const handleThumbPointerDown = useCallback(
    (e: React.PointerEvent, thumbIndex: number) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      setInteraction((prev) => ({
        ...prev,
        pressedThumb: thumbIndex,
        hoveredThumb: null, // Clear hover when starting drag
      }));

      // Update immediately
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const newValue = getValueFromPosition(e.clientX, trackRect, min, max, step);

      if (ranged) {
        const [minVal, maxVal] = values;
        const newValues = [...values];

        if (thumbIndex === 0) {
          newValues[0] = Math.min(newValue, maxVal);
        } else {
          newValues[1] = Math.max(newValue, minVal);
        }

        updateValues(newValues);
      } else {
        updateValues([newValue]);
      }
    },
    [disabled, ranged, values, min, max, step, updateValues]
  );

  // Handle pointer down on track
  const handleTrackPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || interaction.pressedThumb !== null) return;

      // Don't handle if clicking directly on a thumb or thumb wrapper
      const target = e.target as HTMLElement;
      if (
        target.classList.contains('slider-thumb') ||
        target.closest('.slider-thumb') ||
        target.classList.contains('slider-thumb-wrapper') ||
        target.closest('.slider-thumb-wrapper')
      ) {
        return;
      }

      // Only handle clicks on the track itself
      if (!target.classList.contains('slider-track') && !target.classList.contains('slider-track__filled')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (!trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const clickedValue = getValueFromPosition(e.clientX, trackRect, min, max, step);

      if (ranged) {
        // Find closest thumb
        const closestIndex = findClosestThumb(clickedValue, values);
        const [minVal, maxVal] = values;
        const newValues = [...values];

        if (closestIndex === 0) {
          newValues[0] = Math.min(clickedValue, maxVal);
        } else {
          newValues[1] = Math.max(clickedValue, minVal);
        }

        updateValues(newValues);

        // Track if pointer moves (indicating a drag vs just a click)
        let hasMoved = false;
        const moveThreshold = 5; // pixels
        let startX = e.clientX;

        const handlePointerMoveTrack = (moveEvent: PointerEvent) => {
          const moveDistance = Math.abs(moveEvent.clientX - startX);
          if (!hasMoved && moveDistance > moveThreshold) {
            hasMoved = true;
            setInteraction((prev) => ({
              ...prev,
              pressedThumb: closestIndex,
            }));
          }
          if (hasMoved) {
            const newValue = getValueFromPosition(moveEvent.clientX, trackRect, min, max, step);
            const [currentMin, currentMax] = values;
            const updatedValues = [...values];
            if (closestIndex === 0) {
              updatedValues[0] = Math.min(newValue, currentMax);
            } else {
              updatedValues[1] = Math.max(newValue, currentMin);
            }
            updateValues(updatedValues);
          }
        };

        const handlePointerUpTrack = () => {
          if (hasMoved) {
            setInteraction((prev) => ({
              ...prev,
              pressedThumb: null,
            }));
          }
          window.removeEventListener('pointermove', handlePointerMoveTrack);
          window.removeEventListener('pointerup', handlePointerUpTrack);
        };

        window.addEventListener('pointermove', handlePointerMoveTrack);
        window.addEventListener('pointerup', handlePointerUpTrack);
      } else {
        updateValues([clickedValue]);

        // Track if pointer moves
        let hasMoved = false;
        const moveThreshold = 5;
        let startX = e.clientX;

        const handlePointerMoveTrack = (moveEvent: PointerEvent) => {
          const moveDistance = Math.abs(moveEvent.clientX - startX);
          if (!hasMoved && moveDistance > moveThreshold) {
            hasMoved = true;
            setInteraction((prev) => ({
              ...prev,
              pressedThumb: 0,
            }));
          }
          if (hasMoved) {
            const trackRect = trackRef.current!.getBoundingClientRect();
            const newValue = getValueFromPosition(moveEvent.clientX, trackRect, min, max, step);
            updateValues([newValue]);
          }
        };

        const handlePointerUpTrack = () => {
          if (hasMoved) {
            setInteraction((prev) => ({
              ...prev,
              pressedThumb: null,
            }));
          }
          window.removeEventListener('pointermove', handlePointerMoveTrack);
          window.removeEventListener('pointerup', handlePointerUpTrack);
        };

        window.addEventListener('pointermove', handlePointerMoveTrack);
        window.addEventListener('pointerup', handlePointerUpTrack);
      }
    },
    [disabled, ranged, values, min, max, step, interaction.pressedThumb, updateValues]
  );

  // Handle pointer move/up globally
  useEffect(() => {
    if (interaction.pressedThumb === null) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const newValue = getValueFromPosition(e.clientX, trackRect, min, max, step);

      // Use a ref callback to get current values
      setInternalValue((current) => {
        const currentValues = Array.isArray(current) ? current : [current];
        const newValues = [...currentValues];

        if (ranged) {
          const [minVal, maxVal] = currentValues as [number, number];
          if (interaction.pressedThumb === 0) {
            newValues[0] = Math.min(newValue, maxVal);
          } else {
            newValues[1] = Math.max(newValue, minVal);
          }
        } else {
          newValues[0] = newValue;
        }

        const roundedValues = newValues.map((v) => Math.round(v));
        const finalValue = ranged ? ([roundedValues[0], roundedValues[1]] as [number, number]) : roundedValues[0];
        onChange?.(finalValue);
        return finalValue;
      });
    };

    const handleGlobalPointerUp = () => {
      setInteraction((prev) => ({
        ...prev,
        pressedThumb: null,
      }));
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [interaction.pressedThumb, ranged, min, max, step, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, thumbIndex: number) => {
      if (disabled) return;

      const currentVal = values[thumbIndex];
      const stepAmount = e.shiftKey ? step * 10 : step;
      let newValue = currentVal;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newValue = clampToStep(currentVal + stepAmount, min, max, step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newValue = clampToStep(currentVal - stepAmount, min, max, step);
          break;
        case 'Home':
          e.preventDefault();
          newValue = min;
          break;
        case 'End':
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      if (ranged) {
        const newValues = [...values];
        newValues[thumbIndex] = newValue;

        // Ensure min <= max
        if (thumbIndex === 0) {
          newValues[0] = Math.min(newValue, newValues[1]);
        } else {
          newValues[1] = Math.max(newValue, newValues[0]);
        }

        updateValues(newValues);
      } else {
        updateValues([newValue]);
      }
    },
    [disabled, ranged, values, min, max, step, updateValues]
  );

  // Handle focus
  const handleFocus = useCallback((thumbIndex: number) => {
    setInteraction((prev) => ({
      ...prev,
      focusedThumb: thumbIndex,
    }));
  }, []);

  const handleBlur = useCallback(() => {
    setInteraction((prev) => ({
      ...prev,
      focusedThumb: null,
    }));
  }, []);

  // Handle hover
  const handleThumbMouseEnter = useCallback(
    (thumbIndex: number) => {
      if (disabled || interaction.pressedThumb !== null) return;
      setInteraction((prev) => ({
        ...prev,
        hoveredThumb: thumbIndex,
      }));
    },
    [disabled, interaction.pressedThumb]
  );

  const handleThumbMouseLeave = useCallback(() => {
    setInteraction((prev) => ({
      ...prev,
      hoveredThumb: null,
    }));
  }, []);

  // Register input ref
  const registerInputRef = useCallback((index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  }, []);

  // Focus input when state prop is 'focus'
  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  return {
    trackRef,
    values,
    percentages,
    interaction,
    handleThumbPointerDown,
    handleTrackPointerDown,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handleThumbMouseEnter,
    handleThumbMouseLeave,
    registerInputRef,
    focusInput,
  };
}
