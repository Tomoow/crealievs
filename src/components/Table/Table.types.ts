/**
 * Table component types – Figma 278:1380, 278:2055, 278:1624.
 * Columns use CSS Grid fractional units (e.g. "1fr", "2fr", "minmax(100px, 1fr)").
 */
import type React from 'react';

export type TableColumn<T = Record<string, unknown>> = {
  /** Unique key; used to read row[key] */
  key: keyof T | string;
  /** Header cell content */
  header: string;
  /** CSS Grid column value (e.g. "1fr", "2fr", "minmax(80px, 1fr)", "auto"). Default "1fr". */
  width?: string;
};

export type TableRow<T = Record<string, unknown>> = {
  /** Unique row id (for selection and keys) */
  id: string;
} & Record<string, React.ReactNode>;

export type TableProps<T = Record<string, unknown>> = {
  /** Column definitions: key, header, optional width (grid value) */
  columns: TableColumn<T>[];
  /** Data rows; each row has id plus cell values keyed by column key */
  rows: TableRow<T>[];
  /** Whether to show header row */
  header?: boolean;
  /** When true, table body scrolls horizontally and first column stays sticky */
  stickyFirstColumn?: boolean;
  /** Selected row ids (controlled). When set, checkboxes show selection. */
  selectedRowIds?: string[];
  /** Called when selection changes (only when selectedRowIds is used) */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Render actions for each row (e.g. Delete, Edit). Shown in trailing column on desktop. */
  renderRowActions?: (row: TableRow<T>) => React.ReactNode;
  /** On mobile list view: small icon buttons shown above the row. If not set, renderRowActions is used. */
  renderRowActionsMobile?: (row: TableRow<T>) => React.ReactNode;
  /** Show List/Card view switcher on mobile; card view renders rows as cards */
  mobileViewSwitcher?: boolean;
  /** Card view: content grid 1 column (stacked) or 2 columns (side-by-side when space allows). Default 1. */
  cardContentColumns?: 1 | 2;
  /** Card view: optional actions for the FAB menu (e.g. "Verwijder alles" with your own confirmation modal). Built-in "Selecteer alles" / "Deselecteer alles" are added when selection is enabled. */
  cardActions?: Array<{ label: string; onClick: () => void }>;
  className?: string;
  /** Accessible name for the table */
  'aria-label'?: string;
};
