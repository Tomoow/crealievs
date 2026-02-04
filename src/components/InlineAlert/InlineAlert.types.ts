/**
 * InlineAlert types. Figma DS Inline Alert (nodes 253-701, 266-2245, 266-2258, 266-2271, 278-6631, 278-6638, 278-6645, 278-6652).
 * Full width, left inner bar 0.625rem, optional action button; mobile stacks icon → text → button.
 */
import type { ReactNode } from 'react';

export type InlineAlertVariant = 'info' | 'error' | 'success' | 'warning';

/** Size: default (wider, rounded) or compact (narrower, pill-shaped). */
export type InlineAlertSize = 'default' | 'compact';

export type InlineAlertProps = {
  /** Visual status. Maps to Figma border/icon/text tokens per variant. */
  variant: InlineAlertVariant;
  /** Alert title (Body/Bold in Figma). */
  title: string;
  /** Optional description (Interface/Regular in Figma). */
  description?: string;
  /** Optional action (e.g. button "Los op") rendered inside the alert. On desktop: right; on mobile: below text. */
  action?: ReactNode;
  /** Size: default (radius container) or compact (pill). */
  size?: InlineAlertSize;
  /** Optional class name for the root. */
  className?: string;
};
