import React from 'react';

export type DropdownFieldSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function DropdownFieldSheet({
  visible,
  onClose,
  children,
}: DropdownFieldSheetProps) {
  return (
    <>
      <div
        className="dropdown-field__sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`dropdown-field__sheet${visible ? ' dropdown-field__sheet--visible' : ''}`}
        role="presentation"
      >
        {children}
      </div>
    </>
  );
}
