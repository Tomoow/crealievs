import React from 'react';
import { LucideIcon, Calendar, Check } from 'lucide-react';
import './Tag.css';

export type TagState = 'default' | 'hover' | 'pressed' | 'focus';

export interface TagProps {
  /**
   * The content to display inside the tag
   */
  children: React.ReactNode;
  /**
   * Whether the tag is in selected state
   * @default false
   */
  selected?: boolean;
  /**
   * Show an icon before the tag text (always on the left).
   * When selected is true, this is always true and the Check icon is always shown.
   * @default false
   */
  showIcon?: boolean;
  /**
   * Lucide icon component to display. Only used when showIcon is true and selected is false.
   * If not provided and showIcon is true, defaults to Calendar.
   * When selected is true, this is ignored and Check icon is always used.
   * @default Calendar
   */
  icon?: LucideIcon;
  /**
   * Visual state of the tag for demonstration purposes
   * @default 'default'
   */
  state?: TagState;
  /**
   * Click handler function
   */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  /**
   * Additional CSS class name for custom styling.
   * Use sparingly - prefer design tokens and component props for styling.
   */
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  selected = false,
  showIcon = false,
  icon: IconComponent,
  state = 'default',
  onClick,
  className = '',
}) => {
  // Determine which icon to use
  // When selected, always use Check icon and always show on left (replacing original icon)
  // When unselected, show the provided icon if showIcon is true, or if an icon was provided
  let Icon: LucideIcon | null = null;
  
  if (selected) {
    // Selected state always shows Check icon on the left, replacing original icon
    Icon = Check;
  } else if (showIcon || IconComponent) {
    // For default state, use provided icon or default Calendar
    // Show icon if showIcon is true OR if an icon was explicitly provided
    if (IconComponent) {
      Icon = IconComponent;
    } else {
      Icon = Calendar;
    }
  }

  const variantClass = selected ? 'tag--selected' : 'tag--default';
  const stateClass = state !== 'default' ? `tag--state-${state}` : '';

  return (
    <span
      className={`tag ${variantClass} ${stateClass} ${className}`.trim()}
      role="status"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {Icon && (
        <Icon className="tag__icon" />
      )}
      <span className="tag__text">{children}</span>
    </span>
  );
};
