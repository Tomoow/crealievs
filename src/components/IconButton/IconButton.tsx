import React from 'react';
import { LucideIcon } from 'lucide-react';
import './IconButton.css';
import { Tooltip, TooltipVariant, TooltipPosition } from '../Tooltip';

export type IconButtonVariant = 'default' | 'primary' | 'secondary' | 'tertiary';
export type IconButtonSize = 'default' | 'small';
export type IconButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'focus';

export interface IconButtonProps {
  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;
  /**
   * Visual style variant of the icon button
   * @default 'default'
   */
  variant?: IconButtonVariant;
  /**
   * Size of the icon button
   * @default 'default'
   */
  size?: IconButtonSize;
  /**
   * Visual state of the icon button for demonstration purposes
   * @default 'default'
   */
  state?: IconButtonState;
  /**
   * Whether the icon button represents a destructive action
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
   * Additional CSS class name for custom styling
   */
  className?: string;
  /**
   * Accessibility label for screen readers
   */
  'aria-label': string;
  /**
   * Tooltip variant - plain for simple text, rich for title, body, and action
   * @default 'plain'
   */
  tooltipVariant?: TooltipVariant;
  /**
   * Tooltip position relative to the button
   * @default 'top'
   */
  tooltipPosition?: TooltipPosition;
  /**
   * For rich tooltip: body text content
   */
  tooltipBody?: string;
  /**
   * For rich tooltip: button label text
   */
  tooltipButtonLabel?: string;
  /**
   * For rich tooltip: action button click handler
   */
  tooltipOnAction?: () => void;
  /**
   * For rich tooltip: whether to show the action button
   * @default true
   */
  tooltipShowButton?: boolean;
  /**
   * Tab index for keyboard navigation (-1 to remove from tab order)
   */
  tabIndex?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: IconComponent,
  variant = 'default',
  size = 'default',
  state = 'default',
  destructive = false,
  type = 'button',
  onClick,
  className = '',
  'aria-label': ariaLabel,
  tooltipVariant = 'plain',
  tooltipPosition = 'top',
  tooltipBody,
  tooltipButtonLabel,
  tooltipOnAction,
  tooltipShowButton = true,
  tabIndex,
}) => {
  const isDisabled = state === 'disabled';
  const effectiveState = state;

  const stateClass = effectiveState !== 'default' ? `icon-button--state-${effectiveState}` : '';
  const variantClass = `icon-button--${variant}`;
  const sizeClass = size === 'default' ? 'icon-button--size-default' : `icon-button--${size}`;
  const destructiveClass = destructive ? 'icon-button--destructive' : '';

  const tooltipProps = tooltipVariant === 'rich' && (tooltipBody || tooltipButtonLabel)
    ? {
        title: ariaLabel,
        variant: 'rich' as TooltipVariant,
        position: tooltipPosition,
        body: tooltipBody,
        buttonLabel: tooltipButtonLabel,
        onAction: tooltipOnAction,
        showButton: tooltipShowButton,
        openDelay: 1000,
      }
    : {
        title: ariaLabel,
        variant: 'plain' as TooltipVariant,
        position: tooltipPosition,
        openDelay: 1000,
      };

  return (
    <Tooltip {...tooltipProps}>
      <button
        type={type}
        tabIndex={tabIndex}
        className={`icon-button ${variantClass} ${sizeClass} ${destructiveClass} ${stateClass} ${className}`.trim()}
        disabled={isDisabled}
        onClick={onClick}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
      >
        <span className="icon-button__inner">
          <IconComponent className="icon-button__icon" />
        </span>
      </button>
    </Tooltip>
  );
};
