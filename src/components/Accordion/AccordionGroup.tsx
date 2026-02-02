/**
 * AccordionGroup – context so only one accordion item can be open across all Accordions inside.
 * Wrap multiple <Accordion> components in <AccordionGroup> to enforce single-open behavior.
 * Item ids must be unique across all accordions in the group.
 */
import React, { createContext, useState, useCallback } from 'react';

export type AccordionGroupContextValue = {
  openId: string | null;
  toggle: (id: string) => void;
};

export const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(null);

export type AccordionGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export function AccordionGroup({ children, className = '' }: AccordionGroupProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <AccordionGroupContext.Provider value={{ openId, toggle }}>
      <div className={className.trim() || undefined}>{children}</div>
    </AccordionGroupContext.Provider>
  );
}
