/**
 * Accordion component types – Figma 3:53.
 * Collapsible items with trigger (title + chevron) and panel (content).
 */
import type React from 'react';

export type AccordionItem = {
  /** Unique id for the item (used for expanded state). */
  id: string;
  /** Trigger label (question). */
  title: string;
  /** Panel content (answer). */
  content: React.ReactNode;
};

export type AccordionProps = {
  /** List of accordion items. */
  items: AccordionItem[];
  /** When allowMultiple is false, at most one item is open; when true, multiple can be open. @default false */
  allowMultiple?: boolean;
  /** Initial expanded item ids (uncontrolled). Ignored when expandedIds is set. */
  defaultExpandedIds?: string[];
  /** Controlled expanded item ids. When set, onExpandedChange must be provided. */
  expandedIds?: string[];
  /** Called when expanded set changes (controlled). */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Additional class name. */
  className?: string;
  /** Accessible name for the accordion. */
  'aria-label'?: string;
};
