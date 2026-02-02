import type { LucideIcon } from 'lucide-react';

export type SegmentedButtonsSize = 'default' | 'small';

export type SegmentOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

export type SegmentedButtonsProps = {
  /** Options; each is a segment instance (label, optional icon, optional disabled) */
  options: SegmentOption[];
  /** Currently selected value (single selection) */
  value: string | null;
  /** Called when selection changes */
  onChange: (value: string) => void;
  size?: SegmentedButtonsSize;
  className?: string;
  /** Accessible name for the group */
  'aria-label'?: string;
  id?: string;
};
