import type { LucideIcon } from 'lucide-react';

export type DropdownFieldLabelProps =
  | {
      label: string;
      'aria-label'?: never;
    }
  | {
      label?: undefined;
      'aria-label': string;
    };

export interface DropdownFieldOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export type DropdownFieldSingleValue = string | null;
export type DropdownFieldMultiValue = string[];

type DropdownFieldSingleProps = DropdownFieldLabelProps & {
  multiple?: false;
  value: DropdownFieldSingleValue;
  onChange: (value: DropdownFieldSingleValue) => void;
};

type DropdownFieldMultiProps = DropdownFieldLabelProps & {
  multiple: true;
  value: DropdownFieldMultiValue;
  onChange: (value: DropdownFieldMultiValue) => void;
};

export type DropdownFieldCommonProps = {
  options: DropdownFieldOption[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: LucideIcon;
  disabled?: boolean;
  readOnly?: boolean;
  showSelectAll?: boolean;
  className?: string;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
};

export type DropdownFieldProps = (DropdownFieldSingleProps | DropdownFieldMultiProps) &
  DropdownFieldCommonProps;
