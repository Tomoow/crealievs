import React from 'react';

export type DatePickerSheetProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export function DatePickerSheet({ onClose, children }: DatePickerSheetProps) {
  return (
    <>
      <div
        className="date-picker__sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      {children}
    </>
  );
}
