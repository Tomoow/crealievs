/**
 * Accordion – Figma 3:53. Collapsible items: trigger (title + chevron) and panel (content).
 * When rendered inside AccordionGroup, only one item can be open across all accordions in the group.
 */
import React, { useState, useCallback, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccordionGroupContext } from './AccordionGroup';
import type { AccordionProps } from './Accordion.types';
import './Accordion.css';

export type { AccordionProps, AccordionItem } from './Accordion.types';

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  className = '',
  'aria-label': ariaLabel,
}: AccordionProps) {
  const groupContext = useContext(AccordionGroupContext);
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds);
  const controlledOrInternal =
    controlledExpandedIds !== undefined ? controlledExpandedIds : internalExpanded;

  const expandedIds = groupContext
    ? groupContext.openId
      ? [groupContext.openId]
      : []
    : controlledOrInternal;

  const toggle = useCallback(
    (id: string) => {
      if (groupContext) {
        groupContext.toggle(id);
        return;
      }
      const isExpanded = controlledOrInternal.includes(id);
      const next = allowMultiple
        ? isExpanded
          ? controlledOrInternal.filter((x) => x !== id)
          : [...controlledOrInternal, id]
        : isExpanded
          ? []
          : [id];
      if (controlledExpandedIds === undefined) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [
      groupContext,
      allowMultiple,
      controlledOrInternal,
      controlledExpandedIds,
      onExpandedChange,
    ]
  );

  return (
    <div
      className={`accordion ${className}`.trim()}
      role="region"
      aria-label={ariaLabel ?? undefined}
    >
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        const triggerId = `accordion-${item.id}-trigger`;
        const panelId = `accordion-${item.id}-panel`;
        return (
          <div key={item.id} className="accordion__item">
            <button
              type="button"
              id={triggerId}
              className="accordion__trigger"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span className="accordion__trigger-text">{item.title}</span>
              <span
                className={`accordion__chevron ${isExpanded ? 'accordion__chevron--expanded' : ''}`}
                aria-hidden="true"
              >
                <ChevronDown className="accordion__chevron-icon" size={20} strokeWidth={2} />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="accordion__panel"
              hidden={!isExpanded}
            >
              <div className="accordion__panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
