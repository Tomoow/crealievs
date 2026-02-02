import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Checkbox } from '../Checkbox';
import type { DropdownFieldOption } from './DropdownField.types';

export type DropdownFieldMenuContentProps = {
  fieldId: string;
  options: DropdownFieldOption[];
  selectedValues: string[];
  activeIndex: number | null;
  isSelectAllActive: boolean;
  selectAllChecked: boolean;
  selectAllIndeterminate: boolean;
  isMultiple: boolean;
  showSelectAll: boolean;
  LeftIcon?: LucideIcon;
  optionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  selectAllRef: React.RefObject<HTMLButtonElement | null>;
  onSelect: (option: DropdownFieldOption) => void;
  onSelectAll: () => void;
  onOptionKeyDown: (
    e: React.KeyboardEvent<HTMLButtonElement>,
    option: DropdownFieldOption,
    index: number
  ) => void;
  closeMenu: () => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSelectAllActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DropdownFieldMenuContent({
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
  onSelect,
  onSelectAll,
  onOptionKeyDown,
  closeMenu,
  setActiveIndex,
  setIsSelectAllActive,
}: DropdownFieldMenuContentProps) {
  return (
    <>
      {isMultiple && showSelectAll && (
        <button
          ref={selectAllRef as React.Ref<HTMLButtonElement>}
          type="button"
          role="option"
          className={`dropdown-field__option dropdown-field__option--select-all${
            isSelectAllActive ? ' dropdown-field__option--active' : ''
          }${selectAllChecked ? ' dropdown-field__option--selected' : ''}${
            selectAllIndeterminate ? ' dropdown-field__option--indeterminate' : ''
          }`}
          onClick={onSelectAll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onSelectAll();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              closeMenu();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              e.stopPropagation();
              const direction = e.key === 'ArrowDown' ? 1 : -1;
              const firstEnabledIndex = options.findIndex((opt) => !opt.disabled);
              if (firstEnabledIndex !== -1) {
                setIsSelectAllActive(false);
                setActiveIndex(firstEnabledIndex);
                setTimeout(() => optionRefs.current[firstEnabledIndex]?.focus(), 0);
              } else if (direction === -1) {
                setIsSelectAllActive(true);
                setActiveIndex(null);
              }
            }
          }}
          onFocus={() => {
            setIsSelectAllActive(true);
            setActiveIndex(null);
          }}
          onMouseEnter={() => {
            setIsSelectAllActive(true);
            setActiveIndex(null);
          }}
          onMouseLeave={() => {
            if (document.activeElement !== selectAllRef.current) {
              setIsSelectAllActive(false);
            }
          }}
        >
          <span className="dropdown-field__option-label">Selecteer alles</span>
          <span
            className="dropdown-field__option-checkbox-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={selectAllChecked}
              indeterminate={selectAllIndeterminate}
              ariaLabel="Selecteer alles"
              state="default"
              onChange={onSelectAll}
              className="dropdown-field__option-checkbox"
              id={`${fieldId}-checkbox-select-all`}
            />
          </span>
        </button>
      )}
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option.value);
        const isActive = activeIndex === index;
        const OptionIcon = option.icon || LeftIcon;
        return (
          <button
            key={option.value}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={option.disabled}
            className={`dropdown-field__option${
              isSelected ? ' dropdown-field__option--selected' : ''
            }${option.disabled ? ' dropdown-field__option--disabled' : ''}${
              isActive ? ' dropdown-field__option--active' : ''
            }`}
            onClick={() => onSelect(option)}
            onKeyDown={(e) => onOptionKeyDown(e, option, index)}
            onFocus={() => {
              setIsSelectAllActive(false);
              setActiveIndex(index);
            }}
            onMouseEnter={() => {
              setIsSelectAllActive(false);
              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              if (document.activeElement !== optionRefs.current[index]) {
                setActiveIndex(null);
              }
            }}
          >
            {OptionIcon && (
              <OptionIcon className="dropdown-field__option-icon" aria-hidden="true" />
            )}
            <span className="dropdown-field__option-label">{option.label}</span>
            {isMultiple && (
              <span
                className="dropdown-field__option-checkbox-wrapper"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Checkbox
                  checked={isSelected}
                  ariaLabel={`${option.label} ${isSelected ? 'selected' : 'not selected'}`}
                  state={option.disabled ? 'disabled' : 'default'}
                  onChange={() => onSelect(option)}
                  className="dropdown-field__option-checkbox"
                  id={`${fieldId}-checkbox-${option.value}`}
                />
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}
