import React from 'react';
import { LucideIcon } from 'lucide-react';
import './FAB.css';

export type FABVariant = 'default' | 'primary' | 'secondary' | 'tertiary';
export type FABState = 'default' | 'hover' | 'active' | 'disabled' | 'focus';

export interface FABProps {
  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;
  /**
   * Visual style variant of the FAB
   * @default 'primary'
   */
  variant?: FABVariant;
  /**
   * Visual state of the FAB for demonstration purposes
   * @default 'default'
   */
  state?: FABState;
  /**
   * Whether the FAB represents a destructive action
   * @default false
   */
  destructive?: boolean;
  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Click handler function
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Additional CSS class name for custom styling and animations
   * Use this to add custom expanding animations, transitions, etc.
   */
  className?: string;
  /**
   * Inline styles for custom animations and positioning
   * Use this for dynamic animations, transforms, etc.
   */
  style?: React.CSSProperties;
  /**
   * Accessibility label for screen readers
   */
  'aria-label': string;
  /**
   * When the FAB opens a menu, set to "menu"
   */
  'aria-haspopup'?: 'menu' | 'dialog' | 'listbox' | 'tree' | 'grid' | boolean;
  /**
   * When the FAB opens a menu, set to true when open and false when closed
   */
  'aria-expanded'?: boolean;
  /**
   * Position for sticky/fixed positioning
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'none';
  /**
   * Offset from the edge when using position
   * @default { x: '1rem', y: '1rem' }
   */
  offset?: {
    x?: string;
    y?: string;
  };
}

export const FAB: React.FC<FABProps> = ({
  icon: IconComponent,
  variant = 'primary',
  state = 'default',
  destructive = false,
  type = 'button',
  onClick,
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHaspopup,
  'aria-expanded': ariaExpanded,
  position = 'bottom-right',
  offset = { x: '1rem', y: '1rem' },
}) => {
  const isDisabled = state === 'disabled';
  const effectiveState = state;

  const stateClass = effectiveState !== 'default' ? `fab--state-${effectiveState}` : '';
  const variantClass = `fab--${variant}`;
  const destructiveClass = destructive ? 'fab--destructive' : '';
  const positionClass = position !== 'none' ? `fab--position-${position}` : '';

  // Build inline styles for positioning
  const positionStyles: React.CSSProperties = {
    ...style,
  };

  if (position !== 'none') {
    if (position.includes('bottom')) {
      positionStyles.bottom = offset.y || '1rem';
    }
    if (position.includes('top')) {
      positionStyles.top = offset.y || '1rem';
    }
    if (position.includes('right')) {
      positionStyles.right = offset.x || '1rem';
    }
    if (position.includes('left')) {
      positionStyles.left = offset.x || '1rem';
    }
  }

  return (
    <button
      type={type}
      className={`fab ${variantClass} ${destructiveClass} ${stateClass} ${positionClass} ${className}`.trim()}
      disabled={isDisabled}
      onClick={onClick}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      style={positionStyles}
    >
      <IconComponent className="fab__icon" />
    </button>
  );
};
