import React from 'react';
import { useFloating, offset, flip, size, Placement } from '@floating-ui/react-dom';
import type { DropdownFieldOption } from './DropdownField.types';
import type { DropdownFieldSingleValue, DropdownFieldMultiValue } from './DropdownField.types';
import { getSelectedValues, getSelectedLabels } from './DropdownField.utils';

/** Match 768px breakpoint (same as DatePicker and field full-width). */
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

export function useDropdownFloating(
  isOpen: boolean,
  isMobile: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  menuRef: React.RefObject<HTMLDivElement | null>
) {
  const { x, y, strategy, refs, placement, update } = useFloating({
    placement: 'bottom-start' as Placement,
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ['top-start', 'bottom-start'] }),
      size({
        apply({ elements, rects }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  React.useEffect(() => {
    if (containerRef.current) refs.setReference(containerRef.current);
  }, [refs, containerRef]);

  React.useEffect(() => {
    if (isOpen && menuRef.current && !isMobile) {
      refs.setFloating(menuRef.current);
      requestAnimationFrame(() => update());
    }
  }, [isOpen, isMobile, refs, update, menuRef]);

  React.useEffect(() => {
    if (!isOpen || isMobile) return;
    const handleUpdate = () => {
      if (refs.reference.current && refs.floating.current) update();
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, isMobile, update, refs]);

  return { x, y, strategy, refs, placement, update };
}

export function useDropdownOpenEffects(opts: {
  isOpen: boolean;
  closeMenu: () => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSelectAllActive: React.Dispatch<React.SetStateAction<boolean>>;
  pendingFocusRef: React.MutableRefObject<'first' | 'last' | null>;
}) {
  const {
    isOpen,
    closeMenu,
    wrapperRef,
    menuRef,
    triggerRef,
    setActiveIndex,
    setIsSelectAllActive,
    pendingFocusRef,
  } = opts;

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeMenu();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, closeMenu, wrapperRef, menuRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, closeMenu]);

  React.useEffect(() => {
    if (!isOpen && triggerRef.current) {
      setIsSelectAllActive(false);
      setActiveIndex(null);
      pendingFocusRef.current = null;
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef, setIsSelectAllActive, setActiveIndex, pendingFocusRef]);
}

export function useSheetVisible(isOpen: boolean, isMobile: boolean) {
  const [sheetVisible, setSheetVisible] = React.useState(false);
  React.useEffect(() => {
    if (isOpen && isMobile) {
      setSheetVisible(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSheetVisible(true));
      });
      return () => cancelAnimationFrame(id);
    }
    if (!isOpen) setSheetVisible(false);
  }, [isOpen, isMobile]);
  return sheetVisible;
}

export function useDropdownSelection(
  isMultiple: boolean,
  value: DropdownFieldSingleValue | DropdownFieldMultiValue,
  options: DropdownFieldOption[],
  showSelectAll: boolean,
  disabled: boolean,
  readOnly: boolean,
  onChange: (v: DropdownFieldSingleValue | DropdownFieldMultiValue) => void,
  closeMenu: () => void
) {
  const selectedValues = React.useMemo(
    () => getSelectedValues(isMultiple, value),
    [isMultiple, value]
  );
  const selectAllIndeterminate = React.useMemo(() => {
    if (!isMultiple || !showSelectAll) return false;
    const enabled = options.filter((o) => !o.disabled);
    if (enabled.length === 0) return false;
    const count = enabled.filter((o) => selectedValues.includes(o.value)).length;
    return count > 0 && count < enabled.length;
  }, [isMultiple, showSelectAll, options, selectedValues]);
  const selectAllChecked = React.useMemo(() => {
    if (!isMultiple || !showSelectAll) return false;
    const enabled = options.filter((o) => !o.disabled);
    return enabled.length > 0 && enabled.every((o) => selectedValues.includes(o.value));
  }, [isMultiple, showSelectAll, options, selectedValues]);
  const selectedLabels = React.useMemo(
    () => getSelectedLabels(options, selectedValues),
    [options, selectedValues]
  );
  const displayText = selectedLabels.length > 0 ? selectedLabels.join(', ') : '';
  const handleSelect = React.useCallback(
    (option: DropdownFieldOption) => {
      if (option.disabled || disabled || readOnly) return;
      if (isMultiple) {
        const current = value as DropdownFieldMultiValue;
        const next = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        (onChange as (v: DropdownFieldMultiValue) => void)(next);
      } else {
        (onChange as (v: DropdownFieldSingleValue) => void)(option.value);
        closeMenu();
      }
    },
    [isMultiple, value, onChange, disabled, readOnly, closeMenu]
  );
  const handleSelectAll = React.useCallback(() => {
    if (disabled || readOnly || !isMultiple) return;
    const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
    const current = value as DropdownFieldMultiValue;
    const next = allValues.every((v) => current.includes(v)) ? [] : allValues;
    (onChange as (v: DropdownFieldMultiValue) => void)(next);
  }, [isMultiple, options, value, onChange, disabled, readOnly]);
  const handleClear = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled || readOnly) return;
      if (isMultiple) {
        (onChange as (v: DropdownFieldMultiValue) => void)([]);
      } else {
        (onChange as (v: DropdownFieldSingleValue) => void)(null);
      }
    },
    [isMultiple, onChange, disabled, readOnly]
  );
  return {
    selectedValues,
    selectAllIndeterminate,
    selectAllChecked,
    selectedLabels,
    displayText,
    handleSelect,
    handleSelectAll,
    handleClear,
  };
}

export function useDropdownCheckboxTabIndex(
  isOpen: boolean,
  isMultiple: boolean,
  menuRef: React.RefObject<HTMLDivElement | null>
) {
  React.useEffect(() => {
    if (!isOpen || !menuRef.current || !isMultiple) return;
    const checkboxInputs = menuRef.current.querySelectorAll('.checkbox-input');
    checkboxInputs.forEach((input) => {
      (input as HTMLInputElement).tabIndex = -1;
    });
  }, [isOpen, isMultiple, menuRef]);
}
