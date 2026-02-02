import React, { useState, useRef, useEffect } from 'react';
import { useFloating, offset, flip, shift, size, Placement } from '@floating-ui/react-dom';
import './Tooltip.css';
import { Button } from '../Button';

export type TooltipVariant = 'plain' | 'rich';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Variant of the tooltip
   * - plain: Simple dark tooltip with text only
   * - rich: White tooltip with title, body text, and optional action
   * @default 'plain'
   */
  variant?: TooltipVariant;
  /**
   * The text content for plain tooltip, or title for rich tooltip
   */
  title: string;
  /**
   * The element that triggers the tooltip (usually a button or icon)
   */
  children: React.ReactElement;
  /**
   * Position of the tooltip relative to the trigger
   * @default 'top'
   */
  position?: TooltipPosition;
  /**
   * For rich tooltip: body text content
   */
  body?: string;
  /**
   * For rich tooltip: button label text
   */
  buttonLabel?: string;
  /**
   * For rich tooltip: action button click handler
   */
  onAction?: () => void;
  /**
   * For rich tooltip: whether to show the action button
   * @default true
   */
  showButton?: boolean;
  /**
   * Delay in ms before showing the tooltip on hover/focus (e.g. 2000 for 2 seconds).
   * @default 0
   */
  openDelay?: number;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  variant = 'plain',
  title,
  children,
  position = 'top',
  body,
  buttonLabel,
  onAction,
  showButton = true,
  openDelay = 0,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPositionRef = useRef<{ x: number; y: number } | null>(null);
  const openDelayRef = useRef(openDelay);
  openDelayRef.current = openDelay;

  // Use Floating UI for positioning
  const { x, y, strategy, refs, placement, update } = useFloating({
    placement: position as Placement,
    middleware: [
      offset(8), // 8px spacing between trigger and tooltip
      flip({
        fallbackPlacements: ['top', 'bottom', 'right', 'left'],
      }),
      shift({ 
        padding: 16, // 16px padding on all sides to ensure equal spacing from viewport edges
        crossAxis: true, // Shift along both axes
      }),
      size({
        padding: 16, // Match shift padding - ensures equal spacing on all sides
        apply({ availableWidth, availableHeight, elements }) {
          // Constrain tooltip width to available space, respecting 16px padding on both sides
          const maxWidth = variant === 'plain' ? 300 : 320;
          // availableWidth already accounts for padding, so use it directly
          elements.floating.style.maxWidth = `${Math.min(availableWidth, maxWidth)}px`;
        },
      }),
    ],
  });

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible && refs.reference.current && refs.floating.current) {
      update();
    }
  }, [isVisible, update, refs]);

  // Update position on scroll and resize to maintain proper spacing
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => {
      update();
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible, update]);

  const showTooltip = (immediate = false) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    const delay = openDelayRef.current;
    if (immediate || delay <= 0) {
      cancelShowTooltip();
      setIsVisible(true);
      return;
    }
    if (showTimeoutRef.current) return;
    showTimeoutRef.current = setTimeout(() => {
      showTimeoutRef.current = null;
      setIsVisible(true);
    }, delay);
  };

  const cancelShowTooltip = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
  };

  const hideTooltip = () => {
    cancelShowTooltip();
    setIsVisible(false);
  };

  // Handle touch events for mobile/iPad long press
  const handleTouchStart = (e: React.TouchEvent) => {
    // Store touch start position to detect movement
    touchStartPositionRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    // Start long press timer (500ms)
    longPressTimerRef.current = setTimeout(() => {
      showTooltip();
      // Prevent context menu on long press
      if (e.cancelable) {
        e.preventDefault();
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Check if finger moved significantly (more than 10px)
    if (touchStartPositionRef.current) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartPositionRef.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartPositionRef.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        // User moved finger, cancel long press
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        hideTooltip();
      }
    }
  };

  const handleTouchEnd = () => {
    // Cancel long press timer if touch ends before long press completes
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Hide tooltip after a short delay on touch end (for rich tooltips, allow interaction)
    if (variant === 'rich') {
      hideTimeoutRef.current = setTimeout(() => {
        hideTooltip();
      }, 300);
    } else {
      hideTooltip();
    }

    touchStartPositionRef.current = null;
  };

  // Handle mouse leave - for rich tooltips, add delay to allow moving to tooltip
  const handleTriggerMouseLeave = () => {
    if (variant === 'rich') {
      // Add small delay to allow mouse to move to tooltip
      hideTimeoutRef.current = setTimeout(() => {
        hideTooltip();
      }, 150);
    } else {
      hideTooltip();
    }
  };

  const handleTooltipMouseEnter = () => {
    // Cancel hide timeout when mouse enters tooltip
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    if (variant === 'rich') {
      // Add small delay to allow mouse to move back to trigger
      hideTimeoutRef.current = setTimeout(() => {
        hideTooltip();
      }, 150);
    } else {
      hideTooltip();
    }
  };

  // Set reference element (trigger) for Floating UI
  useEffect(() => {
    if (wrapperRef.current) {
      // Find the actual trigger element (button) or use wrapper
      const button = wrapperRef.current.querySelector('button') as HTMLElement;
      if (button) {
        refs.setReference(button);
      } else {
        refs.setReference(wrapperRef.current);
      }
    }
  }, [refs]);

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible && refs.reference.current && refs.floating.current) {
      update();
    }
  }, [isVisible, update, refs]);

  // Dismiss tooltip on outside click/touch (for mobile)
  useEffect(() => {
    if (!isVisible) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        refs.floating.current &&
        !refs.floating.current.contains(target) &&
        refs.reference.current &&
        !refs.reference.current.contains(target) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(target)
      ) {
        hideTooltip();
      }
    };

    // Use a small delay to avoid immediate dismissal
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, true);
      document.addEventListener('touchend', handleOutsideClick, true);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutsideClick, true);
      document.removeEventListener('touchend', handleOutsideClick, true);
    };
  }, [isVisible, refs]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);


  const triggerElement = (
    <span
      ref={wrapperRef}
      onMouseEnter={() => showTooltip(false)}
      onMouseLeave={() => {
        cancelShowTooltip();
        handleTriggerMouseLeave();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ display: 'inline-flex', position: 'relative' }}
    >
      {React.cloneElement(children, {
        onFocus: (e: React.FocusEvent) => {
          showTooltip(false); /* use delay so focus-from-hover doesn't show instantly */
          if (children.props.onFocus) {
            children.props.onFocus(e);
          }
        },
        onBlur: (e: React.FocusEvent) => {
          // Only hide on blur if not a rich tooltip (rich tooltips can be interactive)
          if (variant !== 'rich') {
            hideTooltip();
          }
          if (children.props.onBlur) {
            children.props.onBlur(e);
          }
        },
        onContextMenu: (e: React.MouseEvent) => {
          // Prevent context menu on long press (mobile)
          if (isVisible) {
            e.preventDefault();
          }
          if (children.props.onContextMenu) {
            children.props.onContextMenu(e);
          }
        },
      })}
    </span>
  );

  // Get the placement direction for CSS classes (e.g., 'top', 'bottom')
  const placementDirection = placement.split('-')[0] as TooltipPosition;

  return (
    <>
      {triggerElement}
      {isVisible && (
        <div
          ref={refs.setFloating}
          className={`tooltip tooltip--${variant} tooltip--${placementDirection} ${className}`.trim()}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          role="tooltip"
          aria-live="polite"
          onMouseEnter={variant === 'rich' ? handleTooltipMouseEnter : undefined}
          onMouseLeave={variant === 'rich' ? handleTooltipMouseLeave : undefined}
          onTouchStart={(e) => {
            // Prevent tooltip from hiding when touching it on mobile
            e.stopPropagation();
          }}
        >
          {variant === 'plain' ? (
            <span className="tooltip__content">{title}</span>
          ) : (
            <div className="tooltip__rich">
              <div className="tooltip__title">{title}</div>
              {body && <div className="tooltip__body">{body}</div>}
              {showButton && buttonLabel && (
                <div className="tooltip__action-wrapper">
                  <Button
                    variant="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAction) {
                        onAction();
                      }
                    }}
                    className="tooltip__action"
                  >
                    {buttonLabel}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
