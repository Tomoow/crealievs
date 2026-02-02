/**
 * Card component types – Figma 419:17380.
 * Icon with bg fill top left, title + subtitle, optional 3-dot actions top right, subtext, optional footer buttons.
 */
import type React from 'react';

export type CardProps = {
  /** Icon shown in top-left circle with primary subtle background. */
  icon?: React.ReactNode;
  /** Title (bold) next to the icon. */
  title: string;
  /** Subtitle (smaller, subtle) below the title. */
  subtitle?: string;
  /** When set, renders a default 3-dot IconButton (MoreVertical) top right; onClick is called when it is clicked. */
  onActionsClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Body text (subtext) below the header. */
  subtext?: string;
  /** Optional footer content (e.g. two buttons: secondary left, primary right). */
  footer?: React.ReactNode;
  /** Additional class name. */
  className?: string;
};
