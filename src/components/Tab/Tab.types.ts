/**
 * Tab component types – Figma nodes 67:580 (underline bar), 67:581 (tab instance states).
 */

export type TabVariant = 'underline' | 'pill';

export type TabOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TabProps = {
  /** Tab options; each is a tab instance (label, optional disabled) */
  tabs: TabOption[];
  /** Currently selected tab value */
  value: string | null;
  /** Called when selection changes */
  onChange: (value: string) => void;
  /** Visual variant: underline (67:580) or pill (67:581) */
  variant?: TabVariant;
  className?: string;
  /** Accessible name for the tab list */
  'aria-label'?: string;
  id?: string;
};
