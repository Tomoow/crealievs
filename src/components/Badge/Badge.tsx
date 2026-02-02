import React from 'react';
import { LucideIcon, Circle, Minus, Plus, Info, CheckCircle2, AlertCircle, X, Flame } from 'lucide-react';
import './Badge.css';

export type BadgeVariant = 'default' | 'neutral' | 'pending' | 'info' | 'success' | 'warning' | 'error' | 'hot';
export type BadgeSize = 'small' | 'default' | 'large';

export interface BadgeProps {
  /**
   * The content to display inside the badge
   */
  children: React.ReactNode;
  /**
   * Visual style variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;
  /**
   * Size of the badge
   * @default 'default'
   */
  size?: BadgeSize;
  /**
   * Show an icon before the badge text
   * @default true
   */
  showIcon?: boolean;
  /**
   * Lucide icon component to display. Only used when showIcon is true.
   * If not provided and showIcon is true, defaults based on variant.
   */
  icon?: LucideIcon;
  /**
   * Additional CSS class name for custom styling.
   * Use sparingly - prefer design tokens and component props for styling.
   */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'default',
  showIcon = true,
  icon: IconComponent,
  className = '',
}) => {
  // Default icons based on variant
  const getDefaultIcon = (): LucideIcon => {
    if (IconComponent) return IconComponent;
    
    switch (variant) {
      case 'default':
        return Circle;
      case 'neutral':
        return Minus;
      case 'pending':
        return Plus;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle2;
      case 'warning':
        return AlertCircle;
      case 'error':
        return X;
      case 'hot':
        return Flame;
      default:
        return Circle;
    }
  };

  const Icon = getDefaultIcon();

  // Handle size class name to avoid conflict with variant="default"
  const sizeClass = size === 'default' ? 'badge--size-default' : `badge--${size}`;

  return (
    <span
      className={`badge badge--${variant} ${sizeClass} ${showIcon ? 'badge--with-icon' : ''} ${className}`.trim()}
      role="status"
    >
      {showIcon && <Icon className="badge__icon" />}
      {children}
    </span>
  );
};
