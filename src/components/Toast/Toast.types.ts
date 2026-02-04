/**
 * Toast types. Figma DS Components 278:12664.
 * Error/success/warning/info with icon, message, and bottom progress bar (countdown).
 */

export type ToastVariant = 'error' | 'success' | 'warning' | 'info';

export type ToastProps = {
  /** Message text shown in the toast. */
  message: string;
  /** Visual variant (icon and colors). */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms; progress bar fills over this time. Pauses on hover. */
  durationMs?: number;
  /** Called when the toast is dismissed (auto or by consumer). */
  onDismiss: () => void;
  /** Optional class name for the root. */
  className?: string;
};
