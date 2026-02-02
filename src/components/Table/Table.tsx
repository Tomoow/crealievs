/**
 * Table – MUI-style semantic <table> with thead/tbody.
 * Uses only your subcomponents (Checkbox, Button, IconButton, SegmentedButtons) and design tokens.
 * Column widths: min-width in px to avoid overlap; sticky + overflow shadow when enabled.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { TableProps, TableColumn, TableRow } from './Table.types';
import { Checkbox } from '../Checkbox';
import { FAB } from '../FAB';
import { DropdownFieldSheet } from '../DropdownField';
import { SegmentedButtons } from '../SegmentedButtons';
import type { SegmentOption } from '../SegmentedButtons';
import { List, LayoutGrid, MoreVertical } from 'lucide-react';
import '../DropdownField/DropdownField.css';
import './Table.css';

export type { TableProps, TableColumn, TableRow } from './Table.types';

/** Return min-width in px so columns never collapse (no %). 1fr -> 100px, 2fr -> 200px, minmax(80px,1fr) -> 80px. */
function colMinWidth(width: string | undefined): string {
  if (!width || width === 'auto') return '80px';
  const pxMatch = /^(\d+)px$/.exec(width) ?? /^minmax\((\d+)px/.exec(width);
  if (pxMatch) return `${pxMatch[1]}px`;
  const frMatch = /(\d+(?:\.\d+)?)\s*fr/.exec(width);
  if (frMatch) {
    const fr = parseFloat(frMatch[1]);
    return `${Math.round(fr * 100)}px`;
  }
  return '80px';
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  header = true,
  stickyFirstColumn = false,
  selectedRowIds = [],
  onSelectionChange,
  renderRowActions,
  renderRowActionsMobile,
  mobileViewSwitcher = true,
  cardContentColumns = 1,
  cardActions,
  className = '',
  'aria-label': ariaLabel,
}: TableProps<T>) {
  const [mobileView, setMobileView] = useState<'list' | 'card'>('list');
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
  const [cardSheetVisible, setCardSheetVisible] = useState(false);
  const cardFabWrapperRef = useRef<HTMLDivElement>(null);
  const cardSheetMenuRef = useRef<HTMLDivElement>(null);

  const hasSelection = onSelectionChange != null;
  const hasRowActions = renderRowActions != null || renderRowActionsMobile != null;
  const stickyWithSelection = stickyFirstColumn && hasSelection;
  const stickyFirstOnly = stickyFirstColumn && !hasSelection;

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) onSelectionChange([...selectedRowIds, rowId]);
    else onSelectionChange(selectedRowIds.filter((id) => id !== rowId));
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? rows.map((r) => r.id) : []);
  };

  const allSelected = rows.length > 0 && selectedRowIds.length === rows.length;
  const someSelected = selectedRowIds.length > 0;

  const viewOptions: SegmentOption[] = [
    { value: 'list', label: 'List', icon: List },
    { value: 'card', label: 'Card', icon: LayoutGrid },
  ];

  const isCardView = mobileViewSwitcher && mobileView === 'card';
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const canScrollH = el.scrollWidth > el.clientWidth;
    if (!canScrollH) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  }, []);

  const hasCardFab =
    isCardView && (hasSelection || (cardActions != null && cardActions.length > 0));

  const closeCardMenu = useCallback(() => setCardMenuOpen(false), []);

  useEffect(() => {
    if (!cardMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCardMenu();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [cardMenuOpen, closeCardMenu]);

  useEffect(() => {
    if (cardMenuOpen) {
      setCardSheetVisible(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setCardSheetVisible(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setCardSheetVisible(false);
  }, [cardMenuOpen]);

  useEffect(() => {
    if (!cardSheetVisible || !cardSheetMenuRef.current) return;
    const firstItem = cardSheetMenuRef.current.querySelector<HTMLButtonElement>(
      'button[role="menuitem"]'
    );
    firstItem?.focus({ preventScroll: true });
  }, [cardSheetVisible]);

  const prevCardMenuOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = prevCardMenuOpenRef.current;
    prevCardMenuOpenRef.current = cardMenuOpen;
    if (wasOpen && !cardMenuOpen && cardFabWrapperRef.current) {
      const fabButton = cardFabWrapperRef.current.querySelector<HTMLButtonElement>('button');
      fabButton?.focus({ preventScroll: true });
    }
  }, [cardMenuOpen]);

  const handleCardMenuAction = useCallback(
    (fn: () => void) => {
      fn();
      closeCardMenu();
    },
    [closeCardMenu]
  );

  const handleCardSheetKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const menu = cardSheetMenuRef.current;
      if (!menu) return;
      const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]'));
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[next]?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prev]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    },
    []
  );

  return (
    <div
      className={`table-root ${isCardView ? 'table-root--card-view' : ''} ${className}`.trim()}
      data-mobile-view={mobileView}
    >
      {mobileViewSwitcher && (
        <div className="table-root__view-switcher" aria-label="View type">
          <SegmentedButtons
            options={viewOptions}
            value={mobileView}
            onChange={(v) => setMobileView(v as 'list' | 'card')}
            aria-label="View"
          />
        </div>
      )}

      <div
        ref={scrollRef}
        className="table-root__scroll"
        role="region"
        aria-label={ariaLabel}
        style={{ overflowX: 'auto' }}
        onWheel={handleWheel}
      >
        <table
          className={`table-root__table ${stickyFirstColumn ? 'table-root__table--sticky' : ''}`}
          aria-label={ariaLabel}
          style={
            stickyWithSelection
              ? ({ '--table-sticky-2-left': '44px' } as React.CSSProperties)
              : undefined
          }
        >
          <colgroup>
            {hasSelection && (
              <col
                style={{
                  width: stickyWithSelection || stickyFirstOnly ? '44px' : undefined,
                  minWidth: '44px',
                }}
              />
            )}
            {columns.map((col, idx) => {
              const minW = colMinWidth(col.width);
              const isStickyCol =
                (stickyWithSelection && idx === 0) || (stickyFirstOnly && idx === 0);
              return (
                <col
                  key={String(col.key)}
                  style={{
                    width: isStickyCol ? minW : undefined,
                    minWidth: minW,
                  }}
                />
              );
            })}
            {hasRowActions && <col style={{ width: 1, minWidth: 120 }} />}
          </colgroup>
          {header && (
            <thead>
              <tr>
                {hasSelection && (
                  <th
                    scope="col"
                    className={`table-root__th table-root__th--cb ${stickyWithSelection ? 'table-root__cell--sticky-1' : ''}`}
                    aria-label="Select all"
                  >
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={handleSelectAll}
                      ariaLabel="Select all rows"
                    />
                  </th>
                )}
                {columns.map((col, idx) => {
                  const stickyClass =
                    stickyWithSelection && idx === 0
                      ? 'table-root__cell--sticky-2 table-root__cell--sticky-last'
                      : stickyFirstOnly && idx === 0
                        ? 'table-root__cell--sticky-1 table-root__cell--sticky-last'
                        : '';
                  return (
                    <th key={String(col.key)} scope="col" className={`table-root__th ${stickyClass}`.trim()}>
                      {col.header}
                    </th>
                  );
                })}
                {hasRowActions && (
                  <th scope="col" className="table-root__th table-root__th--actions" aria-label="Actions">
                    <span className="table-root__sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={selectedRowIds.includes(row.id) ? 'table-root__tr--selected' : ''}
                aria-selected={selectedRowIds.includes(row.id)}
              >
                {hasSelection && (
                  <td
                    className={`table-root__td table-root__td--cb ${stickyWithSelection ? 'table-root__cell--sticky-1' : ''}`}
                  >
                    <Checkbox
                      checked={selectedRowIds.includes(row.id)}
                      onChange={(checked) => handleSelectRow(row.id, checked)}
                      ariaLabel={`Select row ${row.id}`}
                    />
                  </td>
                )}
                {columns.map((col, idx) => {
                  const stickyClass =
                    stickyWithSelection && idx === 0
                      ? 'table-root__cell--sticky-2 table-root__cell--sticky-last'
                      : stickyFirstOnly && idx === 0
                        ? 'table-root__cell--sticky-1 table-root__cell--sticky-last'
                        : '';
                  return (
                    <td key={String(col.key)} className={`table-root__td ${stickyClass}`.trim()}>
                      {row[col.key as keyof TableRow<T>] ?? ''}
                    </td>
                  );
                })}
                {hasRowActions && (
                  <td className="table-root__td table-root__td--actions">
                    <span className="table-root__actions">
                      <span className="table-root__actions-desktop">{renderRowActions?.(row)}</span>
                      <span className="table-root__actions-mobile">
                        {(renderRowActionsMobile ?? renderRowActions)?.(row)}
                      </span>
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCardView && (
        <>
          <div className="table-root__cards" role="list">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`table-root__card ${selectedRowIds.includes(row.id) ? 'table-root__card--selected' : ''}`}
              role="listitem"
              aria-selected={selectedRowIds.includes(row.id)}
            >
              <div className="table-root__card-head">
                {hasSelection && (
                  <div className="table-root__card-cb">
                    <Checkbox
                      checked={selectedRowIds.includes(row.id)}
                      onChange={(checked) => handleSelectRow(row.id, checked)}
                      ariaLabel={`Select ${row.id}`}
                    />
                  </div>
                )}
                <div className="table-root__card-title">
                  {columns[0] ? String(row[columns[0].key as keyof TableRow<T>] ?? '') : ''}
                </div>
              </div>
              <div
                className={`table-root__card-body ${cardContentColumns === 2 ? 'table-root__card-body--2-cols' : ''}`}
              >
                {columns.slice(1).map((col) => (
                  <div key={String(col.key)} className="table-root__card-field">
                    <span className="table-root__card-label">{col.header}</span>
                    <span className="table-root__card-value">{row[col.key as keyof TableRow<T>] ?? ''}</span>
                  </div>
                ))}
              </div>
              {hasRowActions && (
                <div className="table-root__card-footer">
                  {(renderRowActions ?? renderRowActionsMobile)?.(row)}
                </div>
              )}
            </div>
          ))}
          </div>

          {hasCardFab && (
            <>
              <div ref={cardFabWrapperRef} className="table-root__card-fab-wrapper">
                <FAB
                  icon={MoreVertical}
                  variant="tertiary"
                  position="bottom-right"
                  aria-label="Card actions menu"
                  aria-haspopup="menu"
                  aria-expanded={cardMenuOpen}
                  onClick={() => setCardMenuOpen((o) => !o)}
                />
              </div>
              {cardMenuOpen && (
                <DropdownFieldSheet visible={cardSheetVisible} onClose={closeCardMenu}>
                  <div
                    ref={cardSheetMenuRef}
                    className="dropdown-field__menu dropdown-field__menu--sheet"
                    role="menu"
                    aria-label="Card actions"
                    tabIndex={-1}
                    onKeyDown={handleCardSheetKeyDown}
                  >
                    {hasSelection &&
                      (allSelected ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="dropdown-field__option"
                          onClick={() => handleCardMenuAction(() => handleSelectAll(false))}
                        >
                          <span className="dropdown-field__option-label">Deselecteer alles</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          role="menuitem"
                          className="dropdown-field__option"
                          onClick={() => handleCardMenuAction(() => handleSelectAll(true))}
                        >
                          <span className="dropdown-field__option-label">Selecteer alles</span>
                        </button>
                      ))}
                    {cardActions?.map((action, idx) => (
                      <button
                        key={idx}
                        type="button"
                        role="menuitem"
                        className="dropdown-field__option"
                        onClick={() => handleCardMenuAction(action.onClick)}
                      >
                        <span className="dropdown-field__option-label">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </DropdownFieldSheet>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
