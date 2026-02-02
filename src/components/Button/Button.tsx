import React from 'react';
import { LucideIcon } from 'lucide-react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'simple' | 'ghost';
export type ButtonSize = 'default' | 'small';
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'focus';

export interface ButtonProps {
  /**
   * The content to display inside the button
   */
  children: React.ReactNode;
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Size of the button
   * @default 'default'
   */
  size?: ButtonSize;
  /**
   * Visual state of the button for demonstration purposes
   * @default 'default'
   */
  state?: ButtonState;
  /**
   * Whether the button represents a destructive action
   * @default false
   */
  destructive?: boolean;
  /**
   * Show an icon before the button text
   * @default false
   */
  showLeftIcon?: boolean;
  /**
   * Lucide icon component to display on the left. Only used when showLeftIcon is true.
   */
  iconLeft?: LucideIcon;
  /**
   * Show an icon after the button text
   * @default false
   */
  showRightIcon?: boolean;
  /**
   * Lucide icon component to display on the right. Only used when showRightIcon is true.
   */
  iconRight?: LucideIcon;
  /**
   * Button type attribute. This is a standard HTML button attribute that determines the button's behavior in forms.
   * - 'button': Default, does nothing by itself (most common)
   * - 'submit': Submits the form when clicked (used in forms)
   * - 'reset': Resets the form when clicked (used in forms)
   * This is a best practice to include for proper form handling and accessibility.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Click handler function. This is a standard React prop for handling button clicks.
   * It's a best practice to include onClick for interactive buttons to allow parent components
   * to respond to user interactions. If not provided, the button will still render but won't
   * trigger any actions when clicked.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Additional CSS class name for custom styling.
   * Use sparingly - prefer design tokens and component props for styling.
   */
  className?: string;
  /**
   * Accessible name when visible text is not sufficient.
   */
  'aria-label'?: string;
  /**
   * For expandable controls (e.g. calendar month/year picker).
   */
  'aria-expanded'?: boolean;
  /**
   * For controls that open a listbox (e.g. "Select month", "Select year").
   */
  'aria-haspopup'?: 'listbox' | 'menu' | 'dialog' | 'tree' | 'grid' | boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  state = 'default',
  destructive = false,
  showLeftIcon = false,
  iconLeft,
  showRightIcon = false,
  iconRight,
  type = 'button',
  onClick,
  className = '',
  'aria-label': ariaLabel,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
}) => {
  const isDisabled = state === 'disabled';
  const effectiveState = state;

  const stateClass = effectiveState !== 'default' ? `button--state-${effectiveState}` : '';
  const variantClass = `button--${variant}`;
  const sizeClass = size === 'default' ? 'button--size-default' : `button--${size}`;
  const destructiveClass = destructive ? 'button--destructive' : '';

  const LeftIcon = showLeftIcon && iconLeft ? iconLeft : null;
  const RightIcon = showRightIcon && iconRight ? iconRight : null;

  return (
    <button
      type={type}
      className={`button ${variantClass} ${sizeClass} ${destructiveClass} ${stateClass} ${className}`.trim()}
      disabled={isDisabled}
      onClick={onClick}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      {LeftIcon && (
        <LeftIcon className="button__icon button__icon--left" />
      )}
      <span className="button__text">{children}</span>
      {RightIcon && (
        <RightIcon className="button__icon button__icon--right" />
      )}
    </button>
  );
};
