export type CounterProps = {
  /** Current numeric value */
  value: number;
  /** Called when value changes (decrement, increment, or direct input) */
  onChange: (value: number) => void;
  /** Minimum value. When reached, decrement button is disabled. */
  min?: number;
  /** Maximum value. When reached, increment button is disabled. */
  max?: number;
  /** Step for increment/decrement. @default 1 */
  step?: number;
  /** Disable the entire counter */
  disabled?: boolean;
  /** Optional id for the number input (for aria-describedby etc.) */
  id?: string;
  /** Accessible name when no visible label. Required for accessibility when no label. */
  'aria-label'?: string;
  /** Optional class name for the root element */
  className?: string;
};
