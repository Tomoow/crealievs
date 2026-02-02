import React from 'react';
import { getFocusableElements } from './Modal.utils';

export function useModalKeyboard(opts: {
  open: boolean;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const { open, dialogRef, onClose } = opts;

  return React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length === 0) return;
        const current = document.activeElement as HTMLElement;
        const index = focusables.indexOf(current);
        if (index === -1) {
          e.preventDefault();
          (e.shiftKey ? focusables[focusables.length - 1] : focusables[0])?.focus();
          return;
        }
        const nextIndex = e.shiftKey
          ? (index === 0 ? focusables.length - 1 : index - 1)
          : (index === focusables.length - 1 ? 0 : index + 1);
        e.preventDefault();
        focusables[nextIndex]?.focus();
      }
    },
    [open, dialogRef, onClose]
  );
}
