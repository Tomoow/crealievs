/**
 * Header types. Figma DS Header (350-13751).
 * Single header: logo | nav (icon + label; mobile = icon-only via breakpoint) | account (tertiary IconButton + optional text).
 */
import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export type HeaderNavItem = {
  id: string;
  /** Lucide icon for the nav item. */
  icon: LucideIcon;
  /** Label shown next to icon (hidden on mobile via breakpoint). */
  label?: string;
  /** Whether this item is the current/active route. */
  active?: boolean;
  /** Click handler. */
  onClick?: () => void;
};

export type HeaderAccount = {
  /** Click handler for the account (person) IconButton. */
  onClick?: () => void;
  /** aria-label for the IconButton. @default 'Account' */
  ariaLabel?: string;
  /** Optional primary text next to the button (e.g. "Account"). */
  title?: string;
  /** Optional secondary text (e.g. "Staff"). */
  subtitle?: string;
};

export type HeaderProps = {
  /** Left side: logo (image or custom ReactNode). */
  logo: React.ReactNode;
  /** Center: nav items. Labels hidden on mobile via CSS breakpoint. */
  navItems: HeaderNavItem[];
  /** Right side: tertiary IconButton (person) + optional title/subtitle. */
  account?: HeaderAccount;
  /** Optional class name for the header root. */
  className?: string;
};
