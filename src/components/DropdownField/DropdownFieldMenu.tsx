import React from 'react';
import type { DropdownFieldMenuContentProps } from './DropdownFieldMenuContent';
import { DropdownFieldMenuContent } from './DropdownFieldMenuContent';

export type DropdownFieldMenuProps = {
  menuRef: React.Ref<HTMLDivElement>;
  menuId: string;
  isMultiple: boolean;
  placement?: string;
  variant: 'floating' | 'sheet';
  floatingStyle?: React.CSSProperties;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  contentProps: DropdownFieldMenuContentProps;
};

export function DropdownFieldMenu({
  menuRef,
  menuId,
  isMultiple,
  placement,
  variant,
  floatingStyle,
  onKeyDown,
  onMouseLeave,
  contentProps,
}: DropdownFieldMenuProps) {
  const listboxClassName =
    variant === 'sheet'
      ? 'dropdown-field__menu dropdown-field__menu--sheet'
      : `dropdown-field__menu${placement?.startsWith('top') ? ' dropdown-field__menu--top' : ''}`;

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="listbox"
      aria-multiselectable={isMultiple || undefined}
      className={listboxClassName}
      style={variant === 'floating' ? floatingStyle : undefined}
      onKeyDown={onKeyDown}
      onMouseLeave={onMouseLeave}
      tabIndex={-1}
    >
      <DropdownFieldMenuContent {...contentProps} />
    </div>
  );
}
