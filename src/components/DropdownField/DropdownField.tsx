import React from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { DropdownFieldProps } from './DropdownField.types';
import { useDropdownKeyboard } from './DropdownField.keyboard';
import {
  useIsMobile,
  useDropdownFloating,
  useDropdownOpenEffects,
  useSheetVisible,
  useDropdownCheckboxTabIndex,
  useDropdownSelection,
} from './DropdownField.hooks';
import { DropdownFieldSheet } from './DropdownFieldSheet';
import { DropdownFieldMenu } from './DropdownFieldMenu';
import type { DropdownFieldMenuContentProps } from './DropdownFieldMenuContent';
import type { DropdownFieldSingleValue, DropdownFieldMultiValue } from './DropdownField.types';
import './DropdownField.css';

export type { DropdownFieldOption, DropdownFieldSingleValue, DropdownFieldMultiValue } from './DropdownField.types';

export const DropdownField: React.FC<DropdownFieldProps> = ({
  multiple,
  value,
  onChange,
  options,
  placeholder = 'Maak een keuze',
  label,
  required = false,
  helperText,
  errorMessage,
  leftIcon: LeftIcon,
  disabled = false,
  readOnly = false,
  showSelectAll = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
}) => {
  const autoId = React.useId();
  const fieldId = id ?? `dropdown-field-${autoId}`;
  const menuId = `${fieldId}-menu`;
  const descriptionId =
    errorMessage || helperText ? `${fieldId}-description` : undefined;

  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [isSelectAllActive, setIsSelectAllActive] = React.useState(false);
  const [triggerFocused, setTriggerFocused] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const selectAllRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocusOnOpenRef = React.useRef<'first' | 'last' | null>(null);

  const isMobile = useIsMobile();
  const hasError = Boolean(errorMessage);
  const isMultiple = Boolean(multiple);
  const isDisabled = disabled;
  const isReadOnly = readOnly;
  const describedByAttr = [ariaDescribedBy, descriptionId]
    .filter(Boolean)
    .join(' ') || undefined;

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setActiveIndex(null);
    setIsSelectAllActive(false);
  }, []);

  const selection = useDropdownSelection(
    isMultiple,
    value,
    options,
    showSelectAll,
    isDisabled,
    isReadOnly,
    onChange as (v: DropdownFieldSingleValue | DropdownFieldMultiValue) => void,
    closeMenu
  );
  const {
    selectedValues,
    selectAllIndeterminate,
    selectAllChecked,
    selectedLabels,
    displayText: selectionDisplayText,
    handleSelect,
    handleSelectAll,
    handleClear,
  } = selection;
  const hasSelection = selectedValues.length > 0;
  const displayText = selectionDisplayText || placeholder;
  const isPlaceholder = selectedLabels.length === 0;

  const openWithFocus = React.useCallback((where: 'first' | 'last') => {
    pendingFocusOnOpenRef.current = where;
    setIsOpen(true);
  }, []);

  const toggleOpen = React.useCallback(
    (e?: React.MouseEvent) => {
      if (isDisabled || isReadOnly) return;
      if (e) e.stopPropagation();
      setIsOpen((prev) => {
        if (!prev) {
          setActiveIndex(null);
          setIsSelectAllActive(false);
        }
        return !prev;
      });
    },
    [isDisabled, isReadOnly]
  );

  const floating = useDropdownFloating(isOpen, isMobile, containerRef, menuRef);
  const sheetVisible = useSheetVisible(isOpen, isMobile);

  useDropdownOpenEffects({
    isOpen,
    closeMenu,
    wrapperRef,
    menuRef,
    triggerRef,
    setActiveIndex,
    setIsSelectAllActive,
    pendingFocusRef: pendingFocusOnOpenRef,
  });

  useDropdownCheckboxTabIndex(isOpen, isMultiple, menuRef);

  const keyboard = useDropdownKeyboard(options, {
    isMultiple,
    showSelectAll,
    isDisabled,
    isReadOnly,
    activeIndex,
    isSelectAllActive,
    refs: { optionRefs, selectAllRef },
    setters: { setActiveIndex, setIsSelectAllActive },
    closeMenu,
    handleSelect,
    handleSelectAll,
    isOpen,
    openWithFocus,
  });

  React.useEffect(() => {
    if (!isOpen || options.length === 0) return;
    const pending = pendingFocusOnOpenRef.current;
    if (!pending) return;
    const apply = () => {
      if (pending === 'first') keyboard.focusFirstOption();
      else keyboard.focusLastOption();
      pendingFocusOnOpenRef.current = null;
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(apply));
    return () => cancelAnimationFrame(id);
  }, [isOpen, options.length, keyboard.focusFirstOption, keyboard.focusLastOption]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (isSelectAllActive && selectAllRef.current) {
      selectAllRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (activeIndex !== null && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex, isOpen, isSelectAllActive]);

  const menuContentProps: DropdownFieldMenuContentProps = {
    fieldId,
    options,
    selectedValues,
    activeIndex,
    isSelectAllActive,
    selectAllChecked,
    selectAllIndeterminate,
    isMultiple,
    showSelectAll,
    LeftIcon,
    optionRefs,
    selectAllRef,
    onSelect: handleSelect,
    onSelectAll: handleSelectAll,
    onOptionKeyDown: keyboard.handleOptionKeyDown,
    closeMenu,
    setActiveIndex,
    setIsSelectAllActive,
  };

  const iconButtonProps = {
    variant: 'default' as const,
    size: 'small' as const,
    tooltipVariant: 'plain' as const,
    tooltipPosition: 'top' as const,
  };
  const triggerAriaLabel = ariaLabel || (typeof label === 'string' ? label : undefined);

  return (
    <div
      ref={wrapperRef}
      className={`dropdown-field-wrapper${hasError ? ' dropdown-field-wrapper--error' : ''} ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={fieldId}
          className={`dropdown-field__label${hasError ? ' dropdown-field__label--error' : ''}`.trim()}
        >
          {label}
          {required && <span className="dropdown-field__required-indicator">*</span>}
        </label>
      )}

      <div
        ref={containerRef}
        className={`dropdown-field-container${hasError ? ' dropdown-field-container--error' : ''}${
          isDisabled ? ' dropdown-field-container--disabled' : ''
        }${isReadOnly ? ' dropdown-field-container--readonly' : ''}${
          isOpen ? ' dropdown-field-container--open' : ''
        }${triggerFocused ? ' dropdown-field-container--focused' : ''}`}
        onClick={(e) => {
          if (isDisabled || isReadOnly) return;
          if ((e.target as HTMLElement).closest('.dropdown-field__actions')) return;
          toggleOpen(e);
        }}
      >
        {LeftIcon && <LeftIcon className="dropdown-field__left-icon" aria-hidden="true" />}

        <button
          ref={triggerRef}
          id={fieldId}
          name={name}
          type="button"
          className="dropdown-field__trigger"
          onClick={(e) => { e.stopPropagation(); toggleOpen(e); }}
          onKeyDown={keyboard.handleTriggerKeyDown}
          onFocus={(e) => { setTriggerFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setTriggerFocused(false); onBlur?.(e); }}
          disabled={isDisabled}
          aria-label={triggerAriaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-describedby={describedByAttr}
          aria-readonly={isReadOnly || undefined}
        >
          <span
            className={`dropdown-field__value${isPlaceholder ? ' dropdown-field__value--placeholder' : ''}`}
          >
            {displayText}
          </span>
        </button>

        <span className="dropdown-field__actions">
          {hasSelection && !isReadOnly && !isDisabled && (
            <>
              <IconButton
                {...iconButtonProps}
                icon={X}
                onClick={handleClear}
                aria-label="Clear selection"
                className="dropdown-field__clear-button"
              />
              <span className="dropdown-field__separator" aria-hidden="true" />
            </>
          )}
          <IconButton
            {...iconButtonProps}
            icon={isOpen ? ChevronUp : ChevronDown}
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); toggleOpen(e); }}
            aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
            className="dropdown-field__chevron-button"
          />
        </span>
      </div>

      {isOpen && options.length > 0 &&
        (isMobile ? (
          <DropdownFieldSheet visible={sheetVisible} onClose={closeMenu}>
            <DropdownFieldMenu
              menuRef={menuRef}
              menuId={menuId}
              isMultiple={isMultiple}
              variant="sheet"
              onKeyDown={keyboard.handleMenuKeyDown}
              onMouseLeave={() => { setIsSelectAllActive(false); setActiveIndex(null); }}
              contentProps={menuContentProps}
            />
          </DropdownFieldSheet>
        ) : (
          <DropdownFieldMenu
            menuRef={menuRef}
            menuId={menuId}
            isMultiple={isMultiple}
            placement={floating.placement}
            variant="floating"
            floatingStyle={{
              position: floating.strategy,
              top: floating.y ?? 0,
              left: floating.x ?? 0,
            }}
            onKeyDown={keyboard.handleMenuKeyDown}
            onMouseLeave={() => { setIsSelectAllActive(false); setActiveIndex(null); }}
            contentProps={menuContentProps}
          />
        ))}

      {descriptionId && (
        <span
          id={descriptionId}
          className={`dropdown-field__helper-text${hasError ? ' dropdown-field__helper-text--error' : ''}`.trim()}
        >
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
};
