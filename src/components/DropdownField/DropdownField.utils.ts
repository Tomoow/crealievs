import type { DropdownFieldOption } from './DropdownField.types';
import type { DropdownFieldSingleValue, DropdownFieldMultiValue } from './DropdownField.types';

export function getSelectedValues(
  isMultiple: boolean,
  value: DropdownFieldSingleValue | DropdownFieldMultiValue
): string[] {
  if (isMultiple) return value as DropdownFieldMultiValue;
  return value ? [value as string] : [];
}

export function getSelectedLabels(
  options: DropdownFieldOption[],
  selectedValues: string[]
): string[] {
  return selectedValues
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean) as string[];
}
