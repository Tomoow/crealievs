import React from 'react';
import type { DropdownFieldOption } from './DropdownField.types';

type Refs = {
  optionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  selectAllRef: React.RefObject<HTMLButtonElement | null>;
};

type Setters = {
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSelectAllActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useDropdownKeyboard(
  options: DropdownFieldOption[],
  opts: {
    isMultiple: boolean;
    showSelectAll: boolean;
    isDisabled: boolean;
    isReadOnly: boolean;
    activeIndex: number | null;
    isSelectAllActive: boolean;
    refs: Refs;
    setters: Setters;
    closeMenu: () => void;
    handleSelect: (option: DropdownFieldOption) => void;
    handleSelectAll: () => void;
    isOpen: boolean;
    openWithFocus: (where: 'first' | 'last') => void;
  }
) {
  const {
    isMultiple,
    showSelectAll,
    isDisabled,
    isReadOnly,
    activeIndex,
    isSelectAllActive,
    refs,
    setters,
    closeMenu,
    handleSelect,
    openWithFocus,
  } = opts;
  const { optionRefs, selectAllRef } = refs;
  const { setActiveIndex, setIsSelectAllActive } = setters;

  const focusFirstOption = React.useCallback(() => {
    if (isMultiple && showSelectAll && selectAllRef.current) {
      setIsSelectAllActive(true);
      setActiveIndex(null);
      selectAllRef.current.focus();
    } else {
      const idx = options.findIndex((o) => !o.disabled);
      if (idx >= 0 && optionRefs.current[idx]) {
        setIsSelectAllActive(false);
        setActiveIndex(idx);
        optionRefs.current[idx]?.focus();
      }
    }
  }, [isMultiple, showSelectAll, options, optionRefs, selectAllRef, setActiveIndex, setIsSelectAllActive]);

  const focusLastOption = React.useCallback(() => {
    const idx = options.length - 1 - [...options].reverse().findIndex((o) => !o.disabled);
    if (idx >= 0 && optionRefs.current[idx]) {
      setIsSelectAllActive(false);
      setActiveIndex(idx);
      optionRefs.current[idx]?.focus();
    }
  }, [options, optionRefs, setActiveIndex, setIsSelectAllActive]);

  const navigateOptions = React.useCallback(
    (direction: number, startIndex: number | null, includeSelectAll: boolean) => {
      if (options.length === 0) return;

      if (!includeSelectAll) {
        const currentIndex = startIndex ?? (direction === 1 ? -1 : options.length);
        let nextIndex = currentIndex;
        for (let i = 0; i < options.length; i += 1) {
          nextIndex = (nextIndex + direction + options.length) % options.length;
          if (!options[nextIndex].disabled) {
            setIsSelectAllActive(false);
            setActiveIndex(nextIndex);
            setTimeout(() => optionRefs.current[nextIndex]?.focus(), 0);
            return;
          }
        }
        return;
      }

      const currentPos =
        startIndex === null
          ? isSelectAllActive
            ? 0
            : direction === 1
              ? 0
              : options.length + 1
          : startIndex + 1;
      const totalItems = options.length + 1;
      let nextPos = currentPos;

      for (let i = 0; i < totalItems; i += 1) {
        nextPos = (nextPos + direction + totalItems) % totalItems;
        if (nextPos === 0) {
          setIsSelectAllActive(true);
          setActiveIndex(null);
          setTimeout(() => selectAllRef.current?.focus(), 0);
          return;
        }
        const optionIndex = nextPos - 1;
        if (optionIndex >= 0 && optionIndex < options.length && !options[optionIndex].disabled) {
          setIsSelectAllActive(false);
          setActiveIndex(optionIndex);
          setTimeout(() => optionRefs.current[optionIndex]?.focus(), 0);
          return;
        }
      }
    },
    [
      options,
      isSelectAllActive,
      optionRefs,
      selectAllRef,
      setActiveIndex,
      setIsSelectAllActive,
    ]
  );

  const handleTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled || isReadOnly) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!opts.isOpen) {
          openWithFocus(e.key === 'ArrowDown' ? 'first' : 'last');
        } else if (opts.isOpen) {
          if (e.key === 'ArrowDown') focusFirstOption();
          else focusLastOption();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!opts.isOpen) openWithFocus('first');
      } else if (e.key === 'Escape' && opts.isOpen) {
        e.preventDefault();
        closeMenu();
      }
    },
    [isDisabled, isReadOnly, closeMenu, focusFirstOption, focusLastOption, openWithFocus, opts.isOpen]
  );

  const handleMenuKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled || isReadOnly) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        navigateOptions(e.key === 'ArrowDown' ? 1 : -1, activeIndex, isMultiple && showSelectAll);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      } else if (e.key === 'Tab') {
        closeMenu();
      }
    },
    [
      isDisabled,
      isReadOnly,
      activeIndex,
      isMultiple,
      showSelectAll,
      navigateOptions,
      closeMenu,
    ]
  );

  const handleOptionKeyDown = React.useCallback(
    (
      e: React.KeyboardEvent<HTMLButtonElement>,
      option: DropdownFieldOption,
      index: number
    ) => {
      if (isDisabled || isReadOnly || option.disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleSelect(option);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        navigateOptions(e.key === 'ArrowDown' ? 1 : -1, index, isMultiple && showSelectAll);
      }
    },
    [isDisabled, isReadOnly, isMultiple, showSelectAll, handleSelect, closeMenu, navigateOptions]
  );

  return {
    handleTriggerKeyDown,
    handleMenuKeyDown,
    handleOptionKeyDown,
    focusFirstOption,
    focusLastOption,
  };
}
