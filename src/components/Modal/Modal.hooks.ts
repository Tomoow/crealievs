import React from 'react';
import { getFocusableElements } from './Modal.utils';

const SHEET_ANIMATION_MS = 250;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handle = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);
  return isMobile;
}

/**
 * Presence + visibility for animated mobile sheet:
 * - open -> render immediately, then toggle visible next frame (slide in)
 * - close -> toggle not visible, then unmount after transition (slide out)
 */
export function useModalPresence(open: boolean, isMobile: boolean): { shouldRender: boolean; visible: boolean } {
  const [shouldRender, setShouldRender] = React.useState(open);
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    if (!isMobile) {
      setShouldRender(open);
      setVisible(open);
      return;
    }

    if (open) {
      setShouldRender(true);
      setVisible(false);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    const t = window.setTimeout(() => setShouldRender(false), SHEET_ANIMATION_MS);
    return () => window.clearTimeout(t);
  }, [open, isMobile]);

  return { shouldRender: isMobile ? shouldRender : open, visible: isMobile ? visible : open };
}

export function useModalOpenEffects(opts: {
  open: boolean;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const { open, dialogRef, onClose } = opts;
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

  /* Body scroll lock when open */
  React.useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  /**
   * Do not auto-focus on open (tooltips show on focus).
   * Instead, when Tab is pressed while the modal is open and focus is outside,
   * redirect focus into the modal.
   */
  React.useEffect(() => {
    if (!open) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const active = document.activeElement as HTMLElement | null;
      if (active && dialog.contains(active)) return;

      const focusables = getFocusableElements(dialog);
      if (focusables.length === 0) return;
      e.preventDefault();
      e.stopPropagation();
      (e.shiftKey ? focusables[focusables.length - 1] : focusables[0])?.focus();
    };
    document.addEventListener('keydown', handleTab, true);
    return () => document.removeEventListener('keydown', handleTab, true);
  }, [open, dialogRef]);

  /* Document-level Escape to close */
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [open, onClose]);

  return { previouslyFocusedRef };
}
